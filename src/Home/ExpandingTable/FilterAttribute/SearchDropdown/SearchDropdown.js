import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import EntityTypeItem from './EntityTypeItem/EntityTypeItem';

const SearchDropdown = ({ entityTypeCollection, onHandleCheckboxChange }) => {
    const [activeDisplayNamesCollection, setActiveDisplayNamesCollection] = useState([]);

    useEffect(() => { 
        const active = entityTypeCollection.filter(item => item.isChecked).map(item => item.original.displayName);
        setActiveDisplayNamesCollection(active);
    }, [entityTypeCollection])
    console.log(entityTypeCollection);
    return (
        <div>
            <FormControl sx={{ marginTop: 2, marginBottom: 2, width: '375px'}}>
                <InputLabel id="demo-multiple-checkbox-label">Active</InputLabel>
                <Select
                    data-testid="attribute-search-dropdown"
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={activeDisplayNamesCollection}
                    input={<OutlinedInput label="Active" />}
                    renderValue={(selected) => {
                        const areAllCheckboxesSelected = selected.length === entityTypeCollection.length;
                        if(areAllCheckboxesSelected) { 
                            return <span>All selected</span>
                        }
                        return selected.join(', ');
                    }}>
                    
                    <EntityTypeItem
                        entityTypeCollection={entityTypeCollection}
                        onHandleCheckboxChange={onHandleCheckboxChange}
                    />
                </Select>
            </FormControl>
        </div >
    );
}

export default SearchDropdown