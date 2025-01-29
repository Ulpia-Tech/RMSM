import PermissionIcon from '../../shared/components/PermissionIcon/PermissionIcon';
import { IdGenerator } from '../../utils/process-data';
import CustomCell from './TableElements/CustomCell/CustomCell';
import RoleHeader from './TableElements/RoleHeader/RoleHeader';
import RowManagementCell from './TableElements/RowManagementCell/RowManagementCell';
import WarningPopup from './WarningPopup';


export default function createRolesTable(allRolesCollection, columnsRightsCollection) {
    const processedRolesCollection = [];

    allRolesCollection.map((roleObject, roleIndex) => {
        const currentRoleColumns = [...columnsRightsCollection].map((item, colIndex) => {

            return {
                Header: <span>{item.Header}</span>,
                id: IdGenerator(),
                accessor: (originalRow, rowIndex) => {

                    if(originalRow.permissions[roleIndex]) {
                        return originalRow.permissions[roleIndex].access[colIndex];
                    }

                    return {};
                    
                },
                Cell: CustomCell
            }
        })

        processedRolesCollection.push({
            Header: <RoleHeader roleObject={roleObject} />,
            tableId: roleObject.tableId,
            accessor: roleObject.displayName,
            columns: [...currentRoleColumns],
        })
    })
    return processedRolesCollection
}

export const expanderColumn = {
    id: 'expander',
    accessor: (props) => {
        return props.id;
    },
    Header: (props) => {
        return <RowManagementCell />;
    },
    Cell: (props) => {
        const crossImg = <img style={{ transform: 'rotate(45deg)', marginRight: 12 }} src='/images/plus-blue-2.svg' alt='plus' />;
        const minusImg = <img style={{ marginRight: 12, marginBottom: 3 }} src='/images/minus-blue.svg' alt='minus' />;
        return (
            <>
                <span id="row-selector"
                    style={{
                        position: 'absolute',
                        zIndex: '100',
                        top: 0, bottom: 0, right: 0, left: 0,
                        width: 25, borderRight: '1px solid  #E9EEFA',
                    }}>
                </span>
                {props.row.canExpand
                    ?
                    (
                        <span
                            {...props.row.getToggleRowExpandedProps({
                                style: {
                                    paddingLeft: `${props.row.depth * 1}rem`,
                                },
                            })}>
                            {props.row.isExpanded ?
                                <span>{minusImg} {props.row.original.displayName}</span> :
                                <span>{crossImg} {props.row.original.displayName}</span>
                            }
                        </span>
                    )
                    :
                    (
                        <span
                            {...props.row.getToggleRowExpandedProps({
                                style: {
                                    paddingLeft: `${props.row.depth * 1}rem`,
                                },
                            })}>
                            {`${props.row.original.displayName}`}
                        </span>
                    )}
            </>
        )
    }
}

function isInL3(uri, l3) {
    if (l3) {
        const splittedUri = uri.split('/');
        if (splittedUri.length === 2) {
            return l3.some(attribute => {
                return attribute.uri.includes(splittedUri[1]);
            });
        }
        if (splittedUri[splittedUri.length - 1] === 'attributes') {
            return isInL3(splittedUri.slice(0, -1).join('/'), l3);
        }
        return l3.some(attribute => {
            return attribute.uri === uri;
        });
    }
    return true;
}

export const expanderColumnCreator = (isDerivedMode, l3Data) => {

    const warning = <WarningPopup message={'This attributes doesn\'t exist in the L3 file'} style={{ width: '15px', marginRight: '10px' }} />;
    return {
        id: 'expander',
        accessor: (props) => {
            return props.id;
        },
        Header: (props) => {
            return <RowManagementCell />;
        },
        Cell: (props) => {
            const crossImg = <img style={{ marginRight: 10, width: '15px', height: '15px' }} src='/images/plus-blue-2.svg' alt='plus' />;
            const minusImg = <img style={{ marginRight: 10, width: '15px' }} src='/images/minus-blue.svg' alt='minus' />;

            let icon = null;
            if (!isInL3(props.row.original.uri, l3Data)) {
                icon = warning;
            }

            return (
                <>
                    <span id="row-selector"
                        style={{
                            position: 'absolute',
                            zIndex: '100',
                            top: 0, bottom: 0, right: 0, left: 0,
                            width: 35, borderRight: '1px solid  #E9EEFA',
                        }}>
                        {
                            isDerivedMode &&
                            <span id="row-selector-derived" style={{ marginLeft: '5px', height: '100%', width: '15px' }}>
                                <img id="row-selector-derived-img" src='/images/circle-gray.svg' alt='circle' />
                            </span>
                        }


                    </span>
                    {props.row.canExpand
                        ?
                        (
                            <span
                                {...props.row.getToggleRowExpandedProps({
                                    style: {
                                        paddingLeft: `${props.row.depth * 1}rem`,
                                    },
                                })}>
                                {props.row.isExpanded ?
                                    <span style={{ marginLeft: '10px' }}>{minusImg} {icon} {props.row.original.displayName}</span> :
                                    <span style={{ marginLeft: '10px' }}>{crossImg} {icon} {props.row.original.displayName}</span>
                                }
                            </span>
                        )
                        :
                        (
                            <span
                                {...props.row.getToggleRowExpandedProps({
                                    style: {
                                        paddingLeft: `${2 + props.row.depth * 1.05}rem`,
                                    },
                                })}>
                                {icon}
                                {`${props.row.original.displayName}`}
                            </span>
                        )}
                </>
            )
        }
    }
}

export const iconMapper = (cell) => {
    if (!cell.hasPermission) {
        return {
            ...cell,
            icon: <PermissionIcon relativePath={cell.isDerived ? '/images/cross-red-derived.svg' : '/images/cross-red.svg'} />,
        }
    }

    return {
        ...cell,
        icon: <PermissionIcon relativePath={cell.isDerived ? '/images/tick-green-derived.svg' : '/images/tick-green.svg'} />,
    }
}