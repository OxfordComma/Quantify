'use client'
import React from 'react'

import { useState, useEffect } from 'react'
// import { useTable, useSortBy, useFilters, useRowSelect, useFlexLayout } from 'react-table'
// import styles from '../styles/Table.module.css'



export default function Dropdown({ 
		items=[],
		accessor = d => d,
		id = d => d, 
		onDropdownChange = () => {}, 
		label = '', 
		selected: selectedId
	}) {
	// console.log('dropdown props:', {
	// 	items,
	// 	accessor,
	// 	id,
	// 	label,
	// 	selectedId
	// })
	let [selected, setSelected] = useState(id(selectedId) ?? id(items[0]))
	// console.log('selected:', selected)
	// const [options, setOptions] = useState([...items.map(accessor)])
	
	// useEffect(() => {
		// setOptions(items.map(accessor))
	// }, [items])

	let onChange = (e) => {
		e.preventDefault()
		// console.log('e:', e)
		// console.log('target:', e.target)
		// console.log('target id:', e.target.id)
		// console.log('target value:', e.target.value)
		// console.log('target value id:', e.target.value.id)
		let val = e.target.value
		console.log('dropdown changed to:', val)
		onDropdownChange(val)
		setSelected(val)
	}

	// items.map(u => console.log({
	// 		id: id(u),
	// 		accessor: accessor(u)
	// 	})
	// )

	return (
		<span>
			<label>{label}</label>
			<select value={selected} onChange={onChange}>
			  { items.map(u => <option value={id(u)}>{accessor(u).toString()}</option>)}
			</select>
		</span>
	)
}