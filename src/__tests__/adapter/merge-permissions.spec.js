const { PermissionsFormatChecker } = require('../../utils/permissions-format-checker');
const fs = require('fs');
const { AdapterV2 } = require('../../utils/adapterV2');
const { validateUriAndId } = require('../../utils/test-helpers/adapter.utils');

const { flat } = require('../../Home/ExpandingTable/FilterAttribute/utils');
const { GlobalVars } = require('../../utils/globals');

// change the expected length based on your object: if there are multiple objects with same URI,
// they will be merged no matter what. This means, the length should be 1 

describe(`01`, () => {
    const file = require(`./permissions-files/01.json`);
    const processedFile = AdapterV2.process(file);
    const flattenFile = flat(processedFile);
    const ROLES_COUNT = 1;

    idUriPatternTest('01', flattenFile);

    it("should merge all object and result in one", () => {
        const EXPECTED_FILE_LENGTH = 1;
        expect(flattenFile.length).toEqual(EXPECTED_FILE_LENGTH);
    })

    it("permissions array should have ROLES_COUNT length", () => {
        expect(flattenFile[0].permissions.length).toBe(ROLES_COUNT);
    })

    it('access array should have 8 items', () => {
        expect(flattenFile[0].permissions[0].access.length).toBe(GlobalVars.ACCESS_TYPES_COLLECTION.length);
    })

    it("should have `READ`, `CREATE`, `MERGE` hasPermissions: true, rest: false", () => {
        const expectedGrantRights = [`READ`, `CREATE`, `MERGE`];

        flattenFile[0].permissions[0].access.forEach(cellObject => {
            const isExpected = expectedGrantRights.includes(cellObject.accessType);
            isExpected ? expect(cellObject.hasPermission).toBe(true) : expect(cellObject.hasPermission).toBe(false);
        })
    });

    it("`configuration/entityTypes` should have subRows length = 0", () => {
        expect(flattenFile[0].subRows.length).toBe(0);
    })
})

describe('02', () => {
    const file = require(`./permissions-files/02.json`);
    const processedFile = AdapterV2.process(file);
    const flattenFile = flat(processedFile);
    const ROLES_COUNT = 1;

    idUriPatternTest(`02`, flattenFile);

    it("should merge all equal by URI objects and result in 2 items", () => {
        const EXPECTED_FILE_LENGTH = 2;
        expect(flattenFile.length).toEqual(EXPECTED_FILE_LENGTH);
    })

    it("permissions array should have ROLES_COUNT length", () => {
        expect(flattenFile[0].permissions.length).toBe(ROLES_COUNT);
    })

    it("`configuration/entityTypes` should have subRows length = 1", () => {
        expect(flattenFile[0].subRows.length).toBe(1);
    })

    it("`configuration/entityTypes` should have children `configuration/entityTypes/Individual`", () => {
        const expectedChildrenURI = `configuration/entityTypes/Individual`;
        expect(flattenFile[0].subRows[0].uri).toBe(expectedChildrenURI);
    })
})

describe('03', () => {
    const file = require(`./permissions-files/03.json`);
    const processedFile = AdapterV2.process(file);
    const flattenFile = flat(processedFile);
    const ROLES_COUNT = 3;

    it("permissions array should have ROLES_COUNT length", () => {
        expect(flattenFile[0].permissions.length).toBe(ROLES_COUNT);
    })

    it("`configuration/entityTypes` G_RELTIO_DEV_ALL should have `READ`, `CREATE` - hasPermissions: true, rest: false", () => {
        const expectedGrantRights = [`READ`, `CREATE`];

        flattenFile[0].permissions[0].access.forEach(cellObject => {
            const isExpected = expectedGrantRights.includes(cellObject.accessType);
            isExpected ? expect(cellObject.hasPermission).toBe(true) : expect(cellObject.hasPermission).toBe(false);
        })
    });

    it("`configuration/entityTypes` GSR_DEV should have - hasPermissions: false to all", () => {
        flattenFile[0].permissions[1].access.forEach(cellObject => {
            expect(cellObject.hasPermission).toBe(false);
        })
    });

    it("`configuration/entityTypes` GSR_DEV_ALL should have - hasPermissions: false to all", () => {
        flattenFile[0].permissions[2].access.forEach(cellObject => {
            expect(cellObject.hasPermission).toBe(false);
        })
    });

    it("`configuration/entityTypes/Individual` GSR_DEV_ALL should have `READ, CREATE` - hasPermissions: true, rest: false", () => {
        const expectedGrantRights = [`READ`, `CREATE`];

        flattenFile[1].permissions[2].access.forEach(cellObject => {
            const isExpected = expectedGrantRights.includes(cellObject.accessType);
            isExpected ? expect(cellObject.hasPermission).toBe(true) : expect(cellObject.hasPermission).toBe(false);
        })
    });

    it("`configuration/entityTypes/Individual` G_RELTIO_DEV_ALL should have - hasPermissions: false", () => {
        flattenFile[1].permissions[0].access.forEach(cellObject => {
            expect(cellObject.hasPermission).toBe(false);
        })
    });
})


// uri: configuration/entityTypes - id: 1
// uri: configuration/entityTypes/Individual - id: 1.0
function idUriPatternTest(fileName, collection) {
    it(`${fileName} - 'id' should match 'uri' pattern`, () => {
        const isParentAndChildIdGenerationValid = validateUriAndId(collection);
        expect(isParentAndChildIdGenerationValid).toBe(true);
    })
}