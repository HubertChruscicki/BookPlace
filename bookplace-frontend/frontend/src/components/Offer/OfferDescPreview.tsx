import {Box, Button, Typography} from "@mui/material";
import {colors} from "../../theme/colors.ts";
import React, {useState} from "react";
import Divider from "@mui/material/Divider";
import {useOffer} from "./OfferContext.tsx";

const description = `
Dom nie jest wynajmowany 21.06 - 15.08. Rezerwacja jest czynna 9 miesięcy wcześniej.

Willa z fantastyczną lokalizacją tuż przy plaży i panoramicznym widokiem na morze.
Działka przyrodnicza z dużym drewnianym tarasem i miejscami do siedzenia/jadalni.
Kuchnia, jadalnia i salon na planie otwartym.
Odosobniony pokój telewizyjny (tylko streaming).
3 sypialnie z podwójnymi łóżkami.
Loft z 4 łóżkami (Uwaga: strome schody).
2 łazienki, jedna z sauną i pralką.
`;


const OfferDescPreview: React.FC = () => {

    const { offer, isLoading, error } = useOffer();

    return (
        <Box>
            <Divider
                sx={{
                    my: 3,
                    borderColor: colors.grey[300],
                }}
            />
            <Typography
              sx={{
                whiteSpace: 'pre-line',
                display: '-webkit-box',
                WebkitLineClamp: 8,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {offer?.description || description}
            </Typography>

            <Button
                sx={{
                    color: colors.black[900],
                    fontWeight: "bold",
                    textDecoration: "underline",
                    textTransform: "none",
                }}
            >
                {`Show more >`}
            </Button>
        </Box>
    );
}

export default OfferDescPreview;

