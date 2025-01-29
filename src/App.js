
import { ActiveFiltersCounterContextProvider } from "./Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider";
import { LoadingContextProvider } from "./Context/LoadingContext/LoadingContextProvider";
import { PermissionsContextProvider } from "./Context/PermissionsContext/PermissionsContextProvider";
import { ReactTableLibContextProvider } from "./Context/ReactTableLibContext/ReactTableLibContextProvider";
import { RolesContextProvider } from "./Context/RolesContext/RolesContextProvider";
import { SelectedCellsContextProvider } from "./Context/SelectedCellsContext/SelectedCellsContextProvider";
import StartScreen from "./Home/StartScreen";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ConfigScreen from "./Home/ConfigScreen";
import { TenantRolesContextProvider } from "./Context/TenantRolesContext/TenantRolesContextProvider";
import { ValidationErrorsContextProvider } from "./Context/ValidationErrorsContext/ValidationErrorsContextProvider";
import { UploadedFilesContextProvider } from "./Context/UploadedFilesContext/UploadedFilesContextProvider";
import { TenantConnectionContextProvider } from "./Context/TenantConnectionContext/TenantConnectionContextProvider";
import ReactGA from 'react-ga4';
const TRACKING_ID = "G-FX28S3W2Y6";
ReactGA.initialize(TRACKING_ID);


function App() {

    return (
        <LoadingContextProvider>
            <PermissionsContextProvider>
                <RolesContextProvider>
                    <SelectedCellsContextProvider>
                        <ReactTableLibContextProvider>
                            <ActiveFiltersCounterContextProvider>
                                <ValidationErrorsContextProvider>
                                    <UploadedFilesContextProvider>
                                        <TenantRolesContextProvider>
                                            <TenantConnectionContextProvider>
                                                <Router>
                                                    <Routes>
                                                        <Route path="/" element={<StartScreen />} />
                                                        <Route path="/config" element={<ConfigScreen />} />
                                                    </Routes>
                                                </Router>
                                            </TenantConnectionContextProvider>
                                        </TenantRolesContextProvider>
                                    </UploadedFilesContextProvider>
                                </ValidationErrorsContextProvider>
                            </ActiveFiltersCounterContextProvider>
                        </ReactTableLibContextProvider>
                    </SelectedCellsContextProvider>
                </RolesContextProvider>
            </PermissionsContextProvider>
        </LoadingContextProvider>
    );
}

export default App;
