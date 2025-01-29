import { useContext, useReducer } from "react";
import { SelectedCellsContext } from "./SelectedCellsContext";
import { SelectedCellsStore } from "./SelectedCellsStore";


const SelectedCellsContextProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(SelectedCellsStore.reducer, []);
    const providerValue = { state, dispatch }

    return (
        <>
            <SelectedCellsContext.Provider value={providerValue}>
                {children}
            </SelectedCellsContext.Provider>
        </>
    )
}

function useSelectedCells() { 
    const context = useContext(SelectedCellsContext);

    if(context === undefined) { 
        throw new Error('useSelectedCells must be used within a SelectedCellsContextProvider!');
    }

    return context
}

export { SelectedCellsContextProvider, useSelectedCells };

