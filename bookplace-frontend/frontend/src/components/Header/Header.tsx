import {AppBar, Box, Toolbar, InputBase, styled} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, {useState} from "react";
import ProfileBlock from "./ProfileBlock.tsx";
import LoginModal from "../Login/LoginModal.tsx";

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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    return (
        <>
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

                    <ProfileBlock
                        isLogged={false}
                        onModalOpen={()=>setIsModalOpen(true)}
                    />
                </Toolbar>
            </AppBar>
            <LoginModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default Header;
