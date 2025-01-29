import { useContext, useState } from "react"
import { TenantConnectionContext } from "./TenantConnectionContext";

const TenantConnectionContextProvider = ({ children }) => {
    const [tenantURL, setTenantURL] = useState('');
    const [tenantID, setTenantID] = useState('');
    const [securityToken, setSecurityToken] = useState('');

    const providerValue = {
        tenantURL, setTenantURL,
        tenantID, setTenantID,
        securityToken, setSecurityToken,
    };

    return (
        <TenantConnectionContext.Provider value={providerValue}>
            {children}
        </TenantConnectionContext.Provider>
    );
}

const useTenantConnection = () => {
    const context = useContext(TenantConnectionContext);

    if (context === undefined) {
        throw new Error('useTenantConnection must be used within a TenantConnectionContextProvider!');
    }

    return context;
}

export { TenantConnectionContextProvider, useTenantConnection };