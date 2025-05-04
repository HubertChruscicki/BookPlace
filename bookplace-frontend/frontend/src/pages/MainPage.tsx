import {Box} from "@mui/material";
import Header from "../components/Header/Header.tsx";
import OfferCard from "../components/Offer/OfferCard.tsx";
import {OfferCardModel} from "../models/OfferModel.ts";
import Footer from "../components/Footer/Footer.tsx";

const MainPage: React.FC = () => {
    const offer: OfferCardModel = {
        id: 1,
        title: 'Przytulny apartament w centrum',
        type: "Domek w górach",
        price_per_night: 120,
        rating: 4.7,
        city: 'Kraków',
        country: 'Polska',
        img_url: "http://localhost:8000/media/images/zakopane1.png"
    }
  return(

      <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: "0px 40px"}}>
          <Header fullWidth={true}/>
          <OfferCard offer={offer}/>
          <OfferCard offer={offer}/>
          <OfferCard offer={offer}/>
          <OfferCard offer={offer}/>
          <OfferCard offer={offer}/>
          <OfferCard offer={offer}/>
          <OfferCard offer={offer}/>
          <OfferCard offer={offer}/>
          <OfferCard offer={offer}/>
          <Footer/>
      </Box>
  );
};


export default MainPage;