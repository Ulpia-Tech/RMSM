import { GlobalVars } from "../../../utils/globals";

let uriPermissions = {};
export let errors = [];

export function dropToChild(currentField) {
    if (!uriPermissions[currentField.uri]) {
        uriPermissions[currentField.uri] = { ...accessOfField(currentField), validated: false };
    }
    if (currentField.subRows.length <= 0) {
        validateField(currentField.uri);
        return;
    } else {
        for (let j = 0; j < currentField.subRows.length; j++) {
            dropToChild(currentField.subRows[j]);
        }
    }
}

function generateParentAccessErrorMessage(accessType) {
    return `${accessType} requires the parent has ${accessType}`;
}

function compareAccessChildToParent(childAccess, parentAccess, childName) {
    Object.keys(parentAccess).forEach(tableId => {
        if (typeof parentAccess[tableId] !== 'boolean') {
            parentAccess[tableId].forEach(action => {
                // Checking if the same actionType is forbidden in the parent while allowed in the child
                let hasError = false;
                const currentAccess = childAccess[tableId];
                for (let i = 0; i < currentAccess.length; i++) {
                    if (currentAccess[i].accessType === action.accessType) {
                        if (currentAccess[i].hasPermission && !(action.hasPermission)) {
                            hasError = true;
                        }
                    }
                }
                if (hasError) {
                    errors.push({ errorMessage: generateParentAccessErrorMessage(action.accessType), tableId, permission: childName });
                }
            })
        }
    });
}

function getMissingPermissions(accessArray, requiredPermissions) {
    const missingPermissions = requiredPermissions.filter(prerequisite => {
        return accessArray.some(field => {
            return (field.accessType === prerequisite && field.hasPermission === false);
        });
    });

    return missingPermissions;
}

function generatePrerequisiteErrorMessage(fieldName, missingPermissions) {
    return `${fieldName} requires ${missingPermissions.toString()}`;
}

function checkForRequiredPermissions(uriAccess, displayName) {
    Object.keys(uriAccess).forEach(tableId => {
        if (typeof uriAccess[tableId] !== 'boolean') {
            uriAccess[tableId].forEach(action => {
                if (action.hasPermission) {
                    const requiredPermissions = GlobalVars.ACCESS_TYPE_PREREQUISITES[action.accessType];
                    if (requiredPermissions) {
                        const missingPermissions = getMissingPermissions(uriAccess[tableId], requiredPermissions);
                        if (missingPermissions.length !== 0) {
                            errors.push({ errorMessage: generatePrerequisiteErrorMessage(action.accessType, missingPermissions), field: action.accessType, tableId, permission: displayName });
                        }
                    }
                }
            })
        }
    })
}

function accessOfField(fieldObject) {
    const accessObject = {};
    for (let i = 0; i < fieldObject.permissions.length; i++) {
        accessObject[fieldObject.permissions[i].tableId] = fieldObject.permissions[i].access;
    }

    return accessObject;
}

function validateField(uriForValidation) {
    if (!uriPermissions[uriForValidation].validated) {
        uriPermissions[uriForValidation].validated = true;
        const parentUri = findUriOfParent(uriForValidation);
        if (parentUri) {
            validateField(parentUri);
            compareAccessChildToParent(uriPermissions[uriForValidation], uriPermissions[parentUri], getDisplayNameFromUri(uriForValidation));
        }
        checkForRequiredPermissions(uriPermissions[uriForValidation], getDisplayNameFromUri(uriForValidation));
    }
}

function findUriOfParent(fieldUri) {
    const splitUri = fieldUri.split('/');
    if (splitUri.length <= 2) {
        return null;
    }
    let parentUri = '';
    for (let i = 0; i < splitUri.length - 1; i++) {
        parentUri += splitUri[i] + '/';
    }

    return parentUri.slice(0, -1);
}

function getDisplayNameFromUri(uri) {
    const splitUri = uri.split('/');
    return splitUri[splitUri.length - 1];
}

export function resetErrors() {
    errors = [];
}

export function resetUriObject() {
    uriPermissions = {};
}