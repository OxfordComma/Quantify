'use client'
import React from 'react'

import { useState, useEffect } from 'react'
import Dropdown from './Dropdown'
// import { useTable, useSortBy, useFilters, useRowSelect, useFlexLayout } from 'react-table'
// import styles from '../styles/Table.module.css'



export default function DropdownFilter({ data, filteredData, setFilteredData, column }) {
	let [selected, setSelected] = useState('all')
	let [unique, setUnique] = useState([])
	
	useEffect(() => {
		let subset = data.map(d => d[column])
		setUnique(['all', ...new Set(subset)])
		
	}, [data, column])

	useEffect(() => {
		// console.log('effect used')

		let filter = async () => {
			if (selected == 'all') {
				// console.log('Not Filtering!!!')
				await setFilteredData(data)
			}
			else {
				// console.log('Filtering!!!')
				await setFilteredData(data.filter(d => d[column] == selected))
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
			options={unique}
			onDropdownChange={setSelected}
		/>
	)
}