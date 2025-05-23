import React from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { colors } from "../../theme/colors.ts";

interface PaginationControlsProps {
    currentPage: number;
    maxPages: number;
    onPrevPage: () => void;
    onNextPage: () => void;
    disabled?: boolean;
}

const ReservationPagination: React.FC<PaginationControlsProps> = (
    {currentPage, maxPages, onPrevPage, onNextPage, disabled = false}) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
                onClick={onPrevPage}
                disabled={currentPage === 0 || disabled}
                sx={{ color: colors.blue[500] }}
            >
                <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
                onClick={onNextPage}
                disabled={currentPage >= maxPages - 1 || disabled}
                sx={{ color: colors.blue[500] }}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};

export default ReservationPagination;