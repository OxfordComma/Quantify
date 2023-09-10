import React from 'react'

// import { useTable, useSortBy, useFilters, useRowSelect, useFlexLayout } from 'react-table'
// import styles from '../styles/Table.module.css'



export default function Table({ 
	data, 
	columns, 
	sortCol, 
	sortDir, 
	styles={}, 
	onClickHeader 
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
 				opacity:  (sortDir=='asc' && sorting)?1:0.6,
 				...arrowStyle, 
 			}}>▲</div>
 			<div style={{
 				...arrowStyle, 
 				opacity:  (sortDir=='desc' && sorting)?1:0.6,
 			}}>▼</div>
		</div>)
	}


	// For sticky headers
	const tableStyles = {
	  borderCollapse: 'collapse',
	}

	const headerStyles = {
		position: 'sticky',
  	top: '0px',
  	backgroundColor: 'black',
  	cursor: 'pointer',
	}

	const headerCellStyles = {
		display: 'flex',
		flexDirection: 'row',
	}

	let tableScrollWindowStyle = {
		width: '100%',
		height: '100%',
		overflow: 'scroll',
	}

	return (
		<div className={styles['table-container']} style={tableScrollWindowStyle}>
			<table className={styles['table']} style={tableStyles}>
				<thead className={styles['tablehead']} style={headerStyles}>
					<tr className={styles['row']}  id='tablerow'>
						{columns.map(column => {
							{/*console.log('column:', column)*/}
							return(
								<th className={styles['cell']} >
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
				<tbody className={styles['tablebody']}>
					{data.map(d => {
						return (
							<tr>
								{columns.map(column => {
									return (
										<td className={styles['cell']}>
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

