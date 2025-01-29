import { useState } from "react";
import PermissionChoice from "../../../../shared/components/PermissionChoice/PermissionChoice";
import PermissionIcon from "../../../../shared/components/PermissionIcon/PermissionIcon";
import { GlobalVars } from "../../../../utils/globals";
import { iconMapper } from "../../process-data";


const checkIfRowHasFilter = (tableId, permissionsCollection) => {

    const currTable = permissionsCollection.find(item => item.tableId === tableId);

    if(currTable) {
        return 'filter' in currTable;
    }

    return false;
}

const CustomCell = (cellProps) => {
    const [showCheck, setShowCheck] = useState(false)

    const handleMouseEnter = () => {
        if (cellProps.cell.value.isDerived) {
            setShowCheck(true)
        }
    }

    const handleMouseLeave = () => {
        if (!showCheck) { return; }
        setShowCheck(false)
    }

    const handleClick = () => {
        setShowCheck(false);
    }

    const hasFilter = checkIfRowHasFilter(cellProps.column.parent.tableId, cellProps.row.original.permissions);
    const modifiedCell = iconMapper(cellProps.cell.value);

    const normalCell = !hasFilter ? <span data-testid="basic-cell">{modifiedCell.icon}</span> : <PermissionIcon relativePath={'/images/filter-blue.svg'} type={GlobalVars.Table_Values.Filter}/>;
    const derivedCell = <PermissionChoice handleClick={handleClick}/>

    return (
        <span style={{ minWidth: 100, minHeight: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2, }}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
        >
            {
                showCheck ? derivedCell : normalCell
            }
        </span>
    )
}

export default CustomCell
