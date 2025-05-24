import React from "react";
import { Box, Typography, styled } from "@mui/material";
import {colors} from "../../theme/colors.ts";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";

const Card = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 250,
    width: 350,
    overflow: "hidden",
    borderRadius: 15,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    margin: "0 10px",
    cursor: "pointer",
    "&:hover": {
        boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.25)",
    }
});

const Media = styled(Box)({
    width: "100%",
    height: "50%",
    backgroundSize: "cover",
    backgroundPosition: "center",
});

const Content = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    width: "100%",
    padding: 24,
});

interface ReservationCardProps {
    reservation: ReservationInfoModel
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
    return (
        <Card>
            <Media style={{ backgroundImage: `url(${reservation?.offer?.img_url})` }} />
            <Content>
                <Box sx={{width: "100%",}}>
                    <Typography
                        fontWeight="bold"
                        fontSize="1.1rem"
                        noWrap
                    >
                        {reservation?.offer?.title}
                    </Typography>
                    <Typography color="text.secondary">
                        {reservation?.offer?.city}, {reservation?.offer?.country}
                    </Typography>
                    <Typography sx={{ mt: 1, fontWeight: 500, color: `${colors.black[900]}` }}>
                        {reservation.start_date} - {reservation.end_date}
                    </Typography>
                </Box>
            </Content>
        </Card>
    );
};

export default ReservationCard;