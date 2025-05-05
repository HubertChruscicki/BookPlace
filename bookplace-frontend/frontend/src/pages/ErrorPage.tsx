import React from "react";
import {Box, Typography} from "@mui/material";
import Header from "../components/Header/Header.tsx";
import Footer from "../components/Footer/Footer.tsx";

interface ErrorPageProps {
    message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({message}) => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: "0px 40px",
            }}
        >
            <Header fullWidth />
            <Typography component="h1" variant="h5">
                {message}
            </Typography>
            <Footer />
        </Box>
    )

}

export default ErrorPage;