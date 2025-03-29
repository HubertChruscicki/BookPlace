import React, {useEffect, useState} from 'react';
import {Box, Button, Typography} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import {colors} from "../../theme/colors.ts";
import {useOffer} from "./OfferContext.tsx";
const OfferHeader: React.FC = () => {

    const [isLiked, setIsLiked] = useState<boolean>(false)

        const { offer, isLoading, error } = useOffer();

    useEffect(() => {
        console.log(offer)
    }, [offer]);



  return (
    <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between",
            width: '100%',
            maxWidth: '1220px',
            alignItems: "flex-end",
            m: "25px 0",
            mt: "80px",
            minHeight: "50px",

        }}>

        <Typography variant="h1" component="h2" sx={{fontSize: "1.5rem", fontWeight: "bold", maxWidth: "78%"}}>
            {offer?.title}
        </Typography>


        <Box sx={{display: "flex", flexDirection: "row"}}>
            <Button
              sx={{display: "flex",  flexDirection: "row",  alignItems: "center", textTransform: "none", color: colors.black[900], mr: "10px"}}
              onClick={() => null}
            >
                <ShareIcon sx={{fontSize: "1.2rem"}} />
                <Typography variant="h1" component="h2" sx={{fontSize: "1.3rem", ml: 2}}>
                   Share
                </Typography>
            </Button>

            <Button
                  sx={{display: "flex",  flexDirection: "row",  alignItems: "center", textTransform: "none", color: colors.black[900]}}
                  onClick={() => setIsLiked(!isLiked)}
            >
                 {isLiked ?
                    <FavoriteIcon sx={{fontSize: "1.2rem", color: colors.red[600]}} />
                     :
                    <FavoriteBorderIcon sx={{fontSize: "1.2rem"}} />
                 }
                <Typography variant="h1" component="h2" sx={{fontSize: "1.3rem", ml: 2}}>
                   Save
                </Typography>
            </Button>
        </Box>

    </Box>
  );
};

export default OfferHeader;
