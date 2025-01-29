export const flat = (array) => {
    let result = [];
    array.forEach(function (a) {
        result.push(a);
        if (Array.isArray(a.subRows)) {
            result = result.concat(flat(a.subRows));
        }
    });
    return result;
}

export const automaticallyCheckOrUncheckChilden = (flatRowsCollection, attribute) => {
    const parentChecked = attribute.isChecked;
    const shouldChangeCheckCollection = matchChildrenById(flatRowsCollection, attribute.original.uri);
    const changedCheckCollection = shouldChangeCheckCollection.map(item => {
        return { ...item, isChecked: !parentChecked }
    })
    flatRowsCollection.forEach((item, index) => {
        changedCheckCollection.forEach((changedItem) => {
            item.id === changedItem.id && (flatRowsCollection[index] = changedItem);
        })
    })
}

export const checkIfCheckboxShouldBeDisabled = (flatRowsCollection, attribute) => {
    const attrIdSplitted = attribute.id.split('.');
    const parentId = attrIdSplitted.slice(0, attrIdSplitted.length - 1).join('.');
    const parentObject = flatRowsCollection.filter(item => item.id === parentId)[0];
    return parentObject.isChecked;
}

export const matchChildrenById = (flatRowsCollection, attributeUri) => {
    const attributeChildren = [];
    flatRowsCollection.forEach(item => {
        item.original.uri.includes(attributeUri) && attributeChildren.push(item)
    })
    return attributeChildren;
}