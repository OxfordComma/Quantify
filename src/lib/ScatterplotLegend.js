import Scatterplot from './Scatterplot.js'
import Legend from './Legend.js'
import * as d3 from "d3";
import React from 'react'

function ScatterplotLegend(props) {
	let styles = {
		'display': 'grid',
		'grid-template-columns': '85% 15%',
		'width': '100%',
		'height': '100%',
	}

	return (
		<div style={styles}>
			<Scatterplot
				data={props.data}
				keyBy={props.keyBy ? props.keyBy : undefined}
				x={props.x}
				y={props.y}
				hue={props.hue ? props.hue : undefined}
				size={props.size ? props.size : undefined}
				color={props.color ? props.color : undefined}
				xMin={props.x.min ? props.x.min : undefined}
				xMax={props.x.max ? props.x.max : undefined}
				yMin={props.yMin ? props.yMin : undefined}
				yMax={props.yMax ? props.yMax : undefined}
				xLabel={props.xLabel ? props.xLabel : undefined}
				yLabel={props.yLabel ? props.yLabel : undefined}
				xFormat={props.xFormat ?? props.x.format}
				yFormat={props.yFormat ?? props.y.format}
				xTicks={props.xTicks}
				yTicks={props.yTicks}
				colorScale={props.colorScale ? props.colorScale : undefined}
				setTooltip={props.setTooltip ? props.setTooltip : undefined}
				marginTop={props.marginTop ? props.marginTop : undefined}
				marginBottom={props.marginBottom ? props.marginBottom : undefined}
				marginRight={props.marginRight ? props.marginRight : undefined}
				marginLeft={props.marginLeft ? props.marginLeft : undefined}
				// nice={'nice'}

			/>
			<Legend
				by={props.hue ? props.hue : undefined}
				data={props.data}
				// colorScale={props.hue ? props.hue.colorScale : undefined}
				min={props.legendMin}
				max={props.legendMax}
				ticks={props.legendTicks}
				format={props.legendFormat}
				// nice={'nice'}
			/>
		</div>
	)
}

export default ScatterplotLegend
