import { Box } from "@mui/material";
import OfferAmenities from "./OfferAmenities.tsx";
import OfferDescPreview from "./OfferDescPreview.tsx";
import OfferLandlordPreview from "./OfferLandlordPreview.tsx";
import OfferLocationRating from "./OfferLocationRating.tsx";
const OfferInfo: React.FC = () => {

  return (
    <Box sx={{display: "flex", flexDirection: "column",
            width: '100%',
            maxWidth: '1220px',
            m: "25px",
            mr: 5
        }}>

        <OfferLocationRating/>
        <OfferLandlordPreview/>
        <OfferDescPreview/>
        <OfferAmenities/>

    </Box>
  );
};

export default OfferInfo;
