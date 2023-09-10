'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import Table from './Table.js'
import * as d3 from 'd3'


export default function ActiveTable({ data: rawData, options, styles }) {
	let [data, setData] = useState(rawData)
	let [sortCol, setSortCol] = useState(null)
	let [sortDir, setSortDir] = useState(null)

	function detectDataType(datum, accessor) {
 		if (accessor(datum) instanceof Date) 
 			return 'date'

 		else 
 			return typeof(accessor(datum))
 	}

 	// if (data.length == 0) {
 	// 	return <div></div>
 	// }

	if (options === undefined) {
		options = {}
		const unique = Object.keys(data[0])
		unique.map(u => {
			options[u] = {}
		})
	}

	let columns = Object.keys(options).map(c => {
		let opt = options[c]

		if (!opt.name) 
			opt.name = c

		if (!opt.accessor) 
			opt.accessor = d => d[c]

		


		if ( detectDataType(rawData[0], opt.accessor) == 'date' && !opt.format) {
			opt.format = d3.utcFormat("%Y-%m-%d")
		}

		if (opt.format && !opt.cell)
			opt.cell = d => <div>{opt.format(opt.accessor(d))}</div>

		// Cell: d => <a href={d.row.original.uri}>{d.row.original.album.name}</a>,
		let obj = {
			Header: c,
			sortType: 'basic',
			backgroundColor: 'rgba(52, 52, 52, 0.8)',
			...opt
		}

		return obj
	})
	

	
	
	
	
	
	useEffect(() => {
		rawData = rawData.map((d, index)=> {
			return {
				index: index,
				...d
			}
		})

		setData(rawData)
	}, [rawData])

	function onClickHeader(e) {
		e.preventDefault();
		// let newSortCol = e.target.textContent.replace(/[▲▼]/, '').trim()
		let newSortCol = e.target.id//.replace(/[▲▼]/, '').trim()
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
