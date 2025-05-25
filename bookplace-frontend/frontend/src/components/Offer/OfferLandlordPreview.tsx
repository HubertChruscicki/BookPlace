import {Avatar, Box, Typography} from "@mui/material";
import {useOffer} from "./OfferContext.tsx";
const OfferLandlordPreview: React.FC = () => {

    const { offer, isLoading, error } = useOffer();

    return (
    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", mt: 4}}>
        <Avatar
            alt="Remy Sharp"
            sx={{ width: 42, height: 42, mr: 2 }}
        >
        </Avatar>
        <Typography variant="h1" component="h2" sx={{fontSize: "1.2rem", fontWeight: "bold"}}>
            {`Lanlord is ${offer?.landlord?.first_name}`}
        </Typography>
    </Box>
    );
};

export default OfferLandlordPreview;
