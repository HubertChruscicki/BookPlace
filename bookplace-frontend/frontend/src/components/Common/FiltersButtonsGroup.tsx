import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { colors } from "../../theme/colors";

interface Option {
    name: string;
    link: string;
}

interface FiltersButtonGroupProps {
    options: Option[];
    selectedValue: string | null;
    onChange: (value: string) => void;
}

const FiltersButtonGroup: React.FC<FiltersButtonGroupProps> = ({options, selectedValue, onChange}) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                mb: 3,
            }}
        >
            {options.map((opt) => {
                const isSelected = selectedValue === opt.link;
                return (
                    <Button
                        key={opt.link}
                        component={Link}
                        to={opt.link}
                        variant={isSelected ? "contained" : "outlined"}
                        onClick={() => onChange(opt.link)}
                        sx={{
                            textTransform: "none",
                            backgroundColor: isSelected ? colors.blue[300] : "transparent",
                            color: isSelected ? "#fff" : colors.black[900],
                            borderRadius: "12px",
                            fontWeight: isSelected ? "bold" : "normal",
                            padding: "8px 16px",
                            boxShadow: isSelected ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "none",
                            borderWidth: isSelected ? "0" : "1px",
                            "&:hover": {
                                backgroundColor: isSelected ? colors.blue[500] : colors.blue[100],
                                boxShadow: isSelected ? "0 4px 12px rgba(0, 0, 0, 0.25)" : "none",
                            },
                        }}
                    >
                        {opt.name}
                    </Button>
                );
            })}
        </Box>
    );
};

export default FiltersButtonGroup;