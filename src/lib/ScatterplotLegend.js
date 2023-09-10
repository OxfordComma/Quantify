import Scatterplot from './Scatterplot.js'
import Legend from './Legend.js'
import * as d3 from "d3";
import React from 'react'

function ScatterplotLegend({
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
	xAxisMargin=undefined,
	width=undefined,
	height=undefined,
	title=undefined,
	transitionSpeed=undefined,
	xMin=undefined,
	xMax=undefined,
	yMin=undefined,
	yMax=undefined,
	xTicks=undefined,
	yTicks=undefined,
	xFormat=undefined,
	yFormat=undefined,
	xLabel=undefined,
	yLabel=undefined,
	showXLabel,
	showYLabel,
	radius=undefined,
	fill=undefined,
	color=undefined,
	discreteColorScale=undefined,
	continuousColorScale=undefined,
	format,
	dateFormat,
	onClickBackground=()=>{},
	onClickChartItem=()=>{},
	// Legend
	legendMin,
	legendMax,
	legendTicks,
	legendFormat,
}) {
	let styles = {
		'display': 'grid',
		'grid-template-columns': '85% 15%',
		'width': '100%',
		'height': '100%',
	}

	return (
		<div style={styles}>
			<Scatterplot
				x={x}
				y={y}
				keyBy={keyBy}
				hue={hue}
				size={size}
				data={data}
				marginTop={marginTop}
				marginBottom={marginBottom}
				marginRight={marginRight}
				marginLeft={marginLeft}
				xAxisMargin={xAxisMargin}
				width={width}
				height={height}
				title={title}
				transitionSpeed={transitionSpeed}
				xMin={(xMin || xMin == 0) ? xMin : undefined}
				xMax={(xMax || xMax == 0) ? xMax : undefined}
				yMin={(yMin || yMin == 0) ? yMin : undefined}
				yMax={(yMax || yMax == 0) ? yMax : undefined}
				xTicks={xTicks}
				yTicks={yTicks}
				xFormat={xFormat}
				yFormat={yFormat}
				xLabel={xLabel}
				yLabel={yLabel}
				showXLabel={showXLabel}
				showYLabel={showYLabel}
				radius={radius}
				
				fill={fill}
				color={color}
				discreteColorScale={d3.schemeCategory10}
				continuousColorScale={['yellow', 'red']}
				format={format}
				dateFormat={dateFormat}
				onClickBackground={()=>{} }
				onClickChartItem={()=>{}}
				// setTooltip={setTooltip}
				
			/>
			<Legend
				by={hue}
				data={data}
				min={legendMin}
				max={legendMax}
				ticks={legendTicks}
				format={legendFormat}
				// nice={'nice'}
			/>
		</div>
	)
}

export default ScatterplotLegend
