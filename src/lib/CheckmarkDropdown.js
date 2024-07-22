'use client'
import React from 'react'
import Select from 'react-select';

import { useState, useEffect } from 'react'

export default function CheckmarkDropdown({ 
		items,
		selected,
		setSelected,

		placeholder,
	}) {

	const options = items.map(i => { return {value: i, label: i} })
	
	return (
		<div style={{width: '100%'}}>
			<Select
        defaultValue={selected}
        onChange={setSelected}
        options={options}
        isMulti={true}
        placeholder={placeholder ?? selected}
        styles={{
        	// container: () => {return {'width': '100%', height: '100%'}}
        }}
      />
    </div>
	)
}