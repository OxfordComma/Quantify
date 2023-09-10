'use client'
import React from 'react'

import { useState, useEffect } from 'react'
// import { useTable, useSortBy, useFilters, useRowSelect, useFlexLayout } from 'react-table'
// import styles from '../styles/Table.module.css'



export default function Dropdown({ 
		options: opts , 
		onDropdownChange = () => {}, 
		label = '', 
		selected: selectedOption 
	}) {
	let [selected, setSelected] = useState(selectedOption ?? 'all')
	const [options, setOptions] = useState(['all', ...opts])
	
	useEffect(() => {
			setOptions(opts)
	}, [opts])

	let onChange = (e) => {
		e.preventDefault()
		let val = e.target.value
		console.log('dropdown changed to:', val)
		onDropdownChange(val)
		setSelected(val)
	}

	return (
		<span>
			<label>{label}</label>
			<select value={selected} onChange={onChange}>
			  { options.map(u => <option value={u.toString()}>{u.toString()}</option>)}
			</select>
		</span>
	)
}