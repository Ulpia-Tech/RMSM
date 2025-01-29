import { Button } from "@mui/material";
import { useRef } from "react";
import { usePermissionsCollection } from "../../../../Context/PermissionsContext/PermissionsContextProvider";
import { PermissionsStore } from "../../../../Context/PermissionsContext/PermissionStore";
import { useRolesCollection } from "../../../../Context/RolesContext/RolesContextProvider";
import { useSelectedCells } from "../../../../Context/SelectedCellsContext/SelectedCellsContextProvider";
import { SelectedCellsStore } from "../../../../Context/SelectedCellsContext/SelectedCellsStore";
import DialogLayoutModified from "../../../../shared/components/DialogLayoutModified/DialogLayoutModified";
import WarningContainer from "../../../../shared/components/WarningContainer/WarningContainer";
import { CellsService } from "../../../../shared/services/CellsService/CellsService";

const MakeRowsDerived = () => {
    const makeRowsDerivedDialogRef = useRef();

    const { dispatch: permissionsCollectionDispatcher } = usePermissionsCollection();
    const { state: rolesState } = useRolesCollection();
    const { state: selectedCellsCollectionState, dispatch: selectedCellsDispatcher } = useSelectedCells();

    const handleOpenDialog = () => {
        makeRowsDerivedDialogRef.current.handleOpen();
    }
    
    const handleMakeRowsDerived = () => {
        const selectedRowsCollection = CellsService.getSelectedCellsPerRow(selectedCellsCollectionState, rolesState.visibleRolesCollection);
        
        selectedRowsCollection.forEach(cellsCollection => {
            permissionsCollectionDispatcher({
                type: PermissionsStore.action_types.MAKE_ROWS_DERIVED,
                payload: { collection: cellsCollection }
            })
        })
        
        selectedCellsDispatcher({ type: SelectedCellsStore.action_types.REMOVE_ALL_SELECTED, payload: {} })
        makeRowsDerivedDialogRef.current.handleClose();
    }

    return (
        <>
            <Button variant="contained" onClick={handleOpenDialog} >Inherit from parent</Button>


            <DialogLayoutModified
                ref={makeRowsDerivedDialogRef}
                headingText={'Confirmation'}
                mainActionText={'Confirm'}
                secondaryActionText={'Cancel'}
                handleSubmitMainAction={handleMakeRowsDerived}
                handleSubmitSecondaryAction={() => makeRowsDerivedDialogRef.current.handleClose()}
                >

                <WarningContainer description={"The permissions for the selected rows will be inherited from parent for the following roles:"} />

                <ul style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center'}}>
                    {rolesState.visibleRolesCollection.map(roleObject => <li style={{padding: 5}} key={roleObject.tableId}>
                        {roleObject.displayName}
                    </li>
                    )}
                </ul>

            </DialogLayoutModified>
        </>
    )
}

export default MakeRowsDerived