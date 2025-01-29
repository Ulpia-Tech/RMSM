import { binarySearch, createRolesCollection, findAllRoles, findInsertIndex, mergeSameURI, sortByUriLengthOrLastWordAsci } from "./adapterV2-helper";
import { GlobalVars } from "./globals";
import { IdGenerator } from "./process-data";

export const AdapterV2 = {};

AdapterV2.process = (rawData) => {
    const roles = findAllRoles(rawData);

    AdapterV2.rolesCollection = createRolesCollection(roles);
    const sortedReltioPermissionFile = sortByUriLengthOrLastWordAsci(rawData);
    const mergedPermissionsFile = mergeSameURI(sortedReltioPermissionFile);

    const permissionTreeBuilder = new PermissionTreeBuilder(roles);
    mergedPermissionsFile.forEach(item => {
        permissionTreeBuilder.addFromPermissionFile(item);
        return;
    })

    return permissionTreeBuilder.getPermissionsTree();
}

class PermissionTreeBuilder {
    constructor(roles) {
        this.roles = roles;
        this._permissionsTree = {
            uri: "configuration",
            subRows: [],
            id: "",
            permissions: this.setRootPermissions(this.roles)
        }
    }

    getPermissionsTree() {
        return this._permissionsTree.subRows;
    }

    setRootPermissions(roles) {
        const permissions = [];
        for (const [key, value] of Object.entries(roles)) {
            const access = GlobalVars.ACCESS_TYPES_COLLECTION.map(item => {
                return {
                    accessType: item,
                    hasPermission: false,
                    isDerived: true,
                    cellId: IdGenerator()
                }
            });
            permissions.push({
                role: key,
                tableId: value.tableId,
                access
            })
        }
        return permissions;
    }

    // "configuration/relationTypes"
    addFromPermissionFile(reltioPermissionFileObject) {
        const permissionsTreeObject = this._getOrCreatePermissionsTreeObjectForURI(reltioPermissionFileObject.uri, reltioPermissionFileObject);
        return permissionsTreeObject;
    }

    addFromL3(uri) {
        const permissionsTreeObject = this._getOrCreatePermissionsTreeObjectForURI(uri, null);
        return permissionsTreeObject;
    }

    // "configuration/entityTypes/Individual"
    _getOrCreatePermissionsTreeObjectForURI(uri, reltioPermissionFileObject) {
        const pathElements = uri.split('/'); // [configuration, relationTypes]

        let currentUri = "";
        let currentPermissionTreeObject = this._permissionsTree;

        // [configuration, entityTypes, Individual]
        for (let i = 0; i < pathElements.length; i++) {
            currentUri += currentUri === "" ? pathElements[i] : "/" + pathElements[i];
            const currentReltioPermissionFileObject = pathElements.length === i + 1 ? reltioPermissionFileObject : null;
            currentPermissionTreeObject =
                this._getOrCreatePermissionTreeObject(currentUri, currentPermissionTreeObject, currentReltioPermissionFileObject);
        }
        return currentPermissionTreeObject;
    }

    _getPathElements(uri) {
        const paths = uri.split('/');
        return paths.slice(1);
    }

    //1. "configuration", { uri: "", subRows: [], id: "", permissions }, null
    //2. "configuration/relationTypes", { uri: "configuration", subRows: [], id: "0", permissions }, currObject (from file)
    _getOrCreatePermissionTreeObject(uri, permissionTreeParent, reltioPermissionFileObject) {
        let permissionTreeObject = this.tryGetPermissionTreeObject(uri, permissionTreeParent);

        if (permissionTreeObject === false) {
            permissionTreeObject = this._createPermissionTreeObject(uri, permissionTreeParent, reltioPermissionFileObject);
            this._addNewPermissionTreeObject(permissionTreeParent.subRows, permissionTreeObject);
        }
        return permissionTreeObject;
    }

    _addNewPermissionTreeObject(parentSubRows, permissionTreeObject) {
        // keep the parentSubRows sorted
        const insertIndex = findInsertIndex(parentSubRows, permissionTreeObject.uri, 0, parentSubRows.length - 1);
        parentSubRows.splice(insertIndex, 0, permissionTreeObject)
    }


    tryGetPermissionTreeObject(uri, parent) {
        if (parent.uri === uri) {
            return parent;
        }

        return binarySearch(parent.subRows, uri, 0, parent.subRows.length - 1);
    }

    _createPermissionTreeObject(uri, parent, reltioPermissionFileObject) {

        const id = parent.id === "" ? `${parent.subRows.length}` : parent.id + "." + parent.subRows.length;

        const permissions =
            reltioPermissionFileObject === null
                ?
                this._copyFromParent(parent, uri)
                :
                this._createFrom(reltioPermissionFileObject);

        return {
            uri,
            permissions,
            id,
            displayName: uri.split('/').pop(),
            subRows: [],
        }
    }

    _copyFromParent(parent, uri) {
        return parent.permissions.map(item => {
            return {
                ...item, access: item.access.map(accessItem => {
                    return { ...accessItem, isDerived: true, cellId: IdGenerator() } // uri.split('/').length !== 2
                })
            }
        })
    }

    _createFrom(reltioPermissionFileObject) {
        const rolesCoppy = { ...this.roles };

        const newPermissionsCollection = [];

        for (const [key, value] of Object.entries(rolesCoppy)) {
            const roleObjects = getRoleFromPermissionsIfExists(reltioPermissionFileObject, value.displayName);

            roleObjects.forEach(roleObject => {
                if (roleObject) {
                    roleObject.tableId = value.tableId;
                    roleObject.access = createAccessForExistingRole(roleObject);

                    newPermissionsCollection.push(roleObject);
                } else {
                    const newRoleObject = {
                        role: key,
                        tableId: value.tableId,
                        access: createAccessForNonExistingRole()
                    }
                    newPermissionsCollection.push(newRoleObject);
                }
            });
        }
        reltioPermissionFileObject.permissions = newPermissionsCollection;
        return reltioPermissionFileObject.permissions;
    }
}


function getRoleFromPermissionsIfExists(reltioPermissionFileObject, role) {
    return reltioPermissionFileObject.permissions.filter(item => item.role === role);
}

function createAccessForNonExistingRole() {
    return GlobalVars.ACCESS_TYPES_COLLECTION.map(cellName => {
        return {
            accessType: cellName,
            hasPermission: false,
            isDerived: false,
            cellId: IdGenerator()
        }
    })
}

function createAccessForExistingRole(roleObject) {
    const newAccessCollection = [];
    for (let j = 0; j < GlobalVars.ACCESS_TYPES_COLLECTION.length; j++) {
        const cellName = GlobalVars.ACCESS_TYPES_COLLECTION[j];
        let newCellObject = {
            accessType: cellName,
            hasPermission: false,
            isDerived: false,
            cellId: IdGenerator()
        }

        if (roleObject.access?.includes(cellName)) {
            newCellObject.hasPermission = true
        }
        newAccessCollection.push(newCellObject)
    }
    return newAccessCollection;
}
