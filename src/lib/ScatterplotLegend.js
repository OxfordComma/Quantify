import Scatterplot from './Scatterplot'
import Legend from './Legend'
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
				xFormat={props.x.format ? props.x.format : undefined}
				yFormat={props.y.format ? props.y.format : undefined}
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
				min={props.legendMin ? props.legendMin : undefined}
				max={props.legendMax ? props.legendMax : undefined}
				format={props.format ? props.format : undefined}
				// nice={'nice'}
			/>
		</div>
	)
}

export default ScatterplotLegend
