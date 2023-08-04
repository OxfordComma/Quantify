import React from 'react'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'

import * as d3 from 'd3'
import { legendColor } from 'd3-svg-legend'

// class Legend extends React.Component {
export default function Legend({
	by,
	data,
	min,
	max,
	ticks=10,
	margin={
		left: 0,
		right: 0,
		top: 10,
		bottom: 0
	},
	radius=5,
	colorScale,
	discreteColorScale=d3.schemeCategory10,
	continuousColorScale=['yellow', 'red'],
	orientation='vertical',
	onClick = d => {},
	format=d3.format('.0f'),
	dateFormat=d3.utcFormat("%Y-%m-%d"),
	offset=25,
	selectedLegendList=[],
	title,
}) {
	const legendRef = useRef()

	function detectScaleType(datum, accessor) {
 		if (accessor(datum) instanceof Date) 
 			return 'date'

 		else 
 			return typeof(accessor(datum))
 	}

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
		// 	.labelFormat(scaleType == 'date' ? format : byAxis.format)
		// 	.labels(scaleType == 'date' ? dateLegendFunc : byAxis.cell ?? undefined
		// 	)
		//   .shapeWidth(30)
		//   .cells(ticks)
		//   .title(byAxis.name)
		//   .orient(orientation)
		//   .scale(byAxis.scale)
		// 	.on('cellclick', d => onClickLegend(d))
			  
		// 	selection.selectAll(".legendLinear").remove()

		// Title
		// let t = selection.selectAll('.title').data([byAxis.name])
			
		// t.enter().append('g')
		// 		.append('text')
		// 			.text(byAxis.name)

		let spacing = 25

		var l = selection.selectAll(".legend-container").data([null])
			.enter().append("g")
			  .attr("class", "legend-container")
			// 	  // .attr("transform", "translate(20,20)")
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
				// 	this.props.radius * 4 * textLengths.length + d3.sum(textLengths) + 20 : 
				// 	this.props.radius * 4 + d3.max(textLengths) + 20

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
			// 	.enter().append('g')
			// 		.attr('class', 'legend-items')

			// legendItems.selectAll('.legend-item').data(byAxis.scale.domain())
			// 		.enter().append('text').text(d => d)
			// 			.attr('transform', (d, i) => `translate(0, ${spacing * i})`)

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
	
	if (data.length == 0)
		return null

	return (
		<svg width="100%" height="100%">
			<g ref={legendRef} className='legend' transform={`translate(${margin.left}, ${margin.top})`} />
		</svg>
	)
}
