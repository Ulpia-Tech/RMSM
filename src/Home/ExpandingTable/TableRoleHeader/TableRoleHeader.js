import { Button } from '@mui/material';
import { useState } from 'react';
import './TableRoleHeader.css';

const TableRoleHeader = ({ displayName, tableId, handleEditDisplayName }) => {

    const [displayNameInput, setDisplayNameInput] = useState(displayName);
    const [displayNameDisabled, setDisplayNameDisabled] = useState(false);

    const handleInputChange = (event) => {
        setDisplayNameInput(event.target.value);
    }

    const saveNewDisplayName = () => {
        setDisplayNameDisabled(false);
        handleEditDisplayName({ displayName: displayNameInput, tableId })
    }

    const handleUnlockEdit = () => {
        setDisplayNameDisabled(true)
    }

    return (
        <div className='roleHeader'>
            <span className='roleHeader-text'>
                <input value={displayNameInput} onChange={handleInputChange} disabled={!displayNameDisabled} className='roleHeader-actions-input' />
            </span>
            <div className='roleHeader-actions'>
                {
                    displayNameDisabled ?
                        <Button onClick={saveNewDisplayName} variant='contained' size='small' disableRipple>Save</Button>
                        :
                        <Button onClick={handleUnlockEdit} variant='outlined' size='small'>Edit</Button>
                }
            </div>
        </div>
    )
}

export default TableRoleHeader;