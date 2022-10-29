import React from 'react'
import * as d3 from "d3";
// import { regressionLoess, regressionQuad, regressionLinear, regressionExp } from 'd3-regression'
import d3Tip from 'd3-tip'


class Scatterplot extends React.Component {
	constructor(props) {
		super(props);

		this.svgRef = React.createRef()

		let x, y, hue, size
		let data = this.props.data


		this.state = {
			drawWidth: 0,
			drawHeight: 0,
			innerWidth: 0,
			innerHeight: 0,
			x: x,
			y: y,
			hue: hue,
			size: size,
			data: data,
			xMin: 0,
			xMax: 0,
			yMin: 0,
			yMax: 0,

		}

		// this.updateObjects()
		this.updateDimensions = this.updateDimensions.bind(this)
	}
	updateDimensions = () => {
    // this.setState({ innerWidth: window.innerWidth, innerHeight: window.innerHeight });
    console.log('update Dimensions')

    let drawWidth = this.svgRef.current?.clientWidth - this.props.marginLeft - this.props.marginRight
		let drawHeight = this.svgRef.current?.clientHeight - this.props.marginTop - this.props.marginBottom

		console.log({
			drawWidth: drawWidth,
			drawHeight: drawHeight
		})
		
		if (this.state.drawWidth != drawWidth || this.state.drawHeight != drawHeight) {
			this.setState({
				drawWidth: drawWidth,
				drawHeight: drawHeight
			})
		}
  };
	componentDidMount() {
		
 		window.addEventListener('resize', this.updateDimensions)

		this.update();
	}
	componentDidUpdate() {
		
		this.update();
	}

	updateObjects() {
		console.log('updateobjects state:', this.state)
		console.log('updateobjects props:', this.props)

		let x, y, hue, size;

		this.updateDimensions()
		// let drawWidth = this.svgRef.current?.clientWidth - this.props.marginLeft - this.props.marginRight
		// let drawHeight = this.svgRef.current?.clientHeight - this.props.marginTop - this.props.marginBottom
		
		// if (this.state.drawWidth != drawWidth || this.state.drawHeight != drawHeight) {
		// 	this.setState({
		// 		drawWidth: drawWidth,
		// 		drawHeight: drawHeight
		// 	})
		// }
		

		if(typeof(this.props.x) == 'string') {
			x = {
				name: this.props.x,
				accessor: d => d[this.props.x],
			}
		}
		else {
			x = {
				...this.props.x,
			}

			if (!x.accessor) {
				x.accessor = d => d[x.name]
			}

		}

		if (this.props.x.scale) {
			x.scale = this.props.x.scale.copy()
		}
		else {
			x.scale = d3.scaleLinear()
		}

		
		if (!x.min) 
			x.min = d3.min(this.props.data, d => +x.accessor(d))	

		if (!x.max)
			x.max = d3.max(this.props.data, d => +x.accessor(d))


		// Strings are in case the min is a date
		if (this.state.x?.name !== x.name || this.state.x?.min.toString() !== x.min.toString() || this.state.x?.max.toString() !== x.max.toString()) {
			this.setState({
				x: x,
			})
		}
		
		
		

		if(typeof(this.props.y) == 'string') {
			y = {
				name: this.props.y,
				accessor: d => d[this.props.y],
			}
		}
		else {
			y = {
				...this.props.y,
			}

			if (!y.accessor) {
				y.accessor = d => d[y.name]
			}
		}

		if (this.props.y.scale) {
			y.scale = this.props.y.scale.copy()
		}
		else {
				y.scale = d3.scaleLinear()
		}

		if (!y.min) 
			y.min = d3.min(this.props.data, d => +y.accessor(d))	

		if (!y.max) 
			y.max = d3.max(this.props.data, d => +y.accessor(d))	

		console.log({y: y})

		

		if (this.state.y?.name !== y.name || this.state.y?.min !== y.min || this.state.y?.max !== y.max) {
			this.setState({
				y: y,
			})
		}


		if(typeof(this.props.hue) == 'string') {
			hue = {
				name: this.props.hue,
				accessor: d => d[this.props.hue],
			}
		}
		else {
			hue = {
				...this.props.hue,
			}
			if (!hue.accessor) {
				hue.accessor = d => d[hue.name]
			}
		}


		if (this.props.hue.scale) {
			hue.scale = this.props.hue.scale.copy()
		}
		else {
		// if (true) {
			let scaleType = typeof(hue.accessor(this.props.data[0]) )
			console.log('hue scale type:', scaleType)
			if (scaleType == 'number' || hue.accessor(this.props.data[0]) instanceof Date) 
				hue.scale = d3.scaleLinear()
			else
				hue.scale = d3.scaleOrdinal()

		}


		console.log({hueDomain: hue.scale.domain()})
		if (hue.name != this.state.hue?.name) {
			let scaledHueType = typeof(hue.scale(hue.accessor(this.props.data[0])) )
			
			if (scaledHueType == 'number') {
				console.log('numeric hue')
				let hueMin = this.props.hue.min ?? d3.min(this.props.data, d => hue.accessor(d))
				let hueMax = this.props.hue.max ?? d3.max(this.props.data, d => hue.accessor(d))
				
				console.log({
					hueMin: hueMin,
					hueMax: hueMax,
				})
			
				hue.scale.domain([hueMin, hueMax])
				hue.scale.range(this.props.hue.colorScale ?? this.props.continuousColorScale)
			}
			else {
				console.log('discrete hue')
				let hueMin = d3.min(this.props.data, d => hue.accessor(d))
				let hueMax = d3.max(this.props.data, d => hue.accessor(d))
				
				console.log({
					hueMin: hueMin,
					hueMax: hueMax,
				})
				let discreteValues  = [...new Set(this.props.data.map(d => hue.accessor(d)))]
				console.log('discrete hue values:', discreteValues)
				hue.scale.domain(discreteValues)
				hue.scale.range(this.props.hue.colorScale ?? this.props.discreteColorScale)

				console.log({
					hueDomain: hue.scale.domain(),
					hueRange: hue.scale.range(),
				})
			}
			this.setState({ hue: hue })
		}


		if(typeof(this.props.size) == 'string') {
			size = {
				name: this.props.size,
				accessor: d => d[this.props.size],
			}
		}
		else {
			size = {
				...this.props.size,
			}
			if (!size.accessor) {
				size.accessor = d => d[size.name]
			}
		}

		// if (!size.scale) {
		let scaleType = typeof(size.accessor(this.props.data[0]) )

		if (scaleType == 'number' || size.accessor(this.props.data[0]) instanceof Date) 
			size.scale = d3.scaleLinear()
		else
			size.scale = d3.scaleBand()

		// }

		console.log('size:', size)


		if (size.name != this.state.size?.name) {
			let scaledSizeType = typeof(size.scale(size.accessor(this.props.data[0])) )
			console.log(size.scale(size.accessor(this.props.data[0])) )
			
			if (scaledSizeType == 'number') {
				console.log('numeric size')
				let sizeMin = d3.min(this.props.data, (d) => size?.accessor(d))
				let sizeMax = d3.max(this.props.data, (d) => size?.accessor(d))

				console.log({
					sizeMin: sizeMin,
					sizeMax: sizeMax,
				})

				size?.scale.domain([sizeMin, sizeMax].sort())
				size?.scale.range([this.props.radius * 1.25, this.props.radius * 0.75])

				console.log('size domain:',  size?.scale.domain())
				console.log('size range:', size?.scale.range())

			}
			else {
				console.log('non-numeric size')
				let domain = [...new Set(this.props.data.map(d => size?.accessor(d)))].sort()
				console.log('size domain set to: ', domain)
				size?.scale.domain(domain)
				if (size.scale.domain().length > 1)
					size?.scale.range([this.props.radius * 1.25, this.props.radius * 0.75])
				else
					size?.scale.range([this.props.radius, this.props.radius])


			}
			this.setState({size: size})

		}
		

	}


	updateScales() {
		// Update X Axis

		// X Domain
		let x = this.state.x
		if (!x?.scale) return;


		// Check if Date
		if (typeof x.accessor(this.props.data[0]) == 'object') {
			// console.log('date:', this.props.data.map(d => x.accessor(d)).filter(d => d))
			x.min = this.props.data.map(d => x.accessor(d)).filter(d => d).reduce((a, b) => a < b ? a : b)
			x.max = this.props.data.map(d => x.accessor(d)).filter(d => d).reduce((a, b) => a > b ? a : b)
		}
		else {
			let xMin = d3.min(this.props.data, d => +x?.accessor(d))
			let xMax = d3.max(this.props.data, d => +x?.accessor(d))
			x.min = Math.max(x.min, xMin)
			x.max = Math.min(x.max, xMax)
		} 
		
		// console.log({x: x})

		// If linear scale, domain length is 2 by default
		let isLinearScale = x.scale.domain().length == 2
		if (isLinearScale) { 
			console.log('x linear')
			x.scale.domain([x.min, x.max])
		}
		else {
			console.log('x ordinal')
			let discreteValues = [...new Set(this.props.data.map(d => x.accessor(d)))].sort()
			x.scale = d3.scalePoint()
			x.scale.domain(discreteValues)
		}

		// X Range
		x.scale.range([this.props.marginLeft, this.state.drawWidth + this.props.marginLeft - this.props.marginRight])
		x.scale.nice()


		let y = this.state.y
		if (!y?.scale) return;

		// Update Domain
		let yMin = d3.min(this.props.data, d => +y?.accessor(d))
		let yMax = d3.max(this.props.data, d => +y?.accessor(d))

		y.min = Math.max(y.min, yMin)
		y.max = Math.min(y.max, yMax)

		y.scale.domain([y.min, y.max])
		y.scale.nice()


		


		// Update Range
		// let a = y.scale.range()
		// let b = [this.state.drawHeight, this.props.marginTop]

		// if (!(a.every(item => b.includes(item)) && b.every(item => a.includes(item)))) {
		y.scale.range([this.state.drawHeight, this.props.marginTop])
			// this.setState({y: y})
		// }


		// Update Hue
		// let hue = this.state.hue;
		// if (!hue?.scale) return; 

		
		

		// let size = this.state.size;
		// if (!size?.scale) return; 

		// Update Size


	}

	updatePoints() {
		// console.log('draw width:', this.state.drawWidth)

		// Add tip
		let tip = d3Tip().attr('class', 'd3-tip').html((e, d) => `<div style="backdrop-filter: blur(10px); height:20px; padding-left:5px; padding-right:5px"">${this.props.setTooltip(d)}</div>`)
		
		// Add hovers using the d3-tip library        
		d3.select('.chart-group').call(tip);
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
			.data(this.props.data, this.props.keyBy ? this.props.keyBy : null);

		// Use the .enter() method to get your entering elements, and assign their positions
		let circlesEnter = circles
			.enter().append('circle')
			.attr('class', 'chart-item')
			.style('cursor', 'pointer')
			.attr('cx', d => this.state.x?.scale(this.state.x?.accessor(d)) )
			.attr('cy', d => this.state.y?.scale(this.state.y?.accessor(d)) )
			// .on('mouseover', tip.show)
			// .on('mouseout', tip.hide)
			.on('mouseover', this.props.setTooltip ? (e, d) => this.props.setTooltip(d) : null)
			.on('mouseout', this.props.setTooltip ? (e, d) => this.props.setTooltip(undefined) : null)
			.style('fill-opacity', 0)
			
		
		circlesEnter.merge(circles)
			.on('click', d => this.props.onClickChartItem(d))
			.transition().duration(this.props.transitionSpeed)
				.attr('fill', d => this.state.hue ? this.state.hue?.scale( this.state.hue?.accessor(d)) : this.props.color)
				.attr('r', d => this.state.size ? this.state.size?.scale( this.state.size?.accessor(d)) : this.props.radius)				
				.attr('cx', d => this.state.x?.scale(this.state.x?.accessor(d)) )
				.attr('cy', d => this.state.y?.scale(this.state.y?.accessor(d)) )
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
			.scale(this.state.x?.scale)
			.ticks(this.props.xTicks)
			.tickFormat(this.props.xFormat ?? this.props.x.format ?? this.props.defaultFormat)

		let yAxisFunction = d3.axisLeft()
			.scale(this.state.y?.scale)
			.ticks(this.props.yTicks)
			.tickFormat(this.props.yFormat ?? this.props.y.format ?? this.props.defaultFormat);

		d3.select('.x-axis-g')
			.transition().duration(this.props.transitionSpeed)
			.call(xAxisFunction)
			.attr('font-family', null)


		d3.select('.y-axis-g')
			.transition().duration(this.props.transitionSpeed)
			.call(yAxisFunction)
			.attr('font-family', null)
	}
	update() {
		console.log('update state:', this.state)
		this.updateObjects();
		this.updateScales();
		if (this.state.drawWidth > 0 )
			this.updateAxes();
		if (this.state.drawWidth > 0)
			this.updatePoints();
	}
	render() {
		console.log('render props', this.props)
		console.log('render state', this.state)

		if (!this.state.x === undefined || !this.state.y === undefined)
			return <div></div>
		
		return (
			<div>
			
				<svg ref={this.svgRef} width='100%' height='100%' >
					<g className='chart-group' >
						<div transform={`translate(${this.state.drawWidth/2},0)`}>{this.props.title}</div>
						
						<g className='x-axis-g' style={{'font-family': null}}
							transform={`translate(${0}, ${this.state.drawHeight})`}></g>
						<g className='y-axis-g'
							transform={`translate(${this.props.marginLeft}, ${0})`}></g>
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
	marginLeft: 10,
	marginRight: 10,
	marginTop: 10,
	marginBottom: 10,
	discreteColorScale: d3.schemeCategory10,
	continuousColorScale: ['yellow', 'red'],
	transitionSpeed: 250,
	xTicks: 10,
	yTicks: 10,
	defaultFormat: d3.format('.0f'),
	// yFormat: d3.format('.0f'),
	onClickBackground: d => null,
	onClickChartItem: d => null,
	title: '',
	data: [],
}

export default Scatterplot;