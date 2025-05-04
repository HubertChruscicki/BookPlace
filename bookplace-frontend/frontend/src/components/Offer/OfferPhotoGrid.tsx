import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import {useOffer} from "./OfferContext.tsx";
import api from "../../api/axiosApi.ts";

const OfferHeader: React.FC = () => {

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const { offer, isLoading, error } = useOffer();

    useEffect(() => {

        if (offer?.images) {
            const paths = offer.images.map(img => img.image.trim());
            setImageUrls(paths);
        }
    }, [offer]);

  return (
    <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "repeat(2, 1fr)",
      gap: 2,
      width: "100%",
      maxWidth: "1220px",

    }}
    >
        <Box
          sx={{gridArea: "1 / 3 / 2 / 4", bgcolor: "grey", p: 2, height: 250,
                backgroundImage: imageUrls[1] ? `url(${imageUrls[1]})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",}}
        >

        </Box>

        <Box
          sx={{gridArea: "1 / 4 / 2 / 5", bgcolor: "grey", p: 2, height: 250, borderTopRightRadius: 15,
                backgroundImage: imageUrls[2] ? `url(${imageUrls[2]})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",}}
        >

        </Box>

        <Box
          sx={{gridArea: "2 / 3 / 3 / 4", bgcolor: "grey", p: 2, height: 250,
                backgroundImage: imageUrls[3] ? `url(${imageUrls[3]})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",}}
        >

        </Box>

        <Box
          sx={{gridArea: "2 / 4 / 3 / 5", bgcolor: "grey", p: 2, height: 250, borderBottomRightRadius: 15,
                backgroundImage: imageUrls[4] ? `url(${imageUrls[4]})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",}}
        >

        </Box>

        <Box
          sx={{gridArea: "1 / 1 / 3 / 3", bgcolor: "grey", p: 2, borderTopLeftRadius: 15, borderBottomLeftRadius: 15,
                backgroundImage: imageUrls[0] ? `url(${imageUrls[0]})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
          }}
        >
        </Box>

    </Box>


  );
};

export default OfferHeader;
