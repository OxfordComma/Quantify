import React from 'react'

// import { useTable, useSortBy, useFilters, useRowSelect, useFlexLayout } from 'react-table'
// import styles from '../styles/Table.module.css'



export default function Table({ 
	data, 
	columns, 
	sortCol, 
	sortDir, 
	title,
	titleAlign='center',
	styles={}, 
	onClickHeader=()=>{},
	onClickCell=(d)=>{ console.log('onClickCell', d)},
	highlight,
}) {
	function ShowSortDirection({sortDir, sorting}) {
		let rowStyle = {
			display: 'flex', 
			flexDirection: 'column',
			fontSize: '0.5em'
		}
		let arrowStyle = {
			// height: '10px',
		}
		return (<div style={rowStyle}>
 			<div style={{
 				opacity:  (sortDir=='asc' && sorting)?1:0.25,
 				...arrowStyle, 
 			}}>▲</div>
 			<div style={{
 				...arrowStyle, 
 				opacity:  (sortDir=='desc' && sorting)?1:0.25,
 			}}>▼</div>
		</div>)
	}


	// For sticky headers
	const tableStyles = {
	  borderCollapse: 'collapse',
	}

	const titleStyles = {
		'text-align': titleAlign,
	}

	const headerStyles = {
		position: 'sticky',
  	top: '0px',
  	cursor: 'pointer',
	}

	const headerCellStyles = {
		display: 'flex',
		flexDirection: 'row',
	}

	const rowStyles = {
		'height': '25px',
		'maxHeight': '25px',
	}

	let tableScrollWindowStyle = {
		width: '100%',
		height: '100%',
		overflow: 'scroll',
		margin: '5px',
	}

	return (
		<div className={styles['table-container']} style={tableScrollWindowStyle}>
			<div className={styles['table-title']} style={titleStyles}>{title}</div>
			<table className={styles['table']} style={tableStyles}>
				<thead className={styles['table-head']} style={headerStyles}>
					<tr className={styles['row']}id='tablerow'>
						{columns.map(column => {
							{/*console.log('column:', column)*/}
							return(
								<th className={`${styles['header-cell']} ${styles['cell']}`} >
									<div id={column['name']} style={column['width'] ? {...headerCellStyles, width: column['width']} : headerCellStyles} onClick={onClickHeader}>
										<div id={column['name']}>
									 		{column['name']}
								 		</div>
								 		<ShowSortDirection sorting={column['name']==sortCol} sortDir={sortDir}/>
							 		</div>
								</th>

						)})}
					</tr>
				</thead>
				<tbody className={styles['table-body']}>
					{data.map(d => {
						return (
							<tr className={`${styles['row']} ${(highlight && d[highlight]) ? styles['highlighted-row'] : null}`} style={rowStyles}>
								{columns.map(column => {
									return (
										<td className={styles['cell']} style={{width: column['width']}} onClick={column['onClick'] ?? onClickCell}>
											{
												column['cell'] ? 
												column['cell'](d) : 
													column['format'] ? 
													column['format'](column['accessor'](d)) : 
													column['accessor'](d)?.toString() ?? ''
											}
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
			
		</div>
	)
}

