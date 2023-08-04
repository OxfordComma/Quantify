'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import Table from './Table'
import * as d3 from 'd3'


export default function ActiveTable({ data: rawData, options, styles }) {
	if (options === undefined) {
		options = {}
		const unique = Object.keys(rawData[0])
		unique.map(u => {
			options[u] = {}
		})
	}

	function detectDataType(datum, accessor) {
 		if (accessor(datum) instanceof Date) 
 			return 'date'

 		else 
 			return typeof(accessor(datum))
 	}

	let columns = Object.keys(options).map(c => {
		let opt = options[c]

		if (!opt.name) 
			opt.name = [c]

		if (!opt.accessor) 
			opt.accessor = d => d[c]

		

		if (opt.format && !opt.cell)
			opt.cell = d => <div>{opt.format(d.row.original[c])}</div>

		if ( detectDataType(rawData[0], opt.accessor) == 'date' && !opt.format) {
			opt.format = d3.utcFormat("%Y-%m-%d")
		}
			
		// Cell: d => <a href={d.row.original.uri}>{d.row.original.album.name}</a>,

		return {
			Header: c,
			sortType: 'basic',
			backgroundColor: 'rgba(52, 52, 52, 0.8)',
			...options[c]
		}
	})
	rawData = rawData.map((d, index)=> {
		return {
			index: index,
			...d
		}
	})
	
	let [data, setData] = useState(rawData)
	let [sortCol, setSortCol] = useState(null)
	let [sortDir, setSortDir] = useState(null)

	useEffect(() => {
		setData(rawData)
	}, [rawData.length])

	function onClickHeader(e) {
		e.preventDefault();
		let newSortCol = e.target.textContent.replace(/[↓↑]/, '').trim()
		let newSortDir = sortDir
		let newData = data


		if (newSortCol != sortCol) {
			newSortDir = null
		}


		if (newSortDir == null) {
			newSortDir = 'asc'
			newData = newData.sort((a, b) => a[newSortCol] > b[newSortCol] ? 1 : -1)
		}
		else if (newSortDir === 'asc') {
			newSortDir = 'desc'
			newData = newData.sort((a, b) => (a[newSortCol] < b[newSortCol] ? 1 : -1) )
			
		}
		else if (newSortDir === 'desc') {
			newSortDir = null
			newSortCol = null
			newData = newData.sort((a, b) => (a['index'] < b['index'] ? 1 : -1) )
		}
		
		setSortCol(newSortCol)
		setSortDir(newSortDir)
		setData(newData)
		
		console.log({
			sortCol: newSortCol,
			sortDir: newSortDir,
			// data: newData,
		})
	}

	return (
		<Table
			data={data}
			columns={columns}
			sortCol={sortCol}
			sortDir={sortDir}
			styles={styles}
			onClickHeader={onClickHeader}
		/>
	)
}
