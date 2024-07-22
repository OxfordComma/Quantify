'use client'

import React from 'react'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import * as d3 from 'd3'
import { 
  select, 
  scaleTime, 
  scaleLinear, 
  extent,
  axisLeft,
  axisBottom,
  // format,
  area,
  curveBasis,
  stack,
  max,
  sum,
  stackOffsetWiggle,
  csv
} from 'd3';

import LegendGroup from './LegendGroup'

export default function StackedArea({
  data,
  groupBy,
  stackBy,
  agg='sum',
  aggBy,
  stackOffset: offset=d3.stackOffsetNone,
  
  selectedLegendList = [],
  
  onClick = () => {},
  onClickBackground = () => {},
  
  fontSize='1em',
  fontFamily='Roboto',
  
  amplitude = 1,
  
  marginTop=25,
  marginBottom=25,
  marginLeft=75,
  marginRight=25,
  
  dateFormat=d3.utcFormat("%Y-%m-%d"),
  orientation='horizontal',
  axisGap = 25,
  colorScale,

  // Axes
  xFormat=d3.format('.1f'),
  yFormat=d3.format('.1f'),
  showXTitle=true,
  showYTitle=true,
  showXAxis=true,
  showYAxis=true,
  showXTickLabels=true,
  showYTickLabels=true,
  xTicks,
  yTicks,
  xTickOffset=0,
  yTickOffset=0,
  xLabelSize=5,
  yLabelSize=5,

}) {

  function detectScaleType(datum, accessor) {
    if (accessor(datum) instanceof Date) 
      return 'date'

    else 
      return typeof(accessor(datum))
  }
  
  const d3Container = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const [seriesData, setSeriesData] = useState([])

  let stackOffset = offset=='silhouette'?
    d3.stackOffsetSilhouette : offset=='wiggle'?
    d3.stackOffsetWiggle : d3.stackOffsetNone


  function handleResize() {
    const width = d3Container.current?.clientWidth
    const height = d3Container.current?.clientHeight

    const dimensions = {
      width: width,
      height: height,
      drawWidth: width - marginRight - marginLeft,
      drawHeight: height - marginBottom - marginTop
    }

    console.log('resized to: ', 
      dimensions
    )
    setDimensions(dimensions);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, [] );

  useEffect(() => { 
    handleResize()
  }, [seriesData])


  let reducer
  if(agg=='count') {
    reducer = v => v.length
  }
  else if (agg=='max') {
    reducer = v => d3.max(v, d => d[aggBy]) 
  }
  else if(agg=='sum') {
    reducer = v => d3.sum(v, d => d[aggBy])
  }

  useEffect(() => {
    let groupedMap = d3.group(data, d => d[groupBy], d => d[stackBy])

    const stackKeys = [...new Set(data.map(d => d[stackBy]))]


    // Format as necessary for the stacking
    const dataStacked = Array.from(groupedMap.entries())
      .map(g => {
        const obj = {};
        obj[groupBy] = g[0];
        for (let col of stackKeys) {
          const vals = g[1].get(col);
          obj[col] = !vals ? 0 : reducer(Array.from(vals.values()));
        }
        return obj;
      })
      .sort((a, b) => a[groupBy] - b[groupBy]);

    var stack = d3.stack(dataStacked)
      .keys(stackKeys)
      .offset(stackOffset)
      // .offset(d3.stackOffsetSilhouette)
      // .offset(d3.stackOffsetWiggle)

    var series = stack(dataStacked);
    // console.log('series:', series)
    
    setSeriesData(series)

    

  }, [data, groupBy, stackBy, agg, aggBy, stackOffset])

  useEffect(() => {
    let selection = select(d3Container.current)
    let xAxisLabel = orientation == 'horizontal' ? groupBy : `${agg}(${stackBy})`
    let xLabel = selection.select('.x-label').selectAll('text').data([groupBy], d => d)

    let transform = `translate(${dimensions.drawWidth/2}, ${dimensions.height - marginBottom + 5})`

    let xLabelEnter = xLabel.enter().append('text')
        // .attr('transform', transform)
        .attr('transform', transform + ', ' + `translate(-50, 0)`)
        .attr('opacity', 0)

    xLabel
      .text(showXTitle ? xAxisLabel : '')
      .transition().duration(400).ease(d3.easeCircleOut)
        .attr('transform', transform)
        .attr('opacity', 1)

    xLabel.exit()
      .transition().duration(400).ease(d3.easeCircleOut)
        .attr('opacity', 0)
        .attr('transform', transform + ', ' + `translate(50, 0)`)
        .remove()

  }, [groupBy, dimensions])

  useEffect(() => {
    let selection = select(d3Container.current)
    let yAxisLabel = orientation == 'horizontal' ? `${agg}(${aggBy})` : groupBy
    let yLabel = selection.select('.y-label').selectAll('text').data([aggBy], d => d)

    let transform = `translate(${0}, ${15})`
    let yLabelEnter = yLabel
      .enter().append('text')
        .attr('transform', transform + ', ' + `translate(-50, 0)`)
        .attr('opacity', 0)

    yLabel
      .text(showYTitle ? yAxisLabel : '')
      .transition().duration(400).ease(d3.easeCircleOut)
        .attr('transform', transform)
        .attr('opacity', 1)

    yLabel.exit()
      .transition().duration(400).ease(d3.easeCircleOut)
        .attr('opacity', 0)
        .attr('transform', transform + ', ' + `translate(50, 0)`)
        .remove()

  }, [aggBy, dimensions])
  
  useEffect(() => {
    console.log('selectedLegendList:', selectedLegendList)
    let selection = select(d3Container.current)
      .select('.stacked-area-container')

    // Not working - doesn't remove properly
    // const artistText = selection.selectAll('.artist-text').data(selectedLegendList)
    // const artistTextEnter = artistText.enter().append('g')
    //     .attr('class', 'artist-text d-block d-md-none')
    //     .attr('transform', 'translate(-20, 95) rotate(90)')
    
    // artistTextEnter.merge(artistText)
    //   .append('text')
    //     .transition()
    //       .duration(500)
    //     .attr('x', '0')
    //     .attr('y', '0')
    //     .attr('fill', colorScale)
    //     .attr('background-color', 'brown')
    //     .text(d => d)

    // artistText.exit()
    //   .remove()

    // artistTextEnter.exit().remove()

    const lines = selection.selectAll('.line-path')//.data(series);

    
    // const linesEnter = lines.enter()
    //   .append('path')
    //     .attr('class', 'line-path') 
    //     .attr('fill', d => stackColorScale(d))
    //     // .attr('opacity', 0.2)
    //     .attr('id', d => d['key'])
    //     .attr('transform', `translate(0, ${(width)/2 + position})`)

    // lines.merge(linesEnter)
    //   .on('click', d => onClick(d))
    //   .attr('d', areaGenerator)
    //   .append('title')
    //     .text(d => d[stackBy])
    
    const display = d => (selectedLegendList.length == 0 || selectedLegendList.includes(d['key']))
    lines.merge(lines)
      .transition().duration(200)
          .attr('opacity', d => {
            const opacity = display(d) ? 1 : 0.1
            // console.log('opacity:', opacity, d)
            return opacity;
           })
          .attr('stroke-width', d => display(d) ? 0.05 : 0);
  
  }, [selectedLegendList])

  
  useEffect(() => {
    const stackKeys = [...new Set(data.map(d => d[stackBy]))]
    let stackDomain = [...stackKeys]
    // let stackRange = stackKeys.map((d, i) => d3['interpolateRainbow'](i/(stackDomain.length+1)))
    let stackRange = colorScale ?? d3.schemeCategory10
    
    const stackColorScale = d3.scaleOrdinal()
      .domain(stackDomain)
      .range(stackRange)

    // const selection = select(d3Container.current)

      let selection = select(d3Container.current)
        .on('click', onClickBackground)

      selection = selection.select('.stacked-area-container')

      const g = selection.selectAll('.stacked-area').data([null]);

      let sums = d3.rollup(data, reducer, d => d[groupBy])
  
      let sumsMax = d3.max(sums.values()) 
      sumsMax = sumsMax / amplitude
      let sumsDomain = [0, sumsMax]

      let groupByDomain = [
        d3.min(data.map(d => d[groupBy])),
        d3.max(data.map(d => d[groupBy]))
      ];


      let xDomain, xRange
      if (orientation == 'horizontal'){
        xDomain = groupByDomain
        xRange = [marginLeft, dimensions.drawWidth]
        
        if (!xFormat)
          xFormat = detectScaleType(data[0], d => d[groupBy]) == 'date' ? dateFormat : xFormat
      }
      else if (orientation == 'vertical') {
        xDomain = sumsDomain
        if (offset=='silhouette'||offset=='wiggle')
          xDomain[0] = -xDomain[1]
        xRange =  [marginLeft, dimensions.drawWidth]
        
        if (!xFormat)
          xFormat = detectScaleType(data[0], d => d[aggBy]) == 'date' ? dateFormat : format
      }

      const xScale = scaleTime()
        .domain(xDomain)
        .range(xRange)
        // .nice()

      
      // X-axis
      const xAxis = axisBottom(xScale)
        .ticks(xTicks)
        .tickSize(5)
        // .tickPadding(15)
        .tickFormat(xFormat);

      const xAxisG = selection.select('.x-axis-g').data([null])


    xAxisG
      .transition().duration(200)
        .call(xAxis)
        .selectAll('text')
          .attr('text-anchor', 'middle')
          // .attr('transform', `rotate(90)`)
          .attr('font-size', fontSize)
          .attr('font-family', fontFamily)
    // Y scale

    if (!showXAxis) {
      xAxisG.selectAll('line, path').remove()
    }

    if (!showXTickLabels) {
      xAxisG.selectAll('text').remove()
    }
   
    
    let yDomain, yRange
    if (orientation == 'horizontal') {
      yDomain = sumsDomain
      if (offset=='silhouette'||offset=='wiggle')
        yDomain[0] = -yDomain[1]

      yRange = [dimensions.drawHeight - (showXTitle ? axisGap : 0) + (showXAxis ? 0 : axisGap), (showYTitle ? axisGap : 0) + marginTop]
      
      if (!yFormat)
        yFormat = detectScaleType(data[0], d => d[aggBy]) == 'date' ? dateFormat : format
    }
    else if (orientation == 'vertical') {
      yDomain = groupByDomain
      yRange = [marginTop, dimensions.drawHeight + (showXAxis ? 0 : axisGap)]
      
      if (!yFormat)
        yFormat = detectScaleType(data[0], d => d[groupBy]) == 'date' ? dateFormat : yFormat
      // console.log(detectScaleType(data[0], d => d[groupBy]))
    }

    
    const yScale = scaleTime()
      .domain(yDomain)
      .range(yRange)
      // .nice(); 

    const yAxis = axisLeft(yScale)
      .ticks(yTicks)
      // .tickSize(5)
      .tickPadding(yTickOffset)
      .tickFormat(yFormat);
    
    const yAxisG = selection.select('.y-axis-g').data([null])
    // const yAxisGEnter = hEnter
    //   .append('g')
    //     .attr('class', 'y-axis');
    
    yAxisG
      // .merge(yAxisG)
        .transition().duration(200)
        .call(yAxis)
          .attr('pointer-events', 'none')
            .selectAll('text')
            // .attr('transform', `rotate(90)`)
          .attr('font-size', fontSize)
          .attr('font-family', fontFamily)


    if (!showYAxis) {
      yAxisG.selectAll('line, path').remove()
    }

    if (!showYTickLabels) {
      yAxisG.selectAll('text').remove()
    }

    let areaGenerator
    if (orientation == 'horizontal') {
      areaGenerator = area()
        .x(d => xScale(d.data[groupBy]))
        // .x(d => xScale(getDateFromWeek(d.data.week)))
        .y0(d => yScale(selectedLegendList.length != 0 && (selectedLegendList.includes(d.artist)) ? 0 : d[0]))
        .y1(d => yScale(selectedLegendList.length != 0 && (selectedLegendList.includes(d.artist)) ? d[1] - d[0] : d[1]))
        .curve(curveBasis);
    }
    else if (orientation == 'vertical') {
      areaGenerator = area()
        .y(d => yScale(d.data[groupBy]))
        // .x(d => xScale(getDateFromWeek(d.data.week)))
        .x0(d => xScale(selectedLegendList.length != 0 && (selectedLegendList.includes(d.artist)) ? 0 : d[0]))
        .x1(d => xScale(selectedLegendList.length != 0 && (selectedLegendList.includes(d.artist)) ? d[1] - d[0] : d[1]))
        .curve(curveBasis);
    }

    
    // const lastYValue = d =>
    //   yValue(d.values[d.values.length - 1]);
    
    const lines = selection
      .select('.stacked-area').selectAll('.line-path')
        .data(seriesData, d=>d['key']);

    const linesEnter = lines.enter()
      .append('path')
        .attr('class', 'line-path') 
        .attr('fill', d => stackColorScale(d['key']))
        .attr('opacity', 1)
        .attr('id', d => d['key'])
        .attr('cursor', 'pointer')

    lines//.merge(linesEnter)
        .on('click', d => onClick(d))
        .transition().duration(200)
        .attr('d', areaGenerator)
        // lines
        // .append('title')
        //   .text(d => d[stackBy])
    
    // lines//.merge(linesEnter)
    //   // .transition()
    //     // .duration(200)
    //       .attr('opacity', d => {
    //         // return 0.2
    //         // console.log(d);
    //         const opacity = (selectedLegendList.length == 0 || selectedLegendList.includes(d['key']) ? 1 : 0.1)
    //         // console.log('opacity should be:', opacity)
    //         return opacity;
    //        })
    //       .attr('stroke-width', d => (selectedLegendList.length != 0 || selectedLegendList.includes(d['key'])) ? 0.05 : 0)
    //       .attr('z-index', 10)
  }, [dimensions, seriesData, orientation, offset])








  const legendRef = useRef()

  function detectScaleType(datum, accessor) {
    if (accessor(datum) instanceof Date) 
      return 'date'

    else 
      return typeof(accessor(datum))
  }

  let by = stackBy

  let format=d3.format('.0f')
  let title = ''
  let margin={
    left: 0,
    right: 0,
    top: 10,
    bottom: 0
  }
  let ticks=10
  let radius=5

  
  function instantiateBy() {
    if (typeof(by) == 'string') {
      by = {
        name: by,
      }
    }
    else {
      by = {
        ...by,  
      }
      
    }
    if (!by.accessor) {
      by.accessor = d => d[by.name]
    }

    if (by.scale) {
      by.scale = by.scale.copy()
    }
    else {
      let scaleType = detectScaleType(data[0], by.accessor)
      console.log('legend scale type:', scaleType, by.accessor(data[0]))

      if (scaleType == 'number' || scaleType == 'date') {
        by.scale = d3.scaleLinear(colorScale ?? by.colorScale ?? continuousColorScale)
        if (min) {
          by.min = min
        }
        else {
          by.min = d3.min(data, d => +by.accessor(d))

        }

        if (max) {
          by.max = max
        }
        else {
          by.max = d3.max(data, d => +by.accessor(d))
        }
        
        by.scale.domain([by.min, by.max])
        by.span = by.max - by.min
        by.format = format
      }
      else {
        by.scale = d3.scaleOrdinal(colorScale ?? by.colorScale ?? discreteColorScale)
        let discreteValues = [...new Set(data.map(by.accessor))]//.sort()
        by.scale.domain(discreteValues)
        by.span = undefined
        by.format = format
      }

      if (scaleType == 'date') {
        by.format = dateFormat
      }
    }
    return by

  }
  
  const [byAxis, setByAxis] = useState(() => {
    return instantiateBy()
  })

  
  useEffect(() => {
    let newByAxis = instantiateBy()

      setByAxis(newByAxis)
  }, [by])


  useEffect(() => {


    console.log('legend SLL:', selectedLegendList)
    let dateLegendFormat = byAxis.format ?? dateFormat
    let dateLegendFunc = ({ i, genLength, generatedLabels }) => dateLegendFormat(generatedLabels[i])
    
    let scaleType = detectScaleType(data[0], byAxis.accessor)
    console.log('scale type:', scaleType)

    if (scaleType != 'number' && scaleType != 'date') {
      ticks = [...new Set(data.map(d => byAxis.accessor(d)))].length
    }
    else {
      ticks = (byAxis.scale.domain()[1] - byAxis.scale.domain()[0]) % 10 + 1
    }

    let selection = d3.select(legendRef.current)


    // var legendLinear = legendColor()
    //  .labelFormat(scaleType == 'date' ? format : byAxis.format)
    //  .labels(scaleType == 'date' ? dateLegendFunc : byAxis.cell ?? undefined
    //  )
    //   .shapeWidth(30)
    //   .cells(ticks)
    //   .title(byAxis.name)
    //   .orient(orientation)
    //   .scale(byAxis.scale)
    //  .on('cellclick', d => onClickLegend(d))
        
    //  selection.selectAll(".legendLinear").remove()

    // Title
    // let t = selection.selectAll('.title').data([byAxis.name])
      
    // t.enter().append('g')
    //    .append('text')
    //      .text(byAxis.name)

    let spacing = 25

    var l = selection.selectAll(".legend-container").data([null])
      .enter().append("g")
        .attr("class", "legend-container")
        .on('click', onClickBackground)
      //    // .attr("transform", "translate(20,20)")
          // .call(legendLinear)

    let titleText = l.selectAll('.title').data([byAxis.name])


    titleText.enter().append('g')
      .attr('class', 'title')
        .append('text').text(title ? byAxis.name : '')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const legendItems = l//selection.select('.legend-container')
      .selectAll('.legend-item').data(byAxis.scale.domain());
    
    const legendItemsEnter = legendItems
      .enter().append('g')
        .attr('class', 'legend-item')
        // .attr('opacity', 1)
        .on('click', onClick)

    legendItems.exit().remove()
    

    legendItemsEnter.append('circle')
      .merge(legendItems.select('circle'))
        .attr('r', radius)
        .attr('fill', d => byAxis.scale(d))
        // .attr('fill-opacity', 1)
    
    legendItemsEnter.append('text')
      .merge(legendItems.select('text'))   
        .text(d => d)
        .attr('id', d => d)
        .attr('dy', '0.32em')
        .attr('x', radius * 2)
        .attr('text-anchor', 'start')



        console.log(selectedLegendList)
    legendItemsEnter.merge(legendItems)
      // .transition().duration(350)
      .attr('transform', (d, i) => {
        var textLengths = d3.selectAll('.legend-item').selectAll('text').nodes().map(n => n.getComputedTextLength())
        //                  Each circle + some padding
        // var totalWidth = this.props.direction == 'horizontal' ? 
        //  this.props.radius * 4 * textLengths.length + d3.sum(textLengths) + 20 : 
        //  this.props.radius * 4 + d3.max(textLengths) + 20

        if (orientation == 'horizontal') {
          return `translate(${ offset + (radius * 4 * i) + d3.sum(textLengths.slice(0, i)) }, 0)`
        }

        if (orientation == 'vertical') {
          return `translate(${ offset }, ${ (radius * i * 4) + (title ? 25 : 0) })`
        }

        else {
          return `translate(${margin.left}, ${margin.top})`
        }

      })
      
      .attr('fill', d => console.log(selectedLegendList.length == 0 || selectedLegendList.includes(d) ))

      // let legendItems = l.selectAll('.legend-items').data([null])
      //  .enter().append('g')
      //    .attr('class', 'legend-items')

      // legendItems.selectAll('.legend-item').data(byAxis.scale.domain())
      //    .enter().append('text').text(d => d)
      //      .attr('transform', (d, i) => `translate(0, ${spacing * i})`)

  }, [byAxis, title])

  useEffect( () => {
    let selection = d3.select(legendRef.current)
    const legendItems = selection.select('.legend-container')
      .selectAll('.legend-item')
    
    legendItems
      .transition().duration(200)
      .attr('opacity', d => { 
        let opacity = (selectedLegendList.length == 0 || selectedLegendList.includes(d) ) ? 1 : 0.1
        console.log('opacity:', opacity); 
        return opacity
      } )

  }, [selectedLegendList])







  
  

  return (
    <svg id='stacked-area-artist-svg' style={{'width': '100%', 'height': '100%'}} ref={d3Container}>

    <g class='stacked-area-container'>

        <g className='stacked-area'>

        </g>
        <g className='axes'>
          <g className='x-axis-g' style={{'font-family': null}}
            transform={`translate(${0}, ${dimensions.drawHeight - (showXTitle ? axisGap : 0)})`}></g>
          <g className='y-axis-g'
            transform={`translate(${marginLeft}, ${0})`}></g>
        </g>
      </g>
      <g className='labels'>
        <g className='x-label'></g>
        <g className='y-label'></g>
        {/*<text className="x-axis-label axis-label" >
          {xAxisLabel}
        </text>

        <text className="y-axis-label axis-label" transform={`translate(${0}, ${15})`}>
          {yAxisLabel}
        </text>*/}
          {/*<g transform={`translate(${dimensions.width/2},0)`}>{title}</g>*/}
      </g>
        <LegendGroup
          by={stackBy}
          data={data}
          selectedLegendList={selectedLegendList}
          onClick={onClick}
          onClickBackground={onClickBackground}
          colorScale={colorScale}
          title={''}
          // discreteColorScale={d3.interpolateRainbow}
          // min={props.legendMin}
          // max={props.legendMax}
          // ticks={props.legendTicks}
          // format={props.legendFormat}
          // nice={'nice'}
          drawWidth={dimensions.drawWidth}
          fontSize={fontSize}
        />
      </svg>
  )
};
