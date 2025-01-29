import { Box, Container } from "@material-ui/core";
import { CssBaseline } from "@mui/material";
import Footer from "../shared/components/Footer/Footer";
import Header from "../shared/components/Header/Header";
import ExpandingTable from "./ExpandingTable/ExpandingTable";
import { usePermissionsCollection } from '../Context/PermissionsContext/PermissionsContextProvider';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const ConfigScreen = () => {
    const { state: permissionsCollectionState } = usePermissionsCollection();
    const navigate = useNavigate();

    useEffect(() => {
        if (permissionsCollectionState.originalPermissionsCollection.length === 0) {
            navigate('/');
        }
    }, [permissionsCollectionState.originalPermissionsCollection]);

    useEffect(() => {
        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };

        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
    }, []);

    return (
        <div style={{ minHeight: '100vh' }} className="App">
            <CssBaseline />
            <Header />
            <Box minHeight={'85.8vh'}>
                <Container maxWidth='xl'>
                    <ExpandingTable />
                </Container>
            </Box>
            <Footer />
        </div>
    );
}

export default ConfigScreen;