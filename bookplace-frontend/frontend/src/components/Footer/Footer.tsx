import React from "react";
import { AppBar, Toolbar, Typography, Link, Box } from "@mui/material";
import Divider from "@mui/material/Divider";

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <AppBar
            component="footer"
            position="fixed"      // fixed zamiast sticky
            sx={{
                top: "auto",
                bottom: 0,
                backgroundColor: "white",
                color: "black",
                boxShadow: "none",
                width: "100%",       // wymusza pełną szerokość

            }}
        >
            <Divider
                sx={{
                    ml: "-40px",
                    mr: "-40px",
                }}
            />
            <Toolbar
                variant="dense"
                sx={{
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    gap: 1,
                    py: 2,
                }}
            >
                <Typography variant="body2">
                    © {year} BookPlace
                </Typography>

                <Box component="span" sx={{ mx: 0.5 }}>
                    ·
                </Box>

                {["Privacy", "Terms", "Help"].map((label) => (
                    <Link
                        key={label}
                        href="/"
                        underline="hover"
                        variant="body2"
                        sx={{ cursor: "pointer", color: "black" }}
                    >
                        {label}
                    </Link>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default Footer;
