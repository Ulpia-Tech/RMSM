import { Button, Link, Paper, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useActiveFiltersCounter } from '../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider';
import { usePermissionsCollection } from '../../Context/PermissionsContext/PermissionsContextProvider';
import { PermissionsStore } from '../../Context/PermissionsContext/PermissionStore';
import { useReactTableLibContext } from '../../Context/ReactTableLibContext/ReactTableLibContextProvider';
import { useRolesCollection } from '../../Context/RolesContext/RolesContextProvider';
import { RoleStore } from '../../Context/RolesContext/RoleStore';
import { useSelectedCells } from '../../Context/SelectedCellsContext/SelectedCellsContextProvider';
import { SelectedCellsStore } from '../../Context/SelectedCellsContext/SelectedCellsStore';
import { useUploadedFiles } from '../../Context/UploadedFilesContext/UploadedFilesContextProvider';
import { useValidationErrorsCollection } from '../../Context/ValidationErrorsContext/ValidationErrorsContextProvider';
import { COLUMNS_COLLECTION } from '../../utils/globals';
import DerivedRowsActions from './DerivedRowsActions/DerivedRowsActions';
import "./expanding-table.css";
import FilterAttribute from './FilterAttribute/FilterAttribute';
import FilterByRights from './FilterByRights/FilterByRights';
import FilterByRole from './FilterByRole/FilterByRole';
import MultipleSelectionActions from './MultipleSelectionActions/MultipleSelectionActions';
import createRolesTable, { expanderColumnCreator } from './process-data';
import NoRolesView from './TableView/NoRolesView';
import TableView from './TableView/TableView';
import ExportFile from './ImportExport/ExportFile/ExportFile';
import UploadFile from './ImportExport/ImportMenu/UploadFile/UploadFile';
import ValidatePermissions from './Validate/ValidatePermissions';
import ImportMenu from './ImportExport/ImportMenu/ImportMenu';

const TABLE_WIDTH_IN_PX = 930;

function shouldBeAbleToMoveNext(scrollerPosition, visibleRolesCollectionLength) {
	return (scrollerPosition + TABLE_WIDTH_IN_PX <= (visibleRolesCollectionLength - 1) * TABLE_WIDTH_IN_PX);
}

function shouldBeAbleToMovePrev(scrollerPosition) {
	return scrollerPosition - TABLE_WIDTH_IN_PX >= 0;
}

function isOnLastTable(scrollerPosition) {
	return scrollerPosition % TABLE_WIDTH_IN_PX !== 0;
}

function ExpandingTable() {
	const theme = useTheme();
	const tableViewRef = useRef();

	const {
		state: rolesState,
		dispatch: rolesDispatcher,
	} = useRolesCollection();

	const { state: permissionsCollectionState, dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
	const { dispatch: selectedCellsDispatcher } = useSelectedCells();
	const {
		visibleRowsCollection: visibleRowsCollectionState,
		derivedMode: derivedModeState,
		columnsMapper: columnsMapperState,
		setColumnsMapper: setColumnsMapperState,
		allColumns: allColumnsState,
		toggleHideAllColumnsRef: toggleHideAllColumnsRefState,
	} = useReactTableLibContext();

	const {
		validationErrorsCollection: validationErrorsCollectionState,
		setValidationErrorsCollection,
		validationVisibility,
		setValidationVisibility,
		noErrorsMessage,
	} = useValidationErrorsCollection();

	const { activeFiltersCollection: activeFiltersCollectionState, setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();

	const { L3Data } = useUploadedFiles();

	const [scrollerPosition, setScrollerPosition] = useState(0);
	const scrollerRef = useRef(null);

	const columns = useMemo(() => {
		const roleObject = createRolesTable(rolesState.allRolesCollection, COLUMNS_COLLECTION);
		return [expanderColumnCreator(derivedModeState, L3Data), ...roleObject];
	}, [rolesState.allRolesCollection, derivedModeState])

	const data = useMemo(() => permissionsCollectionState.viewPermissionsCollection, [permissionsCollectionState.viewPermissionsCollection])

	const handleClearFilters = () => {
		const modifiedColumnMapper = { ...columnsMapperState };
		for (let i = 1; i < allColumnsState.length; i++) {
			const columnObject = allColumnsState[i];
			const colName = columnObject.Header.props.children;

			if (!columnsMapperState[colName].isVisible) {
				columnObject.toggleHidden();
			}

			if (!modifiedColumnMapper[colName].isVisible) {
				modifiedColumnMapper[colName].isVisible = true
			}
		}

		if (activeFiltersCollectionState.some(item => item.type === 'right' || item.type === 'role')) {
			toggleHideAllColumnsRefState();
		}

		selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} });
		setColumnsMapperState(modifiedColumnMapper);
		rolesDispatcher({ type: RoleStore.action_types.RESET_HIDDEN_ROLES, payload: {} });
		permissionsCollectionDispatcher({ type: PermissionsStore.action_types.RESET_FILTERS_ROWS, payload: {} });
		setActiveFiltersCollectionState([]);
	}

	const handleMoveScrollbarNext = () => {
		if (!shouldBeAbleToMoveNext(scrollerPosition, rolesState.visibleRolesCollection.length)) { return; }

		const newScrollerPosition = scrollerPosition + TABLE_WIDTH_IN_PX;
		scrollerRef.current.scrollLeft = newScrollerPosition;
		setScrollerPosition(newScrollerPosition);
	}

	const handleMoveScrollbarPrev = () => {
		if (!shouldBeAbleToMovePrev(scrollerPosition) && scrollerPosition !== 0) {
			scrollerRef.current.scrollLeft = 0;
			setScrollerPosition(0);
			return;
		}

		if (isOnLastTable(scrollerRef.current.scrollLeft)) {
			const secondToLastTablePos = (rolesState.visibleRolesCollection.length - 2) * TABLE_WIDTH_IN_PX;
			scrollerRef.current.scrollLeft = secondToLastTablePos;
			setScrollerPosition(secondToLastTablePos);
			return;
		}

		const newScrollerPosition = scrollerPosition - TABLE_WIDTH_IN_PX;
		scrollerRef.current.scrollLeft = newScrollerPosition;
		setScrollerPosition(newScrollerPosition);
	}

	const handleScroll = () => {
		setScrollerPosition(scrollerRef.current.scrollLeft);
	}

	useEffect(() => {
		scrollerRef.current && (scrollerRef.current.addEventListener("scroll", handleScroll));

		return () => { (scrollerRef.current)?.removeEventListener("scroll", handleScroll) };
	}, [rolesState.visibleRolesCollection])

	const arrowRightImg = <img
		style={{ width: '15px' }}
		src={`/images/arrow-right-${shouldBeAbleToMoveNext(scrollerPosition, rolesState.visibleRolesCollection.length) ?
			'blue' : 'gray'
			}.svg`}
		alt='arrow-right'
	/>;
	const arrowLeftImg = <img
		style={{ width: '15px' }}
		src={`/images/arrow-left-${(shouldBeAbleToMovePrev(scrollerPosition) || scrollerPosition !== 0) ?
			'blue' : 'gray'
			}.svg`}
		alt='arrow-left'
	/>;

	return (
		<section className='table-view-container'>
			{validationErrorsCollectionState.length > 0 && (
				<Box sx={{ marginBottom: 2, backgroundColor: '#fff', border: `1px solid ${theme.palette.error.main}`, padding: 1 }}>
					<Box display={'flex'} alignItems={'flex-start'}>
						<Link
							component="button"
							variant="body1" sx={{ marginRight: 5 }}
							underline="none"
							onClick={() => setValidationVisibility(prev => !prev)}
							style={{ color: theme.palette.error.main, display: 'flex', alignItems: 'center', marginLeft: 10 }}
						>
							<img src={'/images/attention-triangle-red.svg'} alt={'attention'} style={{ width: '20px', marginRight: '15px' }} />
							There {validationErrorsCollectionState.length === 1 ? 'is' : 'are'} {validationErrorsCollectionState.length}
							{validationVisibility ? '' : ' hidden'}
							{validationErrorsCollectionState.length === 1 ? ' error' : ' errors'} in the configuration.
							<img src={validationVisibility ? '/images/arrow-up-red.svg' : '/images/arrow-down-red.svg'} alt={'collapse-arrow'} style={{ width: '15px', marginLeft: '10px' }} />
						</Link>
						<Link
							onClick={() => setValidationErrorsCollection([])}
							component="button"
							variant="body1"
							sx={{ height: '20px', marginLeft: 'auto', marginRight: 2 }}
						>
							Clear all
							<span style={{ height: '20px', marginLeft: 6 }}>
								<img src='/images/cross-blue.svg' alt='cross-blue' />
							</span>
						</Link>
					</Box>

					{validationVisibility && (
						<ul style={{ listStyleType: 'disc', marginTop: 10, marginBottom: 0 }}>
							{
								validationErrorsCollectionState.map(error => {
									const errorRole = rolesState.allRolesCollection.find(role => {
										return role.tableId === error.tableId
									})
									return (
										<li style={{ color: theme.palette.error.main, marginBottom: 3, listStylePosition: 'inside', marginLeft: 50 }}>
											[{error.permission} | {errorRole.displayName}]: {error.errorMessage}
										</li>
									);
								})
							}
						</ul>
					)}
				</Box>
			)}

			{noErrorsMessage && (
				<Box sx={{
					marginBottom: 2,
					backgroundColor: '#fff',
					border: `1px solid ${theme.palette.success.main}`,
					padding: 1,
					color: theme.palette.success.main
				}}>
					There are no errors in the configuration
				</Box>
			)}

			<Box marginBottom={2} p={3} backgroundColor={'#fff'}>

				<Box display='flex'>

					<Box mr={1}>
						{visibleRowsCollectionState.length > 0
							?
							<>
								<FilterAttribute />
							</>
							:
							null
						}
					</Box>

					<Box flexGrow={1}>

						<Box marginRight={1}>
							<FilterByRole />
						</Box>
						<Box>
							<FilterByRights />
						</Box>
						<Box>
							<DerivedRowsActions />
						</Box>
					</Box>

					<Box display={'flex'} flexDirection={'column'}>
						<Box width={'240px'} mb={2}>
							<ValidatePermissions />
						</Box>
						<Box width={'240px'} mb={2}>
							<ImportMenu />
						</Box>
						<Box width={'240px'}>
							<ExportFile />
						</Box>
					</Box>
				</Box>

				{activeFiltersCollectionState.length > 0 && (
					<Box backgroundColor={'#F5F5F5'} width={'100%'} p={1} mt={2} display={'flex'} alignItems={'flex-start'}>
						<Link
							component="button"
							variant="body1" sx={{ marginRight: 5 }}
							underline="none"
						>
							You have {activeFiltersCollectionState.length} {activeFiltersCollectionState.length === 1 ? 'filter' : 'filters'} enabled
						</Link>
						<Link
							onClick={handleClearFilters}
							component="button"
							variant="body1"
						>Clear all</Link>
						<span style={{ height: '20px', marginLeft: 6 }}>
							<img src='/images/cross-blue.svg' alt='cross-blue' />
						</span>
					</Box>
				)
				}

			</Box>
			{derivedModeState &&
				(
					<Box sx={{ marginBottom: 2, backgroundColor: '#fff', border: `1px solid ${theme.palette.warning.main}`, borderRadius: '5px' }}>
						<Box display={'flex'} alignItems={'center'} paddingX={3} paddingY={1.5}>
							<img src={'/images/exclamation-mark-orange.svg'} alt={'warning'} style={{ width: '22px', marginRight: '15px' }} />
							<p style={{ color: theme.palette.warning.main, fontWeight: '500' }}>You are currently in inheritance management mode. Any cell actions are disabled. Switch it off if you wish to modify your permissions.</p>
						</Box>
					</Box>
				)}

			{rolesState.visibleRolesCollection.length !== 0 ? (
				<Paper sx={{ padding: '20px', boxShadow: 'none' }}>

					<Box flexGrow={1} display='flex' justifyContent={'space-between'} >
						<Box display={'inline-block'} position='relative'>

							<>
								<MultipleSelectionActions />
								<Button data-testid="clear-selection" sx={{ marginLeft: 1 }} onClick={() => {
									selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })
								}}>
									Clear selection</Button>
							</>
						</Box>

						<Box display={'inline-block'}>
							<Button
								startIcon={arrowLeftImg}
								onClick={handleMoveScrollbarPrev}
								sx={{ transition: 'none' }}
								disabled={!(shouldBeAbleToMovePrev(scrollerPosition) || scrollerPosition !== 0)}
								data-testid="prev-role"
							>Previous Role</Button>
							<Button
								endIcon={arrowRightImg}

								disabled={!shouldBeAbleToMoveNext(scrollerPosition, rolesState.visibleRolesCollection.length)}
								onClick={handleMoveScrollbarNext}
								sx={{ marginLeft: 1, transition: 'none' }}
								data-testid="next-role"
							>Next Role</Button>
						</Box>


					</Box>

					<Box>
						<section className="scroller-container table-view-container" ref={scrollerRef}>

							<TableView columns={columns} data={data}
								ref={tableViewRef}
							/>

						</section>
					</Box>
				</Paper>
			) : (
				<NoRolesView />
			)}


		</section>

	)
}

export default ExpandingTable