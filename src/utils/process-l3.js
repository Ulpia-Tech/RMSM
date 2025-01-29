let uris = [];

const recurseL3 = (typeObject) => {
	uris.push({
		uri: typeObject.uri,
		permissions: []
	});
	if (typeObject.attributes !== undefined) {
		for (let i = 0; i < typeObject.attributes.length; i++) {
			recurseL3(typeObject.attributes[i]);
		}
	}
}

export function processL3File(l3) {
	uris = [];
	let typesArr = [];

	typesArr = l3.entityTypes ? [...typesArr, ...l3.entityTypes] : typesArr;
	typesArr = l3.relationTypes ? [...typesArr, ...l3.relationTypes] :  typesArr;

	for (let i = 0; i < typesArr.length; i++) {
		recurseL3(typesArr[i]);
	}
	
	return uris;
}