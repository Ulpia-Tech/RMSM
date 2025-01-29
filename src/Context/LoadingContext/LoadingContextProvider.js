import { useContext, useState } from "react";
import { LoadingContext } from "./LoadingContext";

const LoadingContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const providerValue = { loading, setLoading }

    return (
        <>
            <LoadingContext.Provider value={providerValue}>
                {children}
            </LoadingContext.Provider>
        </>
    )
}

function useLoading() {
    const context = useContext(LoadingContext);

    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingContextProvider!');
    }

    return context
}

export { LoadingContextProvider, useLoading };

