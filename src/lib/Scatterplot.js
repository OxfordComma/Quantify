import React from 'react'
import * as d3 from "d3";
// import { regressionLoess, regressionQuad, regressionLinear, regressionExp } from 'd3-regression'
// import d3Tip from 'd3-tip'


class Scatterplot extends React.Component {
	constructor(props) {
		super(props);

		this.svgRef = React.createRef()

		let x, y, hue, size
		// let size = 'popularity'

		// If the prop is a string, create the appropriate object for it
		// x(name, accessor, scale)
		if(typeof(this.props.x) == 'string') {
			x = {
				name: this.props.x,
				accessor: d => d[this.props.x],
				scale: d3.scaleLinear()
			}
		}
		else {
			x = this.props.x
		}


		// y(name, accessor, scale)
		if(typeof(this.props.y) == 'string') {
			y = {
				name: this.props.y,
				accessor: d => d[this.props.y],
				scale: d3.scaleLinear()

			}
		}
		else {
			y = this.props.y
		}

		// hue(name, accessor, scale)
		if(typeof(this.props.hue) == 'string') {
			hue = {
				name: this.props.hue,
				accessor: d => d[this.props.hue],
				scale: d3.scaleSequential(this.props.colorScale)
			}
		}
		else {
			hue = this.props.hue
		}

		// hue(name, accessor, scale)
		if(typeof(this.props.size) == 'string') {
			console.log('size:', size)
			size = {
				name: this.props.size,
				accessor: d => d[this.props.size],
				scale: d3.scaleLinear()
			}
		}
		else {
			size = this.props.size
		}

		// Set all data as selected
		// let data = this.props.data.map(d => { d.selected = true; return d})

		x.type = [typeof(x.accessor(this.props.data[0]))].includes(['int', 'float']) ? 'numeric' : 'categorical'
		y.type = [typeof(y.accessor(this.props.data[0]))].includes(['int', 'float']) ? 'numeric' : 'categorical'
		// hue.type = [typeof(hue.accessor(this.props.data[0]))].includes(['int', 'float']) ? 'numeric' : 'categorical'


		this.state = {
			drawWidth: 0,
			drawHeight: 0,
			x: x,
			y: y,
			hue: hue,
			size: size,
			data: this.props.data,
			xMin: 0,
			xMax: 0,
			yMin: 0,
			yMax: 0,

		}
	}
	componentDidMount() {
		// console.log('width:', this.svgRef.current?.clientWidth)
		
		// this.setState({
		// 	drawWidth: this.svgRef.current?.clientWidth - this.props.margin.left - this.props.margin.right,
		// 	drawHeight: this.svgRef.current?.clientHeight - this.props.margin.top - this.props.margin.bottom
		// })
		this.update();
	}
	componentDidUpdate() {
		// if (this.props.data.length == 0)
		// 	return;
		// console.log('width:', this.svgRef.current?.clientWidth)

		// console.log(this.props.data == this.state.data ? 'data same' : 'data change')

		this.update();
	}

	updateSize() {
		let drawWidth = this.svgRef.current?.clientWidth - this.props.margin.left - this.props.margin.right
		let drawHeight = this.svgRef.current?.clientHeight - this.props.margin.top - this.props.margin.bottom
		let xMin = this.props.xMin ?? d3.min(this.props.data, (d) => +this.state.x.accessor(d))
		let xMax = this.props.xMax ?? d3.max(this.props.data, (d) => +this.state.x.accessor(d))
		let yMin = this.props.yMin ?? d3.min(this.props.data, (d) => +this.state.y.accessor(d))
		let yMax = this.props.yMax ?? d3.max(this.props.data, (d) => +this.state.y.accessor(d))
		// console.log(this.svgRef)

		if (this.state.drawWidth != drawWidth || this.state.drawHeight != drawHeight) {
			this.setState({
				drawWidth: drawWidth,
				drawHeight: drawHeight
			})
		}

		if (this.state.xMin != xMin || this.state.xMax != xMax) {
			this.setState({
				xMin: xMin,
				xMax: xMax
			})
		}

		if (this.state.yMin != yMin || this.state.yMax != yMax) {
			this.setState({
				yMin: yMin,
				yMax: yMax
			})
		}

	}

	updateScales() {
		// Calculate limits

		let x = this.state.x
		let y = this.state.y
		let hue = this.state.hue
		let size = this.state.size
		
		console.log('scale state:', this.state)

		// this.xMin = this.props.xMin ?? d3.min(this.props.data, (d) => +x.accessor(d));
		// this.xMax = this.props.xMax ?? d3.max(this.props.data, (d) => +x.accessor(d));
		// this.yMin = this.props.yMin ?? d3.min(this.props.data, (d) => +y.accessor(d));
		// this.yMax = this.props.yMax ?? d3.max(this.props.data, (d) => +y.accessor(d));
		this.hueMin = d3.min(this.props.data, (d) => hue.accessor(d))
		this.hueMax = d3.max(this.props.data, (d) => hue.accessor(d))
		this.sizeMin = d3.min(this.props.data, (d) => size.accessor(d))
		this.sizeMax = d3.max(this.props.data, (d) => size.accessor(d))

		// if (this.state.x.scale.domain() != [this.state.xMin, this.state.xMax])
		// Define scales
		// if (this.state.drawWidth != 0) {


		x.scale = x.scale
			.domain([this.state.xMin, this.state.xMax])
			.range([this.props.margin.left, this.state.drawWidth])

		// Nice?
		if(this.props.nice == 'nice')
			x.scale = x.scale.nice()
		
		if (x.scale != this.state.x.scale)
			this.setState({x: x})
		// }

		
		y.scale = y.scale
			.domain([this.state.yMin, this.state.yMax])
			.range([this.state.drawHeight, this.props.margin.top])

		// Nice?
		if(this.props.nice == 'nice')
			y.scale = y.scale.nice()
		
		if (y.scale != this.state.y.scale)
			this.setState({y: y})
				
		hue.scale = hue.scale
			.domain([this.hueMin, this.hueMax])

		if (hue.scale != this.state.hue.scale)
			this.setState({hue: hue})

		size.scale = size.scale
			.domain([this.sizeMin, this.sizeMax])
			.range([this.props.radius * 1.25, this.props.radius * 0.75])

		if (size.scale != this.state.size.scale)
			this.setState({scale: scale})

	}
	updatePoints() {
		// console.log('draw width:', this.state.drawWidth)

		// Add tip
		// let tip = d3Tip().attr('class', 'd3-tip').html(this.props.tooltip)
		
		// Add hovers using the d3-tip library        
		// d3.select('.chart-group').call(tip);
		// if (props.tooltip) {

		// }

		// Create the transparent background width
		let background = d3.select('.chart-group').selectAll('rect').data([null])
		background.enter().append('rect')
			.attr('class', 'chart-background')
			.attr('x', 0)   
			.attr('y', 0)   
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('opacity', 0)
			.on('click', d => this.props.onClickBackground(d))

		// Select all circles and bind data
		let circles = d3.select('.chart-group')
			.selectAll('circle')
			.data(this.props.data, d => d.id);

		// Use the .enter() method to get your entering elements, and assign their positions
		let circlesEnter = circles
			.enter().append('circle')
			.attr('class', 'chart-item')
			.on('mouseover', this.props.setTooltip ? (e, d) => this.props.setTooltip(d) : null)
			.on('mouseout', this.props.setTooltip ? (e, d) => this.props.setTooltip(undefined) : null)
			.attr('cx', d => {
				// console.log(this.state.x.scale(this.state.x.accessor(d)))
				// console.log(this.state.x.scale.range())
				return this.state.x.scale(this.state.x.accessor(d)) 
			})
			.attr('cy', d => this.state.y.scale(this.state.y.accessor(d)) )
			.attr('r', d => this.state.size ? this.state.size.scale( this.state.size.accessor(d)) : this.props.radius)				
			.style('fill-opacity', 0)
			
		// circles.transition().duration(this.props.transitionSpeed)
				// .attr('fill', d => this.state.hue ? this.state.hue.scale( this.state.hue.accessor(d)) : this.props.color)
				// .attr('r', d => this.state.size ? this.state.size.scale( this.state.size.accessor(d)) : this.props.radius)				
				// .attr('cx', d => this.state.x.scale(this.state.x.accessor(d)) )
				// .attr('cy', d => this.state.y.scale(this.state.y.accessor(d)) )

		circlesEnter.merge(circles)
			.on('click', d => this.props.onClickChartItem(d))
				// .attr('cx', d => this.state.x.scale(this.state.x.accessor(d)) )
				// .attr('cy', d => this.state.y.scale(this.state.y.accessor(d)) )
			.transition().duration(this.props.transitionSpeed)
				.attr('fill', d => this.state.hue ? this.state.hue.scale( this.state.hue.accessor(d)) : this.props.color)
				.attr('r', d => this.state.size ? this.state.size.scale( this.state.size.accessor(d)) : this.props.radius)				
				.attr('cx', d => this.state.x.scale(this.state.x.accessor(d)) )
				.attr('cy', d => this.state.y.scale(this.state.y.accessor(d)) )
				.style('fill-opacity', d => (this.state.drawWidth >  0) ? 1 : 0)
				.style('stroke', 'black')
				.style('stroke-width', 0.5)
				.style('stroke-opacity', d => (this.state.drawWidth > 0) ? 1 : 0)

		// Use the .exit() and .remove() methods to remove elements that are no longer in the data
		circles.exit()
			.transition().duration(this.props.transitionSpeed)
				.style('fill-opacity', 0)
			.remove();
	}
	updateAxes() {
		// Graph width and height - accounting for margins
		let xAxisFunction = d3.axisBottom()
			.scale(this.state.x.scale)
			.ticks(this.props.xTicks)
			.tickFormat(this.props.xFormat)


		let yAxisFunction = d3.axisLeft()
			.scale(this.state.y.scale)
			.ticks(this.props.yTicks)
			.tickFormat(this.props.yFormat);

		d3.select('.x-axis-g')
			.transition().duration(this.props.transitionSpeed)
			.call(xAxisFunction);

		d3.select('.y-axis-g')
			.transition().duration(this.props.transitionSpeed)
			.call(yAxisFunction);
	}
	update() {
		console.log('width:', this.svgRef.current?.clientWidth)
		this.updateSize();
		this.updateScales();
		if (this.state.drawWidth > 0)
			this.updateAxes();
		if (this.state.drawWidth > 0)
			this.updatePoints();
	}
	render() {
		console.log('render props', this.props)
		console.log('render state', this.state)
		return (
			<div>
			
				<svg ref={this.svgRef} width='100%' height='100%' >
					<g className='chart-group' >
						<div transform={`translate(${this.state.drawWidth/2},0)`}>{this.props.title}</div>
						
						<g className='x-axis-g'
							transform={`translate(${0}, ${this.state.drawHeight})`}></g>
						<g className='y-axis-g'
							transform={`translate(${this.props.margin.left}, ${0})`}></g>
					</g>
					{/*<text className="x-axis-label" transform={`translate(${this.state.drawWidth/2}, 
						${this.svgRef.current?.clientHeight - 5})`}>{this.props.xLabel ? this.props.xLabel : this.state.x.name}</text>*/}


					{/*<text className="y-axis-label" transform={`translate(${0}, 
						${15})`}>{this.props.yLabel ? this.props.yLabel : this.state.y.name}</text>*/}
				
				</svg>

			</div>
		)
	}
}

Scatterplot.defaultProps = {
	radius: 5,
	color: 'green',
	margin: {
		left: 30,
		right: 5,
		top: 5,
		bottom: 15
	},
	colorScale: d3.interpolateRainbow,
	transitionSpeed: 250,
	xTicks: 10,
	yTicks: 10,
	xFormat: number => d3.format('t')(number),
	yFormat: number => d3.format('t')(number),
	onClickBackground: d => null,
	onClickChartItem: d => null,
	title: '',
	data: [],
}

export default Scatterplot;