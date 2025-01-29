import { useContext, useEffect, useReducer, useState } from "react";
import { RolesContext } from "./RolesContext";
import { RoleStore } from './RoleStore';

const RolesContextProvider = ({ children }) => {
    const [visibleRolesIdsCollection, setVisibleRolesIdsCollection] = useState([]);

    const [ state, dispatch ] = useReducer(RoleStore.reducer, { allRolesCollection: [], visibleRolesCollection: []});
    const providerValue = { 
        state, dispatch,
        visibleRolesIdsCollection, setVisibleRolesIdsCollection
    }

    useEffect(() => { 
        setVisibleRolesIdsCollection([...state.allRolesCollection]);
    }, [state])


    return (
        <>
            <RolesContext.Provider value={providerValue}>
                {children}
            </RolesContext.Provider>
        </>
    )
}

function useRolesCollection() { 
    const context = useContext(RolesContext);

    if(context === undefined) { 
        throw new Error('useRolesCollection must be used within a RolesContextProvider!');
    }

    return context
}

export { RolesContextProvider, useRolesCollection };
