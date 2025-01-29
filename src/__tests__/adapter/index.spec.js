import { findAllRoles, mergeSameURI, sortByUriLengthOrLastWordAsci } from "../../utils/adapterV2-helper";
import rawFile from "../../utils/demo-file-small.json";

// const actual = TestFindAllRoles(rawFile);
describe('Adapter core function', () => {

    it('findAllRoles - should be able to detect all defined roles in the file', () => {
        const expected = { G_RELTIO_DEV_ALL: { }, G_RELTIO_DATASTEWARD: { }, G_RELTIO_UI_ALL: {} }
        const actual = findAllRoles(rawFile);

        expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());
    })

    it('mergeSameURI - should merge any objects that have same uri', () => {
        const expectedLength = 6;
        const sortedFile = sortByUriLengthOrLastWordAsci(rawFile);
        const actual = mergeSameURI(sortedFile);

        expect(actual).toHaveLength(expectedLength);
    })
})
