const { PermissionsFormatChecker } = require('../../utils/permissions-format-checker');
const fs = require('fs');
let negativeTestFilesCollection;

(() => {
    try {
        negativeTestFilesCollection = fs.readdirSync(`${__dirname}/wrong-permissions-files`);
    } catch (error) {
        it("You must provide data in order to run this test", () => {
            console.log('Create "wrong-permissions-files" folder with sample json files');
        });
        return;
    }

    describe.only("adapter validation", () => {

        negativeTestFilesCollection.forEach(fileName => {
            const item = require(`./wrong-permissions-files/${fileName}`);

            describe(`filename - ${fileName}`, () => {

                it("wrong file format - should return false", () => {
                    const result = PermissionsFormatChecker.validateFile(item);
                    expect(result).toBe(false);
                })
            });
        })
    })
})();


