import { useContext, useReducer } from "react";
import { PermissionsContext } from "./PermissionsContext";
import { PermissionsStore } from "./PermissionStore";

const PermissionsContextProvider = ({ children }) => {
    
    const [ state, dispatch ] = useReducer(PermissionsStore.reducer, {
        viewPermissionsCollection: [], originalPermissionsCollection: [] 
    });
    const providerValue = { state, dispatch }

    return (
        <>  
            <PermissionsContext.Provider value={providerValue}>
                {children}
            </PermissionsContext.Provider>
        </>
    )
}

const usePermissionsCollection = () => { 
    const context = useContext(PermissionsContext);

    if(context === undefined) { 
        throw new Error('usePermissionsCollection must be used within a PermissionsContextProvider!');
    }

    return context;
}

export { PermissionsContextProvider, usePermissionsCollection };
