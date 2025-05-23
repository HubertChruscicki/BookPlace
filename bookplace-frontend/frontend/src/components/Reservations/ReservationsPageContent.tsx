import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/colors.ts";
import UpcomingReservationsList from "./UpcomingReservationsList.tsx";
import OtherReservationsList from "./OtherReservationsList.tsx";

const ReservationsPageContent: React.FC = () => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: `${colors.white[800]}`,
                width: "100%",
                maxWidth: "1220px",
                height: "100%",
                marginTop: "40px",
            }}
        >
            <Typography sx={{ fontWeight: "bold", fontSize: "2.5rem", mb: 4, ml: 1 }}>
                My reservations
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",

                      gap: 7
                    }}
            >
                <UpcomingReservationsList/>
                <OtherReservationsList/>
            </Box>
        </Box>
    );
};

export default ReservationsPageContent;