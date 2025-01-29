import { useContext, useState } from "react";
import { ReactTableLibContext } from "./ReactTableLibContext";

const ReactTableLibContextProvider = ({ children }) => {
    const [flatRows, setFlatRows] = useState([]);
    const [visibleRowsCollection, setVisibleRowsCollection] = useState([]);
    const [columnsMapper, setColumnsMapper] = useState({});
    const [allColumns, setAllColumns] = useState([]);
    
    const [derivedMode, setDerivedMode] = useState(false);
    const [toggleHideAllColumnsRef, setToggleHideAllColumnsRef] = useState(null);

    const providerValue = {
        flatRows, setFlatRows,
        visibleRowsCollection, setVisibleRowsCollection,
        columnsMapper, setColumnsMapper,
        derivedMode, setDerivedMode,
        allColumns, setAllColumns,
        toggleHideAllColumnsRef, setToggleHideAllColumnsRef 
    }

    return (
        <ReactTableLibContext.Provider value={providerValue}>
            {children}
        </ReactTableLibContext.Provider>
    );
}


const useReactTableLibContext = () => {
    const context = useContext(ReactTableLibContext);

    if (context === undefined) {
        throw new Error('useReactTableLibContext must be used within a ReactTableLibContextProvider!');
    }

    return context
}

export { ReactTableLibContextProvider, useReactTableLibContext };
