'use client'
import React from 'react'

import { useState, useEffect } from 'react'

export default function Dropdown({ 
		items=[],
		id = d => d, 
		accessor = d => d,
		onDropdownChange = () => {}, 
		label = '', 
		selected: selectedId,
	}) {
	
	let [selected, setSelected] = useState(id(selectedId) ?? id(items[0]))
	// console.log('selected:', selected)
	// const [options, setOptions] = useState([...items.map(accessor)])
	
	// useEffect(() => {
		// setOptions(items.map(accessor))
	// }, [items])

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
			<select value={selected} onChange={onChange} >
			  { items.map(u => <option key={id(u)} value={id(u)}>{String(accessor(u))}</option>)}
			</select>
		</span>
	)
}