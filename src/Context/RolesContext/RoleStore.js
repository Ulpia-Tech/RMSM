import { AdapterV2 } from "../../utils/adapterV2"

export const RoleStore = { }

RoleStore.action_types = {
    INIT_ROLES: 'init-roles',
    ADD_ROLE: 'add-role',
    DELETE_ROLE: 'delete-role',
    EDIT_ROLE: 'edit-role',
    SHOW_ROLE: 'show-role',
    HIDE_ROLE: 'hide-role',
    HIDE_ALL: 'hide-all',
    RESET_HIDDEN_ROLES: 'reset-hidden-roles',
}

// { roleObject } - DELETE_ROLE
// { roleObject, newName: name } - EDIT_ROLE
// { roleObject } - ADD_ROLE


RoleStore.reducer = (state, action) => {

    switch (action.type) {
        case RoleStore.action_types.INIT_ROLES:
            return { allRolesCollection: [...AdapterV2.rolesCollection], visibleRolesCollection: [...AdapterV2.rolesCollection] }
        
        case RoleStore.action_types.ADD_ROLE:
            return { 
                allRolesCollection: [...state.allRolesCollection, action.payload.roleObject],
                visibleRolesCollection: [...state.visibleRolesCollection, action.payload.roleObject] 
            }


        case RoleStore.action_types.DELETE_ROLE:
            const predicate = item => item.tableId !== action.payload.roleObject.tableId;
            return {
                allRolesCollection: state.allRolesCollection.filter(predicate),
                visibleRolesCollection: state.visibleRolesCollection.filter(predicate)
            }

        case RoleStore.action_types.EDIT_ROLE:
            const modifiedVisibleColl = editRole(state.visibleRolesCollection, action.payload.roleObject.tableId, action.payload.newName);
            const modifiedAllColl = editRole(state.allRolesCollection, action.payload.roleObject.tableId, action.payload.newName);
            
            return { 
                allRolesCollection: modifiedAllColl,
                visibleRolesCollection: modifiedVisibleColl
            }
        
        case RoleStore.action_types.SHOW_ROLE:
            return { 
                ...state,
                visibleRolesCollection: [...state.visibleRolesCollection, action.payload.roleObject]
            }
        
        case RoleStore.action_types.HIDE_ROLE:
            const modifiedVisibleRolesColl = state.visibleRolesCollection.filter(item => item.tableId !== action.payload.roleObject.tableId);
            return { 
                ...state,
                visibleRolesCollection: modifiedVisibleRolesColl
            }

        case RoleStore.action_types.RESET_HIDDEN_ROLES:
            return { 
                ...state,
                visibleRolesCollection: state.allRolesCollection
            }

        case RoleStore.action_types.HIDE_ALL:
        return { 
                ...state,
                visibleRolesCollection: []
            }

        default:
            return
    }
}

function editRole(collection, tableId, newName) {
    const modifiedState = [...collection];
    const roleIndex = modifiedState.findIndex(item => item.tableId === tableId);
    if(roleIndex === -1) { return modifiedState }

    const modifiedItem = { ...modifiedState[roleIndex], displayName: newName }
    modifiedState[roleIndex] = modifiedItem;
    
    return modifiedState;
}