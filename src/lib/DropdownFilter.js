'use client'
import React from 'react'

import { useState, useEffect } from 'react'
import Dropdown from './Dropdown.js'

export default function DropdownFilter({ 
		data,
		filteredData, 
		setFilteredData, 
		filters, 
		setFilters, 
		column,
		selected: selectedId
	}) {
	let [selected, setSelected] = useState(filters[column] ?? 'all')
	let [items, setItems] = useState([])
	
	useEffect(() => {
		let subset = data.map(d => d[column])
		// console.log(subset)
		setItems(['all', ...new Set(subset)])
	}, [data, column])

	useEffect(() => {
		// console.log('effect used', selected, filters)
		// console.log({
		// 	...filters,
		// 	[column]: selected
		// })

		let filter = async () => {
			if (selected == 'all') {
				await setFilters({
					...filters,
					[column]: 'all'
				})
			}
			else {
				await setFilters({
					...filters,
					[column]: selected
				})
			}
		}

		filter()
	}, [selected])

	// let onChange = (e) => {
	// 	e.preventDefault()
	// 	let val = e.target.value
	// 	console.log('dropdown filter changed to:', val)
	// 	setSelected(val)
	// }

	return (
		<Dropdown
			items={items}
			onDropdownChange={setSelected}
			selected={selected.toString()}
		/>
	)
}