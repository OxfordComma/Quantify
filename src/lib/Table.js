import React from 'react'

// import { useTable, useSortBy, useFilters, useRowSelect, useFlexLayout } from 'react-table'
// import styles from '../styles/Table.module.css'



export default function Table({ data, columns, sortCol, sortDir, styles, onClickHeader }) {

	return (
		<div className={styles.table}>
			{/*<style jsx>{`
				 #tablerow {
					grid-template-columns: ${rowStyle};
				}
			`}
			</style>*/}
			<table className={styles.table}>
				<thead className={styles.tablehead}>
					<tr className={styles.row}  id='tablerow'>
						{columns.map(column => {
							{/*console.log('column:', column)*/}
							return(
								<th onClick={onClickHeader}>
									<div>
								 		{column['name']} {column['name'] == sortCol ? sortDir == 'desc' ? '↓' : '↑' : ''}
							 		</div>
								</th>

						)})}
					</tr>
				</thead>
				<tbody className={styles.tablebody}>
					{data.map(d => {
						return (
							<tr>
								{columns.map(column => {
									return (
										<td>
											{
												column['cell'] ? column['cell'](d) : column['accessor'](d)
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


// function ReactTable({options, data, sortBy, styles, rowStyle}) {



// 	// BAD CODE FOR TESTING
// 	rowStyle = Object.keys(options).map(c => options[c].width ?? '15%').join(' ')
// 	console.log({
// 		data: data,
// 		columns: columns
// 	})
// 	return (
// 		<Table
// 			columns={memoColumns} 
// 			data={memoData}
// 			sortBy={sortBy}
// 			styles={styles}
// 			rowStyle={rowStyle}
// 		/>
// 	)
// 	// }
// }

// function Table({ columns, data, sortBy, styles, rowStyle, getRowProps }) {
// 	var manualRowSelectedKey = 'selected'
// 	// Use the state and functions returned from useTable to build your UI
// 	const {
// 			getTableProps,
// 			getTableBodyProps,
// 			headerGroups,
// 			rows,
// 			prepareRow,
// 			selectedRowIds,
// 		} = useTable({
// 			columns,
// 			data,	
// 			manualRowSelectedKey,
// 			// sortBy,
// 			styles,
// 			// rowStyle,
// 			initialState: {
// 				sortBy: [sortBy ? sortBy : Object.keys(columns)[0] ]
// 			}
// 		},
// 		useFilters,
// 		useSortBy,
// 		useRowSelect,
// 		useFlexLayout,
// 	)


// 	// From react-table documentation
// 	return (
// 		<div className={styles.table}>
// 			<style jsx>{`
// 				 #tablerow {
// 					grid-template-columns: ${rowStyle};
// 				}
// 			`}
// 			</style>
// 			<table className={styles.table} {...getTableProps()}>
// 				<thead className={styles.tablehead}>
// 					{headerGroups.map(headerGroup => {
// 						{/*console.log('headerGroup:', headerGroup)*/}
// 						return (
// 						<tr className={styles.row}  id='tablerow' key={headerGroup.headers.reduce((acc, curr) => acc = acc+curr)} {...headerGroup.getHeaderGroupProps()}>
// 							{headerGroup.headers.map(column => {
// 								{/*console.log('column:', column)*/}
// 								return(
// 								<th key={column.Header} className={`${styles.headercell} ${styles.cell}`} {...column.getHeaderProps({ className: column.className, ...column.getSortByToggleProps() })}>
// 									{column.render('Header') + (column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : '⠀')}
// 									{/*column.canFilter ? column.render('Filter') : null*/}
			
// 								</th>
// 							)})}
// 						</tr>
// 					)})}
// 				</thead>
// 				<tbody className={styles.tablebody} {...getTableBodyProps()}>
// 					{rows.map(
// 						(row, i) => {
// 							prepareRow(row);
// 							{/*console.log('row:', row);*/}
// 							return (
// 								<tr className={styles.row} id='tablerow' key={row.id} {...row.getRowProps()}>
// 									{row.cells.map(cell => {
// 										{/*console.log('cell:', cell)*/}
// 										return <td className={`${styles.bodycell} ${styles.cell}`} key={cell.value} {...cell.getCellProps()}>{cell.render('Cell')}</td>
// 									})}
// 								</tr>
// 							)}
// 					)}
// 				</tbody>
// 			</table>
// 		</div>
// 	)
// }

// export default ReactTable
