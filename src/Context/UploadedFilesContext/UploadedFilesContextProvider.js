import { useContext, useState } from "react"
import { UploadedFilesContext } from "./UploadedFilesContext";

const UploadedFilesContextProvider = ({ children }) => {
    const [L3File, setL3File] = useState(null);
    const [configurationFile, setConfigurationFile] = useState(null);
    const [customRolesFile, setCustomRolesFile] = useState(null);
    const [L3Data, setL3Data] = useState(null);

    const providerValue = {
        L3File, setL3File,
        configurationFile, setConfigurationFile,
        customRolesFile, setCustomRolesFile,
        L3Data, setL3Data,
    };

    return (
        <UploadedFilesContext.Provider value={providerValue}>
            {children}
        </UploadedFilesContext.Provider>
    );
}

const useUploadedFiles = () => {
    const context = useContext(UploadedFilesContext);

    if (context === undefined) {
        throw new Error('useUploadedFiles must be used within a UploadedFilesContextProvider!');
    }

    return context;
}

export { UploadedFilesContextProvider, useUploadedFiles }