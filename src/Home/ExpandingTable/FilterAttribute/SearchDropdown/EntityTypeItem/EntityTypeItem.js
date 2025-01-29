import { useTheme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Box } from "@mui/system";
import { checkIfCheckboxShouldBeDisabled } from "../../utils";

const EntityTypeItem = ({ entityTypeCollection, onHandleCheckboxChange }) => {
    const theme = useTheme();

    const renderRows = () => {
        
        return entityTypeCollection.map((row, index) => {
            
            if (row.depth > 0) {
                const isDisabled = checkIfCheckboxShouldBeDisabled(entityTypeCollection, row);
                return (
                    <Box key={row.id}
                        sx={{ paddingLeft: row.depth * 2, paddingBottom: 0.7, paddingTop: 0.7, '&:hover': { backgroundColor: '#F7F8FC', color: theme.palette.primary.main } }}>
                        <FormControlLabel

                            control={
                                <Checkbox data-testid="attribute-dropdown-item" checked={row.isChecked} disabled={!isDisabled}
                                    disableRipple onChange={() => onHandleCheckboxChange(row, index)} />
                            }
                            label={row.original.displayName} />
                    </Box>
                )
            }
        })
    }

    return (
        <>
            {renderRows()}
        </>
    )
}

export default EntityTypeItem;