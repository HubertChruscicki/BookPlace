import React from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {Box, Typography, Divider,} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { colors } from "../../theme/colors";
import { OfferCardModel } from "../../models/OfferModel";

const Card = styled(Box)(({ theme }) => ({
    width: 350,
    height: 290,
    display: "flex",
    flexDirection: "column",
    borderRadius: 15,
    overflow: "hidden",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.2s",
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.25)",
    },
}));

const Media = styled(Box)({
    width: "100%",
    height: "45%",
    backgroundSize: "cover",
    backgroundPosition: "center",
});


const Content = styled(Box)({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: 16,
});

const Title = styled(Typography)({
    fontWeight: "bold",
    fontSize: "1.1rem",
});

const Subtitle = styled(Typography)({
    color: "text.secondary",
    fontSize: "0.9rem",
    marginTop: 4,
});


const Row = styled(Box)<{ justify?: string; align?: string }>(({ justify, align }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
}));


const IconTextRow = styled(Box)({
    display: "flex",
    alignItems: "center",
});

const PriceBox = styled(Box)({
    display: "flex",
    alignItems: "center",
});

interface OfferCardProps {
    offer: OfferCardModel;
    to?: string;
    onClick?: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, to, onClick }) => {
    const linkProps = to
        ? { component: Link, to }
        : { onClick };
    return (
        <Card {...linkProps}>
            <Media sx={{ backgroundImage: `url(${offer.img_url})` }} />
            <Content>
                <Box>
                    <Title noWrap>{offer.title}</Title>
                    <Subtitle noWrap>{offer.type}</Subtitle>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Row justify="space-between" align="center" sx={{ mb: 1 }}>
                    <IconTextRow>
                        <PlaceIcon sx={{ fontSize: 16, mr: 0.5, color: colors.blue[600] }} />
                        <Typography variant="body2">
                            {offer.city}, {offer.country}
                        </Typography>
                    </IconTextRow>

                    <IconTextRow>
                        <StarIcon sx={{ fontSize: 16, mr: 0.5, color: colors.yellow[500] }} />
                        <Typography variant="body2">{offer.rating.toFixed(1)}</Typography>
                    </IconTextRow>
                </Row>

                <PriceBox>
                    <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5, color: colors.green[600] }} />
                    <Typography variant="body2" fontWeight="bold">
                        {offer.price_per_night} zł / noc
                    </Typography>
                </PriceBox>
            </Content>
        </Card>
    );
};

export default OfferCard;
