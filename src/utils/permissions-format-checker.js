import { GlobalVars } from "./globals";

export const PermissionsFormatChecker = {}

const props = { URI: 'uri', PERMISSIONS: 'permissions', ROLE: 'role', ACCESS: 'access', FILTER: 'filter', }

// set custom messages if needed
PermissionsFormatChecker.validateFile = (rawFile) => {
    if(!Array.isArray(rawFile)) { return false; }    

    for (let i = 0; i < rawFile.length; i++) {
        const item = rawFile[i];

        if(!(typeof item === 'object' && !Array.isArray(item) && item !== null)) { return false; }

        if (!propsSyntaxCheck(item)) { return false; }
        if (!checkIfUriIsValid(item.uri)) { return false; }
        if (!uriCheck(item.uri)) { return false; }

        if(!Array.isArray(item.permissions)) { return false; }

        for (let j = 0; j < item.permissions.length; j++) {
            const permission = item.permissions[j];
            if (!checkPermissionsItems(permission)) { return false; }
            if(!permission.hasOwnProperty(props.ROLE)) { return false; }

            if(!Array.isArray(permission.access)) { continue; }

            for (let k = 0; k < permission.access.length; k++) {
                const accessItem = permission.access[k];

                if (!GlobalVars.ACCESS_TYPES[accessItem]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function checkIfUriIsValid(uri) {
    return uri.startsWith('configuration/entityTypes') || uri.startsWith('configuration/relationTypes');
}

function propsSyntaxCheck(item) {
    if (!item.hasOwnProperty(props.URI)) { return false; }
    if (!item.hasOwnProperty(props.PERMISSIONS)) { return false; }

    return (Object.keys(item)).every(item => item.toUpperCase() in props)
}

function checkPermissionsItems(permissionItem) {
    return Object.keys(permissionItem).every(key => key.toUpperCase() in props);
}

function uriCheck(uri) {
    const parts = uri.split('/');
    if (parts.length < 2) { return false; }
    if (parts[0] !== 'configuration') { return false; }
    if (parts[1] !== 'relationTypes' && parts[1] !== 'entityTypes') { return false; }
    return true;
}