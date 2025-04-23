import {AppBar, Box, Toolbar, Avatar, Typography, InputBase, styled} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ListIcon from '@mui/icons-material/List';
import {OfferModel} from "../../models/OfferModel.ts";
import React from "react";
import ProfileBlock from "./ProfileBlock.tsx";

// Stylowany kontener dla searchbara
const SearchContainer = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#f0f0f0",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: "100%",
    maxWidth: 400,
    display: "flex",
    alignItems: "center",
    padding: "4px 12px",
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    flex: 1,
}));

export interface HeaderProps {
    fullWidth?: boolean;
}


const Header: React.FC<HeaderProps> = ({fullWidth}) => {
    return (
        <AppBar position="sticky" elevation={0}
            sx={{
                backgroundColor: "white",
                color: "black",
                ...(fullWidth ? {} : { maxWidth: "1220px" })
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        width: 140,
                        height: 48,
                        backgroundImage: 'url("/logo.png")',
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "left center",
                    }}
                />

                <SearchContainer>
                    <SearchIcon color="action" />
                    <SearchInput placeholder="Search..." />
                </SearchContainer>

                {/*<Box*/}
                {/*    sx={{*/}
                {/*        display: "flex",*/}
                {/*        alignItems: "center",*/}
                {/*        gap: 1.5,*/}
                {/*        borderRadius: "30px",*/}
                {/*        border: "1px solid black"*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Box*/}
                {/*        sx={{*/}
                {/*            display: "flex",*/}
                {/*            flexDirection: "row",*/}
                {/*            padding: 1,*/}
                {/*            gap: 2*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <ListIcon fontSize="large"/>*/}
                {/*        <Avatar alt="John Doe" src="/avatar.jpg" />*/}
                {/*    </Box>*/}
                {/*</Box>*/}

                <ProfileBlock/ >
            </Toolbar>
        </AppBar>
    );
};

export default Header;
