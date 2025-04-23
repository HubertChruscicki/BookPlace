import {Box} from "@mui/material";
import ProfileBox from "./ProfileBox.tsx";



const Header: React.FC = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
            }}
        >
            <Box
                sx={{
                    width: 150,
                    height: 56,
                    backgroundImage: 'url("/logo.png")',
                    backgroundSize: "contain",
                }}
            />

            <ProfileBox/>

        </Box>
    );
};


export default Header;