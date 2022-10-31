import React from 'react'
import { useTable, useSortBy, useFilters, useRowSelect, useFlexLayout } from 'react-table'
// import styles from '../styles/Table.module.css'


function ReactTable({options, data, sortBy, styles, rowStyle}) {
	// console.log(props)
		let columns = Object.keys(options).map(c => {
			let opt = options[c]

			if (!opt.name) 
				opt.name = [c]

			if (!opt.accessor) 
				opt.accessor = d => d[c]

			if (opt.format && !opt.Cell)
				opt.Cell = d => <div>{opt.format(d.row.original[c])}</div>
				
			// Cell: d => <a href={d.row.original.uri}>{d.row.original.album.name}</a>,

			return {
				Header: c,
				sortType: 'basic',
				backgroundColor: 'rgba(52, 52, 52, 0.8)',
				...options[c]
			}
		})

	// BAD CODE FOR TESTING
	rowStyle = Object.keys(options).map(c => options[c].width ?? '15%').join(' ')

	return (
		<Table
			columns={React.useMemo(() => columns, [])} 
			data={React.useMemo(() => data)}
			sortBy={sortBy}
			styles={styles}
			rowStyle={rowStyle}
		/>
	)
	// }
}

function Table({ columns, data, sortBy, styles, rowStyle, getRowProps }) {
	var manualRowSelectedKey = 'selected'
	// Use the state and functions returned from useTable to build your UI
	const {
			getTableProps,
			getTableBodyProps,
			headerGroups,
			rows,
			prepareRow,
			selectedRowIds,
		} = useTable({
			columns,
			data,	
			manualRowSelectedKey,
			// sortBy,
			styles,
			// rowStyle,
			initialState: {
				sortBy: [sortBy ? sortBy : Object.keys(columns)[0] ]
			}
		},
		useFilters,
		useSortBy,
		useRowSelect,
		useFlexLayout,
	)


	// From react-table documentation
	return (
		<div className={styles.table}>
			<style jsx>{`
				 #tablerow {
					grid-template-columns: ${rowStyle};
				}
			`}
			</style>
			<table className={styles.table} {...getTableProps()}>
				<thead className={styles.tablehead}>
					{headerGroups.map(headerGroup => {
						{/*console.log('headerGroup:', headerGroup)*/}
						return (
						<tr >
							<div className={styles.row}  id='tablerow' key={headerGroup.headers.reduce((acc, curr) => acc = acc+curr)} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => {
								{/*console.log('column:', column)*/}
								return(
								<th key={column.Header} className={`${styles.headercell} ${styles.cell}`} {...column.getHeaderProps({ className: column.className, ...column.getSortByToggleProps() })}>
									{column.render('Header') + (column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : '⠀')}
									{/*column.canFilter ? column.render('Filter') : null*/}
			
								</th>
							)})}
							</div>
						</tr>
					)})}
				</thead>
				<tbody className={styles.tablebody} {...getTableBodyProps()}>
					{rows.map(
						(row, i) => {
							prepareRow(row);
							{/*console.log('row:', row);*/}
							return (
								<tr className={styles.row} id='tablerow' key={row.id} {...row.getRowProps()}>
									{row.cells.map(cell => {
										{/*console.log('cell:', cell)*/}
										return <td className={`${styles.bodycell} ${styles.cell}`} key={cell.value} {...cell.getCellProps()}>{cell.render('Cell')}</td>
									})}
								</tr>
							)}
					)}
				</tbody>
			</table>
		</div>
	)
}

export default ReactTable
