import { dropToChild, errors, resetErrors, resetUriObject } from "./utils"

export const ValidateService = {}

ValidateService.validatePermissions = function (originalPermissionsCollection) {
    resetErrors();
    for (let i = 0; i < originalPermissionsCollection.length; i++) {
        dropToChild(originalPermissionsCollection[i]);
    }
    resetUriObject();
    return errors;
}   