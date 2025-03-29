import OfferHeader from "../components/Offer/OfferHeader.tsx";
import {Box} from "@mui/material";
import OfferPhotoGrid from "../components/Offer/OfferPhotoGrid.tsx";
import OfferInfo from "../components/Offer/OfferInfo.tsx";
import OfferSummary from "../components/Offer/OfferSummary.tsx";

const MainPage: React.FC = () => {


  return(
      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: "0px 40px"}}>
          <OfferHeader/>
          <OfferPhotoGrid/>

          <Box sx={{display: "flex", flexDirection: "row", width: "100%", maxWidth: "1220px", justifyContent: "space-between"}}>
              <OfferInfo/>
              <OfferSummary/>
          </Box>

      </Box>
  );
};


export default MainPage;