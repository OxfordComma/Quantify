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
								 		{column['name']} {column['name'] == sortCol ? (sortDir == 'desc' ? '↓' : '↑') : ''}
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
												column['cell'] ? 
												column['cell'](d) : 
													column['format'] ? 
													column['format'](column['accessor'](d)) : 
													column['accessor'](d).toString()
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

