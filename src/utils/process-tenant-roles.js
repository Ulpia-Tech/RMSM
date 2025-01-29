export function processTenantRoles(rolesFile) {
    const rolesArray = [];
    //This will be changed when the structure of the file is known. For now a placeholder is used to test the other parts of the logic.
    for (let i = 0; i < rolesFile.length; i++) {
        rolesArray.push(rolesFile[i].roleName);
    }

    return rolesArray;
}