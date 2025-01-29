import { usePermissionsCollection } from "../../../Context/PermissionsContext/PermissionsContextProvider";
import { useValidationErrorsCollection } from "../../../Context/ValidationErrorsContext/ValidationErrorsContextProvider";
import { Button } from '@mui/material';
import { ValidateService } from "../../../shared/services/ValidateService/ValidateService";

const ValidatePermissions = () => {
    const { state: permissionsCollectionState } = usePermissionsCollection();
    const {
        setValidationErrorsCollection,
        setValidationVisibility,
        setNoErrorsMessage,
    } = useValidationErrorsCollection();

    const hideNoErrorsMessage = () => {
        setNoErrorsMessage(false);
    }

    const handleValidate = () => {
        const errorsCollection = ValidateService.validatePermissions(permissionsCollectionState.originalPermissionsCollection);
        setValidationErrorsCollection(errorsCollection);
        setValidationVisibility(true);
        if (errorsCollection.length === 0) {
            setNoErrorsMessage(true);
            setTimeout(hideNoErrorsMessage, 3000);
        }
    }

    return (
        <Button variant="contained" sx={{ fontSize: '13px' }} color="primary" fullWidth onClick={handleValidate}>Validate permissions</Button>
    );
}

export default ValidatePermissions;