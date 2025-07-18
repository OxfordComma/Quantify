'use client'
import React from 'react'
import Select from 'react-select';

import { useState, useEffect, useId } from 'react'

export default function CheckmarkDropdown({ 
		items,
		selected,
		setSelected,

		placeholder,
		styles,
	}) {

	const options = items.map(i => { return {value: i, label: i} })

	const colorStyles = {
	  control: (styles, { }) => {
	    return {
	      ...styles,
	      backgroundColor: 'var(--bg-color)'
	    };
	  },
	  menuList: (styles, { }) => {
	    return {
	      ...styles,
	      backgroundColor: 'var(--bg-color)'
	    };
	  },
	  option: (styles, { isFocused }) => {
	    return {
	      ...styles,
	      backgroundColor: isFocused ? 'gray' : 'var(--bg-color)'
	    };
	  }
	};
	
	return (
		<div style={{width: '100%'}}>
			<Select
				instanceId={useId()}
		        defaultValue={selected}
		        onChange={setSelected}
		        options={options}
		        isMulti={true}
		        placeholder={placeholder ?? selected}
		        styles={
		        	colorStyles
		        }
      		/>
    	</div>
	)
}