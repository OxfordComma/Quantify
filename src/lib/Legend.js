import React from 'react'
import * as d3 from 'd3'
import { legendColor } from 'd3-svg-legend'

class Legend extends React.Component {
	constructor(props) {
		super(props);
		this.legendRef = React.createRef()

		this.state = {
			by: undefined
		}

	}
	componentDidMount() {
		this.update();
	}
	// Whenever the component updates, select the <g> from the DOM, and use D3 to manipulte circles
	componentDidUpdate() {
		this.update();
	}

	
	updateLegend() {
		// let scale = this.by.scale
		let by

		if (typeof(this.props.by) == 'string') {
			by = {
				name: this.props.by,
				accessor: d => d[this.props.by],
			}
		}
		else {
			by = {
				...this.props.by,
			}
			if (!by.accessor) {
				by.accessor = d=> d[by.name]
			}
		}

		

		// console.log('legend color scale:', this.props.by.scale.domain())
		// console.log('legend color scale:', this.props.by.scale.range())



		let scaleType
		if (by.scale) {
			console.log('domain length:', by.scale.domain().length)
			scaleType = by.scale.domain().length == 2 ? 'number' : 'string'

			

		}
		else {
			scaleType = typeof(by.accessor(this.props.data[0]) )
			// if (scaleType == 'number') 
			// 	by.scale = d3.scaleLinear(this.props.by.colorScale ?? this.props.continuousColorScale)

			// else
			// 	by.scale = d3.scaleOrdinal(this.props.by.colorScale ?? this.props.discreteColorScale)
		}
		if (scaleType == 'number') 
			by.scale = d3.scaleLinear(this.props.by.colorScale ?? this.props.continuousColorScale)

		else
			by.scale = d3.scaleOrdinal(this.props.by.colorScale ?? this.props.discreteColorScale)

		
		// let byType = typeof(by.accessor(this.props.data[0]))

		// console.log(by.scale(by.accessor(this.props.data[0])))
		let isDateLegend = by.accessor(this.props.data[0]) instanceof Date
		console.log('date legend?', isDateLegend)
		if (by.name != this.state.by?.name) {
			if (scaleType == 'number') {
				console.log('numeric legend')
			
				let min = this.props.min ?? this.props.by.min ?? d3.min(this.props.data, d => by.accessor(d))
				let max = this.props.max ?? this.props.by.max ?? d3.max(this.props.data, d => by.accessor(d))
				
				console.log({
					'legend min': min,
					'legend max': max,
				})

				by.scale.domain([min, max])
				by.scale.range(this.props.by.colorScale ?? this.props.continuousColorScale)
			}
			else {
				console.log('categorical legend:', typeof(by.accessor(this.props.data[0])))
				let discreteValues = [...new Set(this.props.data.map(d => by.accessor(d)))].sort()
				console.log(discreteValues)
				by.scale.domain(discreteValues)
				by.scale.range(this.props.by.colorScale ?? this.props.discreteColorScale)

				by.scale.nice()


				console.log({
					byDomain: by.scale.domain(),
					byRange: by.scale.range(),
				})
			}



			// if(this.props.nice == 'nice')
			// 	by.scale.nice()

			this.setState({by: by})
		}

		let dateLegendFormat = this.state.by?.format ?? this.props.dateFormat
		let dateLegendFunc = ({ i, genLength, generatedLabels }) => dateLegendFormat(generatedLabels[i])
		
		// console.log(by.scale.domain())
		if (this.state.by !== undefined) {
			let selection = d3.select(this.legendRef.current)
			var legendLinear = legendColor()
				.labelFormat(isDateLegend ? d3.format('.0f') : by.format ?? this.props.format)
				.labels(isDateLegend ? dateLegendFunc :
					this.state.by.cell ?? undefined
				)
			 //  .labels(({ 
				// 	i,
				//   genLength,
				//   generatedLabels,
				//   labelDelimiter
				// }) => { 
					// return generatedLabels.sort()[i] })
				// 	console.log(this.props.format ? 
			 //  		this.props.format(generatedLabels[i]) :
			 //  		generatedLabels[i])
			 //  	return (this.props.format ? 
			 //  		this.props.format(generatedLabels[i]) :
			 //  		generatedLabels[i] )})
			  .shapeWidth(30)
			  .cells(this.props.ticks ?? scaleType == 'number' ? 11 : [...new Set(this.props.data.map(d => by.accessor(d)))].length)
			  .orient(this.props.orientation)
			  .scale(this.state.by.scale)
				.on('cellclick', d => this.props.onClickLegend(d))
			  
			selection.selectAll(".legendLinear").remove()

			var l = selection.selectAll(".legendLinear")
				.data([this.state.by.name])
				.enter().append("g")
				  .attr("class", "legendLinear")
				  // .attr("transform", "translate(20,20)")

				  .call(legendLinear)
		}

		
	}
	async update() {
		this.updateLegend();
	}

	render() {
		if (this.props.data.length == 0)
			return null

		return (
			<svg width="100%vw" height="100%vh">
				<g ref={this.legendRef} className='legend'
					transform={`translate(${this.props.margin.left}, ${this.props.margin.top + this.props.radius})`} />
			</svg>
		)
	}
}

Legend.defaultProps = {
	data: [],
	width: 300,
	height: 300,
	radius: 5,
	offset: 0,
	margin: {
		left: 5,
		right: 10,
		top: 10,
		bottom: 10
	},
	discreteColorScale: d3.schemeCategory10,
	continuousColorScale: ['yellow', 'red'],
	orientation: 'vertical',
	onClickLegend: d => null,
	format: d3.format('.0f'),
	dateFormat: d3.utcFormat("%Y-%m-%d"),


};

export default Legend