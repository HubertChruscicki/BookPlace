import { Box } from "@mui/material";
import OfferAmenities from "./OfferAmenities.tsx";
import OfferDescPreview from "./OfferDescPreview.tsx";
import OfferLandlordPreview from "./OfferLandlordPreview.tsx";
import OfferLocationRating from "./OfferLocationRating.tsx";
const OfferInfo: React.FC = () => {

  return (
    <Box
         sx={{
             display: "flex",
             flexDirection: "column",
             width: "100%",
             maxWidth: "1220px",
             p: { xs: 1, md: 2 },
             my: { xs: 1, md: 2 },
             mr: { xs: 0, md: 2 },
         }}

    >
        <OfferLocationRating/>
        <OfferLandlordPreview/>
        <OfferDescPreview/>
        <OfferAmenities/>

    </Box>
  );
};

export default OfferInfo;
