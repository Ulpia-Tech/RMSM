import { useContext, useState } from "react";
import { ActiveFiltersCounterContext } from "./ActiveFiltersCounterContext";

const ActiveFiltersCounterContextProvider = ({ children }) => { 
    const [stateCounter, setStateCounter] = useState([]);
    const providerValue = { activeFiltersCollection: stateCounter, setActiveFiltersCollection: setStateCounter }
    
    return (
        <>
            <ActiveFiltersCounterContext.Provider value={providerValue}>
                { children }
            </ActiveFiltersCounterContext.Provider>
        </>
    )
}

const useActiveFiltersCounter = () => {
    const context = useContext(ActiveFiltersCounterContext);

    if(context === undefined) { 
        throw new Error('useActiveFiltersCounter must be used within a ActiveFiltersCounterContextProvider!');
    }

    return context
}

export { ActiveFiltersCounterContextProvider, useActiveFiltersCounter };
