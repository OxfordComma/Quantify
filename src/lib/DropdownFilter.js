'use client'
import React from 'react'

import { useState, useEffect } from 'react'
import Dropdown from './Dropdown.js'
// import { useTable, useSortBy, useFilters, useRowSelect, useFlexLayout } from 'react-table'
// import styles from '../styles/Table.module.css'



export default function DropdownFilter({ 
		data, 
		filteredData, 
		setFilteredData, 
		filters, 
		setFilters, 
		column 
	}) {
	let [selected, setSelected] = useState('all')
	let [unique, setUnique] = useState([])
	
	useEffect(() => {
		let subset = data.map(d => d[column])
		console.log(subset)
		setUnique(['all', ...new Set(subset)])
	}, [data, column])

	useEffect(() => {
		console.log('effect used', selected, filters)
		console.log({
			...filters,
			[column]: selected
		})

		let filter = async () => {
			if (selected == 'all') {
				// console.log('Not Filtering!!!')
				// await setFilteredData(data)
				// let f = filters
				// f[column] = 'all'
				// console.log(f)
				await setFilters({
					...filters,
					[column]: 'all'
				})
			}
			else {
				// console.log('Filtering!!!')
				// await setFilteredData(filteredData.filter(d => d[column] == selected))
				// await setFilters({
				// 	...filters,
				// })
				// let f = filters
				// f[column] = selected
				// console.log(f)
				await setFilters({
					...filters,
					[column]: selected
				})
			}
		}

		filter()
	}, [selected])

	let onChange = (e) => {
		e.preventDefault()
		let val = e.target.value
		console.log('dropdown filter changed to:', val)
		setSelected(val)
	}

	return (
		<Dropdown
			items={unique}
			onDropdownChange={setSelected}
		/>
	)
}