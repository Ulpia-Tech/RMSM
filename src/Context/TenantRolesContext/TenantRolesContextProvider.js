import { useContext, useState } from "react"
import { GlobalVars } from "../../utils/globals";
import { TenantRolesContext } from "./TenantRolesContext";

const TenantRolesContextProvider = ({ children }) => {
    const [customTenantRolesCollection, setCustomTenantRolesCollection] = useState([]);

    const allTenantRolesCollection = [...GlobalVars.TenantSystemRoles, ...customTenantRolesCollection];

    const providerValue = {
        customTenantRolesCollection, setCustomTenantRolesCollection,
        allTenantRolesCollection,
    }

    return (
        <TenantRolesContext.Provider value={providerValue}>
            {children}
        </TenantRolesContext.Provider>
    );
}

const useTenantRolesCollection = () => {
    const context = useContext(TenantRolesContext);

    if (context === undefined) {
        throw new Error('useTenantRolesCollection must be used within a TenantRolesContextProvider!');
    }

    return context;
}

export { TenantRolesContextProvider, useTenantRolesCollection };