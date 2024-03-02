'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import Table from './Table.js'
import * as d3 from 'd3'


export default function ActiveTable({ 
	data: rawData, 
	title,
	options, 
	styles 
}) {
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
		if (data.length > 0) {
				const unique = Object.keys(data[0])
				unique.map(u => {
					options[u] = {}
				})
			}
	}

	let columns
	if (data.length == 0) {
		columns = []
	}
	else {
		columns = Object.keys(options).map(c => {
			let opt = options[c]

			if (typeof opt == 'string') {
				opt = {
					name: options[c],
					accessor: d => d[ c ],
				}
			}

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
	}
	
	
	useEffect(() => {
		rawData = rawData.map((d, index)=> {
			return {
				index: index,
				...d
			}
		}).sort()

		setData(rawData)
	}, [rawData])

	function sortData(data, column, direction) {
		let newData = data
		const col = columns.find(c => c['name'] == column)
		let accessor
		if (col.sort) {
			accessor = col.sort
		}
		else {
			accessor = col.accessor
		}

		if (direction == null ) {
			newData = newData.sort((a, b) => a['index'] > b['index'] ? 1 : -1) 
		}
		else if (direction === 'asc') {
			newData = newData.sort((a, b) => accessor(a) > accessor(b) ? 1 : -1 )
			
		}
		else if (direction === 'desc') {
			newData = newData.sort((a, b) => accessor(a) < accessor(b) ? 1 : -1 )
		}

		return newData

	}

	function onClickHeader(e) {
		e.preventDefault();
		// let newSortCol = e.target.textContent.replace(/[▲▼]/, '').trim()
		let newSortCol = e.target.id//.replace(/[▲▼]/, '').trim()
		let newSortDir = sortDir
		
		if (newSortCol != sortCol) {
			newSortDir = null
		}
		if (newSortDir == null) {
			newSortDir = 'asc'	
		}
		else if (newSortDir === 'asc') {
			newSortDir = 'desc'
		}
		else if (newSortDir === 'desc') {
			newSortDir = null
			// newSortCol = null
		}

		let newData = sortData(data, newSortCol, newSortDir)

		
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
			title={title}
			sortCol={sortCol}
			sortDir={sortDir}
			styles={styles}
			onClickHeader={onClickHeader}
		/>
	)
}
