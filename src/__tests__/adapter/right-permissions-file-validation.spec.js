const { PermissionsFormatChecker } = require('../../utils/permissions-format-checker');
const fs = require('fs');
let positiveTestFilesCollection;

// create 'right-permissions-files' folder with sample RIGHT formatted json files included in order to make this test work
(() => {
    try {
        positiveTestFilesCollection = fs.readdirSync(`${__dirname}/right-permissions-files`);
    } catch (error) {
        it("You must provide data in order to run this test", () => {
            console.log('Create "right-permissions-files" folder with sample json files');
        });
        return;
    }

    describe.only("adapter validation", () => {

        positiveTestFilesCollection.forEach(fileName => {
            const item = require(`./right-permissions-files/${fileName}`);

            describe(`filename - ${fileName}`, () => {

                it("right file format - should return false", () => {
                    const result = PermissionsFormatChecker.validateFile(item);
                    expect(result).toBe(true);
                })
            });
        })
    })
})();


