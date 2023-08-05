'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import * as d3 from 'd3'

import StackedArea from './StackedArea'
import Legend from './Legend'
// import styles from './StackedAreaLegend.module.css'



export default function StackedAreaLegend({ 
	data,
	groupBy,
	stackBy,
	agg,
	aggBy,
	orientation,
	format,
	dateFormat,
	colorScale,
	stackOffset,
	amplitude,
	xTitle,
	yTitle,
	legendTitle,
	marginLeft,
	marginTop,
	marginRight,
	marginBottom,
	showXAxis,
	showYAxis,
	showXTickLabels,
  showYTickLabels,
  showXTitle,
  showYTitle,
	xFormat,
	yFormat,
	xTicks,
	yTicks,
	xTickOffset,
	yTickOffset,
	fontSize,
	fontFamily

}) {
	
	const [selectedLegendList, setSelectedLegendList] = useState([ ])
	console.log('Rendering data', data)

	let styles = {
		'container': {
			'width': '100%',
			'height': '100%',
			'overflow': 'hidden',

			'display': 'flex',
			'flex-direction': 'row',

		},

		'stacked-area': {
			'flex': 4,
		},

		'legend': {
			'flex': 1,
			'overflow-y': 'scroll',
			'margin': 0,
			'cursor': 'pointer',
		},


	}

	let onClickStackedArea = (e) => {
		e.preventDefault()
		e.stopPropagation()
		console.log('click:', e.target)
		setSelectedLegendList(l => {

			let target = e.target['id']
		
			let newLegendList = l

			// console.log('Modifying selected legend list to:', newLegendList)

			if (newLegendList.includes(target)) {
				console.log('Removing from selected legend list', target)
				newLegendList = newLegendList.filter(d => d != target)
				return newLegendList

			}
			else {
				console.log('Adding to selected legend list', target)

				newLegendList = [target, ]//...newLegendList, ]
				return newLegendList
			}

		})
		
	}

	let onClickBackground = (e) => {
		e.preventDefault()
		
		console.log('onClickBackground')
		setSelectedLegendList([ ])
		
	}

	let [stackedData, setStackedData] = useState([ ])


	useEffect(() => {
		let groupedMap = d3.group(data, d => d[groupBy], d => d[stackBy])

		const stackKeys = [...new Set(data.map(d => d[stackBy]))]
		const reducer = v => v.length

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

	    setStackedData(dataStacked) 
	    // console.log('dataStacked:', data)
	    // let sums = d3.rollup(data, v => v.length, d => d[groupBy])
	    // console.log(sums)
	    // console.log(d3.max(sums.values(sums)))


	}, [data])

	// let stackKeys = [...new Set(data.map(d => d[stackBy]))]
	// let stackDomain = [...stackKeys]
  // let stackRange = stackKeys.map((d, i) => d3['interpolateRainbow'](i/(stackDomain.length+1)))

  // const colorScale = d3.scaleOrdinal()
  // 	.domain(stackDomain)
  // 	.range(stackRange)


	return <div style={styles['container']}>
		<div style={styles['stacked-area']}>
			{stackedData.length > 0 ? (
				<StackedArea
					data={data}
					stackedData={stackedData}
					groupBy={groupBy}
					stackBy={stackBy}
					selectedLegendList={selectedLegendList}
					onClick={onClickStackedArea}
					onClickBackground={onClickBackground}
					fontSize={fontSize}
					// fontFamily='Playfair Display'
					amplitude={amplitude}
					agg={agg}
					aggBy={aggBy}
					orientation={orientation}
					format={format}
					dateFormat={dateFormat}
					colorScale={colorScale}
					stackOffset={stackOffset}
					xTitle={xTitle}
					yTitle={yTitle}
					marginTop={marginTop}
				  marginBottom={marginBottom}
				  marginLeft={marginLeft}
				  marginRight={marginRight}
				  showXAxis={showXAxis}
					showYAxis={showYAxis}
					showXTitle={showXTitle}
					showYTitle={showYTitle}
					showXTickLabels={showXTickLabels}
  				showYTickLabels={showYTickLabels}
					xFormat={xFormat}
					yFormat={yFormat}
					xTickOffset={xTickOffset}
					yTickOffset={yTickOffset}
			/>
		) : <div></div>}
	</div>
	<div style={styles['legend']}>
		{data.length > 0 ? <Legend
			by={stackBy}
			data={data}
			selectedLegendList={selectedLegendList}
			onClick={onClickStackedArea}
			onClickBackground={onClickBackground}
			colorScale={colorScale}
			title={legendTitle}
			// discreteColorScale={d3.interpolateRainbow}
			// min={props.legendMin}
			// max={props.legendMax}
			// ticks={props.legendTicks}
			// format={props.legendFormat}
			// nice={'nice'}
		/> : <div></div>}
	</div>
</div>

}