import { styled } from "@mui/material/styles";
import { Box, Button, Rating, Typography } from "@mui/material";
import {colors} from "../../theme/colors.ts"
import {useNavigate} from "react-router-dom";
import {OfferCardModel} from "../../models/OfferModel.ts";

const Card = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 300,
    width: 350,
    overflow: "hidden",
    borderRadius: 15,
    // border: "0.005px solid grey",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
});

const Media = styled(Box)({
    width: "100%",
    height: "45%",
    backgroundSize: "cover",
    backgroundPosition: "center",
});

const Content = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    width: "100%",
    padding: 24,
});

const Row = styled(Box)<{ justify?: string; align?: string }>(({ justify, align }) => ({
    display: "flex",
    justifyContent: justify || "flex-start",
    alignItems: align || "center",
    width: "100%",
}));

const BookButton = styled(Button)({
    backgroundColor: colors.blue[500],
    textTransform: "none",
    width: 100,
    color: colors.white[900]
});

interface OfferCardProps {
    offer: OfferCardModel;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <Media style={{ backgroundImage: `url(${offer.img_url})` }} />
            <Content>
                <Row justify="space-between" align="flex-start">
                    <Box sx={{ width: "75%" }}>
                        <Typography noWrap fontWeight="bold" fontSize="1.1rem">
                            {offer.title}
                        </Typography>
                        <Typography noWrap color="text.secondary">
                            {offer.type}
                        </Typography>
                    </Box>
                    <Row justify="flex-end">
                        <Rating name="half-rating" defaultValue={1} precision={0.5} max={1} readOnly />
                        <Typography fontWeight="bold" fontSize="1.1rem">
                            {offer.rating}
                        </Typography>
                    </Row>
                </Row>

                <Row justify="space-between" align="flex-end">
                    <Typography noWrap color="text.secondary">
                        {offer.city}, {offer.country}
                    </Typography>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography fontWeight="bold" fontSize="1.1rem">
                            {offer.price_per_night}$ night
                        </Typography>
                        <BookButton onClick={() => navigate(`/offer/${offer.id}`)}>
                            Book now
                        </BookButton>
                    </Box>
                </Row>
            </Content>
        </Card>
    );
};

export default OfferCard;
