export const SelectedCellsStore = {}

SelectedCellsStore.action_types = {
    ADD_SELECTED: 'add-selected',
    REMOVE_SELECTED: 'remove-selected',
    REMOVE_ALL_SELECTED: 'remove-all-selected',
    ADD_MULTIPLE_SELECTED: 'add-multiple-selected',
    REMOVE_MULTIPLE_SELECTED: 'remove-multiple-selected',

}

SelectedCellsStore.reducer = (state, action) => {

    switch (action.type) {
        case SelectedCellsStore.action_types.ADD_SELECTED:
            return [...state, action.payload.cell];

        case SelectedCellsStore.action_types.REMOVE_SELECTED:
            const modifiedCollcetion = state.filter(({ value: { cellId } }) => cellId !== action.payload.cell.value.cellId);
            return modifiedCollcetion;

        case SelectedCellsStore.action_types.REMOVE_ALL_SELECTED:
            return [];

        case SelectedCellsStore.action_types.ADD_MULTIPLE_SELECTED:
            return [...state, ...action.payload.collection];

        case SelectedCellsStore.action_types.REMOVE_MULTIPLE_SELECTED:
            const modifiedSelectedCollection = state.filter(item => {
                return !!!action.payload.collection.find(itemToRemove => itemToRemove.value.cellId === item.value.cellId);
            })

            return modifiedSelectedCollection;

        default:
            return
    }
}