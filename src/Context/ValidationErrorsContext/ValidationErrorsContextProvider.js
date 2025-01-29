import { useContext, useState } from "react"
import { ValidationErrorsContext } from "./ValidationErrorsContext";

const ValidationErrorsContextProvider = ({ children }) => {
    const [validationErrorsCollection, setValidationErrorsCollection] = useState([]);
    const [validationVisibility, setValidationVisibility] = useState(false);
    const [noErrorsMessage, setNoErrorsMessage] = useState(false);

    const providerValue = {
        validationErrorsCollection, setValidationErrorsCollection,
        validationVisibility, setValidationVisibility,
        noErrorsMessage, setNoErrorsMessage,
    }

    return (
        <ValidationErrorsContext.Provider value={providerValue}>
            {children}
        </ValidationErrorsContext.Provider>
    );
}

const useValidationErrorsCollection = () => {
    const context = useContext(ValidationErrorsContext);

    if (context === undefined) {
        throw new Error('useValidationErrorsContext must be used within a ValidationErrorsContextProvider!');
    }

    return context
}

export { ValidationErrorsContextProvider, useValidationErrorsCollection }