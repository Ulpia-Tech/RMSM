import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useRef } from 'react';
import { useActiveFiltersCounter } from '../../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider';
import { useReactTableLibContext } from '../../../../Context/ReactTableLibContext/ReactTableLibContextProvider';
import { useSelectedCells } from '../../../../Context/SelectedCellsContext/SelectedCellsContextProvider';
import { SelectedCellsStore } from '../../../../Context/SelectedCellsContext/SelectedCellsStore';
import DialogLayoutModified from '../../../../shared/components/DialogLayoutModified/DialogLayoutModified';
import WarningContainer from '../../../../shared/components/WarningContainer/WarningContainer';

const RowManagementCell = () => {
    const confirmationDialogRef = useRef();

    const { state: selectedCellsCollectionState, dispatch: selectedCellsDispatcher } = useSelectedCells();
    const {
        derivedMode: derivedModeState,
        setDerivedMode: setDerivedModeState,
        columnsMapper: columnsMapperState,
        setColumnsMapper: setColumnsMapperState,
        allColumns: allColumnsState,
    } = useReactTableLibContext();

    const { activeFiltersCollection: activeFiltersCollectionState, setActiveFiltersCollection: setActiveFiltersCollectionState } = useActiveFiltersCounter();

    const handleChange = () => {
        const shouldOpenDialog = selectedCellsCollectionState.length > 0 && !derivedModeState;

        if (shouldOpenDialog) {
            handleOpenDialog();
            return
        }

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

        setColumnsMapperState(modifiedColumnMapper);
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })
        setDerivedModeState(!derivedModeState);
        setActiveFiltersCollectionState(activeFiltersCollectionState.filter(item => item.type !== 'right'));
    }


    const handleOpenDialog = () => {
        confirmationDialogRef.current.handleOpen();
    }

    const handleConfirm = () => {
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })
        setDerivedModeState(true);
        confirmationDialogRef.current.handleClose();
    }

    const handleCancel = () => {
        confirmationDialogRef.current.handleClose();
    }

    return (
        <>
            <FormGroup>
                <FormControlLabel control={<Switch size='small' data-testid="row-management-switch"
                    checked={derivedModeState} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} sx={{ marginLeft: 1, marginRight: 1, fontSize: '12px' }}
                />} label="Inheritance management" />
            </FormGroup>

            <DialogLayoutModified headingText={'Confirmation'} ref={confirmationDialogRef}
                mainActionText={'Confirm'} handleSubmitMainAction={handleConfirm}
                secondaryActionText={'Cancel'} handleSubmitSecondaryAction={handleCancel}>

                <WarningContainer description={"Inheritance management mode operates on whole rows only. By clicking “Confirm” all made selections will be cleared. Select “Cancel” if you wish to make refine selections."} />

            </DialogLayoutModified>

        </>

    );
}

export default RowManagementCell;