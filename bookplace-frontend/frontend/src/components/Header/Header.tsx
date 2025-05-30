import {AppBar, Box, Toolbar, InputBase, styled} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import ProfileBlock from "./ProfileBlock.tsx";
import Divider from "@mui/material/Divider";
import {useNavigate} from "react-router-dom";
import {colors} from "../../theme/colors.ts";

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

    const navigate = useNavigate();

    return (
        <>
            <AppBar position="sticky" elevation={0}
                sx={{
                    backgroundColor: `${colors.white[800]}`,
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
                        py: 2
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
                            cursor: "pointer"
                        }}
                        onClick={()=>navigate("/")}
                    />

                    <SearchContainer>
                        <SearchIcon color="action" />
                        <SearchInput placeholder="Search..." />
                    </SearchContainer>

                    <ProfileBlock/>
                </Toolbar>
                <Divider
                    sx={{
                        ml: "-40px",
                        mr: "-40px",
                    }}
                />
            </AppBar>
        </>
    );
};

export default Header;
