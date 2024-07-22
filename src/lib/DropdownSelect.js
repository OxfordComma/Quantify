'use client'
import React from 'react'

import { useState, useEffect } from 'react'
import CheckmarkDropdown from './CheckmarkDropdown'

export default function DropdownSelect({ 
		data,
		column,
		accessor,

		filteredData, 
		setFilteredData, 

		// filters, 
		// setFilters, 
		label,
		// selected: selectedId
		placeholder,
		styles,
	}) {
	
	let [selected, setSelected] = useState([
		// { value: 'RB1', label: 'RB1'}
	])
	let [items, setItems] = useState([])

	useEffect(() => {
		console.log('selected:', selected)
		let newData = []

		if (selected.length == 0) {
			newData = data
		}
		else {
			for (let s of selected) {
				console.log('s', s)
				newData = newData.concat(data.filter(d => d[column] == s.value))
				console.log('nd', newData)
			}	
		}

		setFilteredData(
			newData
		)

	}, [selected])

	
	useEffect(() => {
		let subset 
		// if (selected == 'all') {
		// 	subset = data.map(d => d[column])
		// }
		if (accessor == undefined) {
			accessor = d => d[column]
		}
		// if (selected != 'all') {
		// 	subset = data.map(accessor)
		// }
		// else {
			subset = data.map(accessor)

		// }
		// console.log(subset)
		setItems(
			// ['all'].concat(
				[...new Set(subset)].sort()
			// )
		)
	}, [data, column, ]) //filteredData, filters

	// useEffect(() => {
	// 	// console.log('effect used', selected, filters)
	// 	// console.log({
	// 	// 	...filters,
	// 	// 	[column]: selected
	// 	// })

	// 	let filter = async () => {
	// 		if (selected == 'all') {
	// 			await setFilters({
	// 				...filters,
	// 				[column]: 'all'
	// 			})
	// 		}
	// 		else {
	// 			await setFilters({
	// 				...filters,
	// 				[column]: selected
	// 			})
	// 		}
	// 	}

	// 	filter()
	// }, [selected])

	// let onChange = (e) => {
	// 	e.preventDefault()
	// 	let val = e.target.value
	// 	console.log('dropdown filter changed to:', val)
	// 	setSelected(val)
	// }

	return (
		<CheckmarkDropdown
			items={items}
			label={label}
			selected={selected}
			setSelected={setSelected}
			placeholder={placeholder}
			styles={styles}
			// onDropdownChange={setSelected}
			// selected={selected.toString()}
		/>
	)
}