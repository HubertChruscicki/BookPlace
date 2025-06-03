import React from "react";
import { Box, Card, CardContent, Typography, Grid, Avatar } from "@mui/material";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";
import { colors } from "../../theme/colors.ts";

interface ReservationCardProps {
    reservation: ReservationInfoModel;
}

const LandlordReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed": return colors.green[500];
            case "pending": return colors.orange[500];
            case "canceled": return colors.red[500];
            default: return colors.grey[500];
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                mb: 2,
                borderRadius: 2,
                border: `1px solid ${colors.grey[200]}`,
                "&:hover": {
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease"
                }
            }}
        >
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar
                            variant="rounded"
                            src={reservation.offer.img_url}
                            alt={reservation.offer.title}
                            sx={{
                                width: 70,
                                height: 70,
                                borderRadius: 2
                            }}
                        />
                    </Grid>

                    <Grid item xs>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h6" component="div" fontWeight="medium">
                                {reservation.offer.title}
                            </Typography>

                            <Box
                                sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    backgroundColor: getStatusColor(reservation.status),
                                    color: "white",
                                    fontSize: "0.75rem",
                                    fontWeight: "medium",
                                    textTransform: "uppercase"
                                }}
                            >
                                {reservation.status}
                            </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                            {reservation.offer.city}, {reservation.offer.country}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default LandlordReservationCard;