import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useExpanded, useFilters, useTable } from 'react-table';
import { usePermissionsCollection } from "../../../Context/PermissionsContext/PermissionsContextProvider";
import { PermissionsStore } from '../../../Context/PermissionsContext/PermissionStore';
import { useReactTableLibContext } from '../../../Context/ReactTableLibContext/ReactTableLibContextProvider';
import { useRolesCollection } from "../../../Context/RolesContext/RolesContextProvider";
import { useSelectedCells } from '../../../Context/SelectedCellsContext/SelectedCellsContextProvider';
import { SelectedCellsStore } from '../../../Context/SelectedCellsContext/SelectedCellsStore';
import { GlobalVars } from '../../../utils/globals';
import AddRole from '../AddRole/AddRole';
import './TableView.css';
import { accessTypesMapper, findSelectedCellsByColumn, findSelectedCellsByRow, initSelectableColumns } from './utils';

const EXPANDER_COl_ID = 'expander';
const EXPANDER_HEADER_ID = 'expander_placeholder_0';
const INITIAL_PERMISSIONS_COUNT = GlobalVars.ACCESS_TYPES_COLLECTION.length;

const TableView = forwardRef((props, ref) => {

	const {
		state: rolesState,
	} = useRolesCollection();

	const { dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
	const { state: selectedCellsCollectionState, dispatch: selectedCellsDispatcher } = useSelectedCells();
	const {
		setFlatRows: setFlatRowsState,
		setVisibleRowsCollection: setVisibleRowsCollectionState,
		columnsMapper: columnsMapperState,
		setColumnsMapper: setColumnsMapperState,
		derivedMode: derivedModeState,
		setAllColumns: setAllColumnsState,
		setToggleHideAllColumnsRef: setToggleHideAllColumnsRefState,
	} = useReactTableLibContext();

	const [columnsPerTableCount, setColumnsPerTableCount] = useState(INITIAL_PERMISSIONS_COUNT);

	const { columns: userColumns, data } = props


	const [parentRows, setParentRows] = useState({})

	const {
		getTableProps,
		getTableBodyProps,
		rows,
		allColumns,
		prepareRow,
		state: { expanded },
		headers,
		headerGroups,
		toggleHideColumn,
		toggleHideAllColumns,
		setHiddenColumns,
		toggleRowExpanded,
		flatRows

	} = useTable(
		{
			columns: userColumns,
			data,
			autoResetHiddenColumns: false,
			autoResetExpanded: false,
		},
		useFilters,
		useExpanded,
	)

	useImperativeHandle(
		ref,
		() => ({
			expandSelectedAttribute(attributeObject) {
				const splittedRowId = attributeObject.id.split('.');
				const idsCollection = []

				for (let i = splittedRowId.length - 1; i >= 1; i--) {
					const currentId = splittedRowId.slice(0, i);
					toggleRowExpanded(currentId.join('.'), true);
					idsCollection.push(currentId);
				}
				const parentId = idsCollection[idsCollection.length - 1][0];
				const newExpandedState = { ...parentRows }

				Object.entries(newExpandedState).forEach(([id, value]) => {

					if (id === parentId) {
						newExpandedState[id] = true;
					} else {
						newExpandedState[id] = false;
						toggleRowExpanded(id, false)
					}
				})
				setParentRows(newExpandedState)
			}
		})
	)

	const hideFilteredRoles = (visibleRoles) => {
		headers.forEach(roleInstance => {
			let doesExists = false;

			visibleRoles.forEach(roleObject => {
				const shouldNotHideRoleTable = roleInstance.tableId === roleObject.tableId;
				shouldNotHideRoleTable && (doesExists = true);
			})

			const shouldNotHideExpanderTable = roleInstance.id === EXPANDER_HEADER_ID;
			shouldNotHideExpanderTable && (doesExists = true);

			toggleHideColumn(roleInstance.id, !doesExists);
		})
	}

	useEffect(() => {
		setAllColumnsState(allColumns);

	}, [allColumns])

	useEffect(() => {
		const parentRows = {};
		rows.forEach(({ id }) => {
			parentRows[id] = false;
		})

		setVisibleRowsCollectionState(rows);
		const selectableColumns = initSelectableColumns(allColumns);
		setColumnsMapperState(selectableColumns);
		setParentRows(parentRows);
	}, [])

	useEffect(() => {
		hideFilteredRoles(rolesState.visibleRolesCollection);
	}, [rolesState.visibleRolesCollection])

	useEffect(() => {
		const columnTuple = Object.entries(columnsMapperState);
		columnTuple.length > 0 && hideFilteredColumns(columnTuple);

	}, [columnsMapperState])

	useEffect(() => {
		setFlatRowsState(flatRows);
		setToggleHideAllColumnsRefState(() => toggleHideAllColumns);
	}, [])

	const handleCellClick = (event, cell) => {

		if (event.target.id === 'row-selector' || event.target.id === 'row-selector-derived' || event.target.id === 'row-selector-derived-img') {

			const basicFilterPredicate = (item) =>
				rolesState.visibleRolesCollection.some(roleObject => roleObject.tableId === item.column.parent.tableId)
				&& columnsMapperState[accessTypesMapper[item.value.accessType]].isVisible

			const derivedFilterPredicate = (item) =>
				rolesState.visibleRolesCollection.some(roleObject => roleObject.tableId === item.column.parent.tableId);

			const selectedCollection = cell.row.allCells
				.slice(1, cell.row.allCells.length)
				.filter(!derivedModeState ? basicFilterPredicate : derivedFilterPredicate)
				.map(item => {
					item.selected = true;
					return item;
				})

			const response = findSelectedCellsByRow(selectedCollection, selectedCellsCollectionState);

			if (response.operation === GlobalVars.SELECT_TYPES.UNSELECT) {
				selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_MULTIPLE_SELECTED, payload: { collection: response.collection } })
				return;
			}
			if (response.operation === GlobalVars.SELECT_TYPES.SELECT) {
				selectedCellsDispatcher({ type: SelectedCellsStore.action_types.ADD_MULTIPLE_SELECTED, payload: { collection: response.collection } })
				return;
			}
		}

		if (cell.column.id === EXPANDER_COl_ID) {
			cell.row.depth === 0 && updateParentExpandStatus(cell.row.id);
			return
		}

		if (derivedModeState) { return; }

		const isCellFiltered =
			(event.target.nodeName === 'IMG' && event.target.getAttribute('data-permission') === GlobalVars.Table_Values.Filter)
			||
			(event.target.nodeName === 'SPAN' && event.target.firstChild.getAttribute('data-permission') === GlobalVars.Table_Values.Filter);

		if (isCellFiltered) {
			return;
		}

		if (event.ctrlKey || event.metaKey) {

			const isAlreadySelected = selectedCellsCollectionState.some(({ value: { cellId } }) => cellId === cell.value.cellId);

			if (isAlreadySelected) {
				selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_SELECTED, payload: { cell } });
				return
			}
			selectedCellsDispatcher({ type: SelectedCellsStore.action_types.ADD_SELECTED, payload: { cell } });
		}

		if (!event.ctrlKey && !event.metaKey) {
			const permissionTypeFromDerivedCell = event.target.dataset.permission;

			if (permissionTypeFromDerivedCell) {
				const value = GlobalVars.Table_Values.Grant === permissionTypeFromDerivedCell ? true : false;

				permissionsCollectionDispatcher({
					type: PermissionsStore.action_types.MODIFY_CELL_WITH_SPECIFIC_VALUE,
					payload: { cell, value, shouldChangeFullRow: cell.value.isDerived }
				});

			} else {
				permissionsCollectionDispatcher({ type: PermissionsStore.action_types.MODIFY_CELL, payload: { cell } });
			}
			selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} });
		}

	}

	const updateParentExpandStatus = (newExpandedRowId) => {
		const newExpandedState = { ...parentRows }

		Object.entries(newExpandedState).map(([id, value]) => {

			const shouldUpdateParentExpandStatus = newExpandedRowId === id;
			shouldUpdateParentExpandStatus ? (newExpandedState[id] = !newExpandedState[id]) : (newExpandedState[id] = false);

			toggleRowExpanded(id, newExpandedState[id])
		})
		setParentRows(newExpandedState);
	}

	const handleColumnHeaderClick = (column) => {
		if (derivedModeState) { return; }

		const isInvalidClick = column.id === EXPANDER_COl_ID || column.id === EXPANDER_HEADER_ID || !column.parent;
		if (isInvalidClick) { return; }

		const response = findSelectedCellsByColumn(rows, column.id, selectedCellsCollectionState);

		if (response.operation === GlobalVars.SELECT_TYPES.UNSELECT) {
			selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_MULTIPLE_SELECTED, payload: { collection: response.collection } })
			return;
		}

		if (response.operation === GlobalVars.SELECT_TYPES.SELECT) {
			selectedCellsDispatcher({ type: SelectedCellsStore.action_types.ADD_MULTIPLE_SELECTED, payload: { collection: response.collection } })
			return;
		}
	}

	const hideFilteredColumns = (columnTuplesCollection) => {
		let visibleCounter = 0
		for (let i = 0; i < columnTuplesCollection.length; i++) {

			const [columnName, { columnsIds, isVisible }] = columnTuplesCollection[i];
			columnsIds.forEach(columnId => toggleHideColumn(columnId, !isVisible));
			isVisible && visibleCounter++;
		}

		setColumnsPerTableCount(visibleCounter);
	}

	return (
		<>
			<table {...getTableProps()}>
				<thead data-testid="thead">
					{headerGroups.map(headerGroup => {
						return (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column, index) => {
									const isExpanderHeader = column.id === EXPANDER_HEADER_ID;
									return (<th
										onClick={() => handleColumnHeaderClick(column)}
										{...column.getHeaderProps()}
										className={index % columnsPerTableCount === 0 ? 'border' : undefined}
									>
										{isExpanderHeader ? <AddRole /> : column.render('Header')}

									</th>)
								})}
							</tr>
						)
					})}
				</thead>
				<tbody data-testid="tbody" {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row)
						return (
							<tr data-testid="tbody-tr" {...row.getRowProps()}>
								{row.cells.map((cell, index) => {

									let isSelected = false;
									if (selectedCellsCollectionState.length > 0) {
										selectedCellsCollectionState.map(item => {
											if (cell.value.cellId === item.value.cellId) {
												isSelected = true;
											}
										})
									}
									return <td data-testid="tbody-tr-td" className={[isSelected && 'selected', index % columnsPerTableCount === 0 && 'border'].join(" ")}
										{...cell.getCellProps()}
										onClick={(e) => handleCellClick(e, cell)}>{cell.render('Cell')}</td>
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
			<br />
		</>
	)
})

export default TableView