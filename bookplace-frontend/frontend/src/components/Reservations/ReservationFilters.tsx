import React from "react";
import { Box, Button, styled } from "@mui/material";
import { colors } from "../../theme/colors.ts";

const FilterButton = styled(Button)<{active?: boolean}>(({ active }) => ({
    backgroundColor: active ? colors.blue[500] : colors.white[900],
    color: active ? colors.white[900] : colors.blue[500],
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 10,
    padding: "8px 16px",
    margin: "0 8px",
    border: `1px solid ${colors.blue[500]}`,
    '&:hover': {
        backgroundColor: active ? colors.blue[600] : colors.blue[100],
    }
}));

export type FilterType = "archive" | "cancelled";

interface ReservationFiltersProps {
    activeFilter: FilterType;
    onChangeFilter: (filter: FilterType) => void;
}

const ReservationFilters: React.FC<ReservationFiltersProps> = ({ activeFilter, onChangeFilter }) => {
    return (
        <Box sx={{ display: "flex"}}>

            <FilterButton
                active={activeFilter === "archive"}
                onClick={() => onChangeFilter("archive")}
            >
                Archive
            </FilterButton>
            <FilterButton
                active={activeFilter === "cancelled"}
                onClick={() => onChangeFilter("cancelled")}
            >
                Cancelled
            </FilterButton>
        </Box>
    );
};

export default ReservationFilters;