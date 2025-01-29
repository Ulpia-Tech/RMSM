import { Box, Container } from "@material-ui/core";
import { CssBaseline } from "@mui/material";
import Footer from "../shared/components/Footer/Footer";
import Header from "../shared/components/Header/Header";
import EmptyView from "./EmptyView/EmptyView";

const StartScreen = () => {
    return (

        <div style={{ minHeight: '100vh' }} className="App">
            <CssBaseline />
            <Header />
            <Box minHeight={'85.8vh'}>
                <Container maxWidth='xl'>
                    <EmptyView />
                </Container>
            </Box>
            <Footer />
        </div>
    );
}

export default StartScreen;