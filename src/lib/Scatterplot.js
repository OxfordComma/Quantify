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
  format,
  area,
  curveBasis,
  stack,
  max,
  sum,
  stackOffsetWiggle,
  csv
} from 'd3';

export default function Scatterplot({
	x,
	y,
	keyBy,
	hue,
	size,
	data=[],
	marginLeft=25,
	marginTop=25,
	marginRight=25,
	marginBottom=25,
	xAxisMargin=10,
	// yAxisMargin=0,
	width=400,
	height=300,
	title='title',
	transitionSpeed=200,
	xMin=undefined,
	xMax=undefined,
	yMin=undefined,
	yMax=undefined,
	xTicks=10,
	yTicks=10,
	xFormat=undefined,
	yFormat=undefined,
	xLabel=undefined,
	yLabel=undefined,
	radius=15,
	fill=undefined,
	color='green',
	discreteColorScale=d3.schemeCategory10,
	continuousColorScale=['yellow', 'red'],
	format=d3.format('.0f'),
	dateFormat=d3.utcFormat("%Y-%m-%d"),
	onClickBackground=()=>{},
	onClickChartItem=()=>{},
}) {
  const d3Container = useRef(null)
	const [dimensions, setDimensions] = useState({ 
  	width: 100, height: 100, drawWidth: 100, drawHeight: 100 
  });

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

 	function detectScaleType(datum, accessor) {
 		if (accessor(datum) instanceof Date) 
 			return 'date'

 		else 
 			return typeof(accessor(datum))
 	}


 	function instantiateX() {
 		if(typeof(x) == 'string') {
			x = {
				name: x,
				// accessor: d => d[x.name],
			}
		}
		else {
			x = {
				...x,
			}
		}

		if (!x.accessor) {
			x.accessor = d => d[x.name]
		}

		if (!x.title) {
			x.title = x.name
		}

		if (xMin) {
			x.min = xMin
		}
		else {
			x.min = d3.min(data, d => +x.accessor(d))
		}

		if (xMax) {
			x.max = xMax
		}
		else {
			x.max = d3.max(data, d => +x.accessor(d))
		}


		if (x.scale) {
			x.scale = x.scale.copy()
		}
		else {
			// let xAxisMin, xAxisMax
			let scaleType = detectScaleType(data[0], x.accessor)
			console.log('x scale type:', scaleType)
			let domain

			if (scaleType == 'number' || scaleType == 'date')  {
				domain = [x.min, x.max]
				// console.log('x linear', domain)
				x.scale = d3.scaleLinear()
				x.span = x.max - x.min
			}
			else {
				domain = [...new Set(data.map(d => x.accessor(d)))].sort()
				x.scale = d3.scalePoint()
				// console.log('x ordinal', domain)
				// x.scale.domain(discreteValues)
			}

			// if (scaleType == 'date') {
				// console.log('date:', this.props.data.map(d => x.accessor(d)).filter(d => d))
				// xAxisMin = data.map(d => x.accessor(d)).filter(d => d).reduce((a, b) => a < b ? a : b)
				// xAxisMax = data.map(d => x.accessor(d)).filter(d => d).reduce((a, b) => a > b ? a : b)
			// }
			// else {
			
				// console.log('xAxis.min', x.min)
				// xAxisMin = Math.max(...[x.min, min].filter(Number.isFinite))
				// xAxisMax = Math.min(...[x.max, max].filter(Number.isFinite))
			// } 

			// if (xMin != undefined) {
			// 	xAxisMin = xMin
			// }
			
			// console.log({x: x})

			// let domain, range

			// If linear scale, domain length is 2 by default
			// let isLinearScale = x.scale.domain().length == 2
			// if (isLinearScale) { 
			// if (scaleType == 'number' || scaleType == 'date')  {
				// domain = [min, max]
				// console.log('x linear', domain)
			// }
			// else {
			// 	domain = [...new Set(data.map(d => x.accessor(d)))].sort()
			// 	x.scale = d3.scalePoint()
			// 	console.log('x ordinal', domain)
			// 	// x.scale.domain(discreteValues)
			// }
			

			x.scale.domain(domain)
			x.scale.range([marginLeft, dimensions.drawWidth - marginRight])
			// x.scale.nice()
			if (!x.format) {
				if (scaleType == 'date') {
					x.format = dateFormat
				}
				else if (scaleType == 'number')
					x.format = format
				}
		}
		

		return x
 	}
  
  const [xAxis, setXAxis] = useState(() => {
  	return instantiateX()
  })

  function instantiateY() {
 		if(typeof(y) == 'string') {
			y = {
				name: y,
				// accessor: d => d[y],
			}
		}
		else {
			y = {
				...y,
			}

		}
		if (!y.accessor) {
			y.accessor = d => d[y.name]
		}

		if (!y.title) {
			y.title = y.name
		}

		if (y.scale) {
			y.scale = y.scale.copy()
		}
		else {
			y.scale = d3.scaleLinear()
		}

		// console.log({y: y})

		// let yAxisMin, yAxisMax
		// let scaleType = detectScaleType(data[0], newXAxis.accessor)


		// Update Domain
		if (yMin) {
			y.min = yMin
		}
		else {
			y.min = d3.min(data, d => +y.accessor(d))
		}

		if (yMax) {
			y.max = yMax
		}
		else {
			y.max = d3.max(data, d => +y.accessor(d))	
		}
		

		// yAxisMin = Math.max(...[newYAxis.min, min].filter(Number.isFinite))
		// yAxisMax = Math.min(...[newYAxis.max, max].filter(Number.isFinite))

		// if (yMin != undefined) {
		// 	yAxisMin = yMin
		// }

		// let newYAxis = yAxis
		y.span = y.max - y.min
		y.scale.domain([y.min, y.max])
		y.scale.range([dimensions.height - marginBottom - xAxisMargin, marginTop])
		y.scale.nice()

		return y
 	}

  const [yAxis, setYAxis] = useState(() => {
		return instantiateY()
  })

  function instantiateHue() {
  	if(typeof(hue) == 'string') {
			hue = {
				name: hue,
				// accessor: d => d[hue],
			}
		}
		else {
			hue = {
				...hue,
			}
			
		}
		if (!hue.accessor) {
			hue.accessor = d => d[hue.name]
		}

		if (hue.scale) {
			hue.scale = hue.scale.copy()
		}
		else {
			let scaleType = detectScaleType(data[0], hue.accessor)
			// console.log('hue scale type:', scaleType)
			
			if (scaleType == 'number' || scaleType == 'date') {
				hue.scale = d3.scaleLinear()
				hue.min = d3.min(data, hue.accessor)
				hue.max = d3.max(data, hue.accessor)

				hue.scale.domain([hue.min, hue.max])
				hue.scale.range(hue.colorScale ?? continuousColorScale)
			}
			else {
				hue.scale = d3.scaleOrdinal()
				let unique = [...new Set(data.map(hue.accessor))].sort()
				hue.scale.domain(unique)
				hue.scale.range(hue.colorScale ?? discreteColorScale)
			}
		}

		return hue
  }

  const [hueAxis, setHueAxis] = useState(() => {
	  return instantiateHue()
	})

	function instantiateSize() {
		if(typeof(size) == 'string') {
			size = {
				name: size,
				// accessor: d => d[size],
			}
		}
		else {
			size = {
				...size,
			}
		}

		if (!size.accessor) {
			size.accessor = d => d[size.name]
		}

		if (size.scale) {
			size.scale = size.scale.copy()
		}
		else {
		// if (true) {
			let scaleType = detectScaleType(data[0], size.accessor)

			if (scaleType == 'number' || scaleType == 'date') {
				size.scale = d3.scaleLinear()
				if (!size.min)
					size.min = d3.min(data, (d) => +size.accessor(d))
				
				if (!size.max)
					size.max = d3.max(data, (d) => +size.accessor(d))

				size.scale.domain([size.min, size.max])
				size.scale.range([radius * 1.25, radius * 0.75])
			}
			else {
				size.scale = d3.scaleBand()
				let domain = [...new Set(data.map(d => size?.accessor(d)))].sort()
				size.scale.domain(domain)

				if (domain.length > 1)
					size.scale.range([radius * 1.25, radius * 0.75])
				else
					size.scale.range([radius, radius])

			}
		}

		return size
	}

	const [sizeAxis, setSizeAxis] = useState(() => {
	  return instantiateSize()
	})

  
	useEffect(() => {	
		handleResize()
	}, [])

  useEffect(() => {
  	let newXAxis = instantiateX()

  	setXAxis(newXAxis)
  }, [x, xMin, xMax, dimensions])



	useEffect( () => {
  	let newYAxis = instantiateY()
		setYAxis(newYAxis)

	}, [y, yMin, yMax, dimensions])

	useEffect(() => {
		let newHueAxis = instantiateHue()

		setHueAxis(newHueAxis)

	}, [hue, dimensions])


	useEffect(() => {
		let newSizeAxis = instantiateSize()

		setSizeAxis(newSizeAxis)
	}, [size, dimensions])

		


	useEffect(() => {	
		let background = d3.select('.chart-container').selectAll('rect').data([null])

		// Create the transparent background width
		background.enter().append('rect')
			.attr('class', 'chart-container')
			.attr('x', 0)   
			.attr('y', 0)   
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('opacity', 0)
			// .on('click', d => onClickBackground(d))

			// Select all circles and bind data
			let circles = d3.select('.chart-container')
				.selectAll('circle')
				.data(data, keyBy ? keyBy : null);

			// Use the .enter() method to get your entering elements, and assign their positions
			let circlesEnter = circles
				.enter().append('circle')
				.attr('class', 'chart-item')
				.style('cursor', 'pointer')
				.attr('cx', d => xAxis.scale(xAxis.accessor(d)) )
				.attr('cy', d => yAxis.scale(yAxis.accessor(d)) )
				// .on('mouseover', tip.show)
				// .on('mouseout', tip.hide)
				// .on('mouseover', setTooltip ? (e, d) => setTooltip(d) : null)
				// .on('mouseout', setTooltip ? (e, d) => setTooltip(undefined) : null)
				.style('fill-opacity', 0)
				
			// console.log('hue', xAxis.accessor(1))
			circlesEnter.merge(circles)
				.on('click', d => onClickChartItem(d))
				.transition().duration(transitionSpeed)
					.attr('fill', d => fill ? d[fill] : hueAxis ? hueAxis.scale( hueAxis.accessor(d)) : color)
					.attr('r', d => sizeAxis ? sizeAxis.scale( sizeAxis.accessor(d)) : radius)				
					.attr('cx', d => xAxis.scale(xAxis.accessor(d)) )
					.attr('cy', d => yAxis.scale(yAxis.accessor(d)) )
					.style('fill-opacity', d => (dimensions.width >  0) ? 1 : 0)
					.style('stroke', 'black')
					.style('stroke-width', 0.5)
					.style('stroke-opacity', d => (dimensions.width > 0) ? 1 : 0)

			// Use the .exit() and .remove() methods to remove elements that are no longer in the data
			circles.exit()
				.transition().duration(transitionSpeed)
					.style('fill-opacity', 0)
				.remove();

		}, [data, xAxis, yAxis, hueAxis, sizeAxis])



		useEffect(() => {
			// let scaleType = detectScaleType(data[0], )

			let xAxisTicks = xTicks
			// let xDomainSpan = xAxis.scale.domain()[1] - xAxis.scale.domain()[0]
			if (xAxis.span < 10) {
				xAxisTicks = xAxis.span
			}
			let yAxisTicks = yTicks
			// let yDomainSpan = yAxis.scale.domain()[1] - yAxis.scale.domain()[0]
			if (yAxis.span < 10) {
				yAxisTicks = yAxis.span
			}

			// Graph width and height - accounting for margins
			let xAxisFunction = d3.axisBottom()
				.scale(xAxis.scale)
				.ticks(xAxisTicks)
				.tickFormat(xAxis.format)

			let yAxisFunction = d3.axisLeft()
				.scale(yAxis.scale)
				.ticks(yAxisTicks)
				.tickFormat(yAxis.format);

			d3.select('.x-axis-g')
				.transition().duration(transitionSpeed)
				.call(xAxisFunction)
				.attr('font-family', null)


			d3.select('.y-axis-g')
				.transition().duration(transitionSpeed)
				.call(yAxisFunction)
				.attr('font-family', null)

	}, [xAxis, yAxis, sizeAxis, hueAxis, dimensions])

	return (
		<div>
		
			<svg ref={d3Container} width='100%' height='100%' >
				<g className='chart-container' >
					<g transform={`translate(${dimensions.width/2},0)`}>{title}</g>
					
					<g className='x-axis-g' style={{'font-family': null}}
						transform={`translate(${0}, ${dimensions.height - marginBottom - xAxisMargin})`}></g>
					<g className='y-axis-g'
						transform={`translate(${marginLeft}, ${0})`}></g>
				</g>
				<text className="x-axis-label" transform={`translate(${dimensions.width/2}, ${dimensions.height - 5})`}>
					{xAxis.title}
				</text>

				<text className="y-axis-label" transform={`translate(${0}, ${15})`}>
					{yAxis.title}
				</text>
			
			</svg>

		</div>
	)
	// }
}

