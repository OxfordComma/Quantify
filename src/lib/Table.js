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
	onClickRow=()=>{},
	// onClickCell=(d)=>{ console.log('onClickCell', d)},
	rowKey,
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
  		// zIndex: -1,
	}

	const headerCellStyles = {
		display: 'flex',
		flexDirection: 'row',
	}

	const rowStyles = {
		'height': '25px',
		'maxHeight': '25px',
	}

	const cellStyles = {
		// 'pointerEvents': 'none'
	}

	let tableScrollWindowStyle = {
		width: '100%',
		height: '100%',
		// overflow: 'scroll',
	}

	return (
		<div className={styles['table-container']} style={tableScrollWindowStyle}>
			{/*<div className={styles['table-title']} style={titleStyles}>{title}</div>*/}
			<table className={styles['table']} style={tableStyles}>
				<thead className={styles['table-header']} style={headerStyles}>
					<tr className={styles['table-row']} id='tablerow'>
						{columns.map(column => {
							{/*console.log('column:', column)*/}
							return (
								<th key={column['name']} className={`${styles['header-cell']} ${styles['cell']}`} >
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
						// {console.log('d', rowKey, d, )}
						return (
							<tr key={rowKey ? rowKey(d) : Math.random().toString(16).slice(2)} id={rowKey ? rowKey(d) : null} className={`${styles['table-row']} ${ (highlight!==undefined && highlight(d)) ? styles['highlighted-row'] : '' }`} style={rowStyles} onClick={onClickRow}>
								{columns.map(column => {
									return (
										<td key={column['name']} className={`${styles['body-cell']} ${styles['cell']} ${ (highlight!==undefined && highlight(d)) ? styles['highlighted-cell'] : '' }`} style={{...cellStyles, width: column['width'] }} onClick={column['onClick'] ?? null}>
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

