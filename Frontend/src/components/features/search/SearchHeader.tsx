import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { OfferSortBy } from '../../../models/OfferModels';
import FiltersModal, { type FilterValues } from './FiltersModal';
import {theme} from "../../../theme.ts";

interface SearchHeaderProps {
    totalCount: number;
    city?: string;
    sortBy?: OfferSortBy;
    onSortChange: (sortBy: OfferSortBy | undefined) => void;
    onFiltersChange: (filters: FilterValues) => void;
    activeFilters: FilterValues;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
    totalCount,
    city,
    sortBy,
    onSortChange,
    onFiltersChange,
    activeFilters
}) => {
    const [filtersModalOpen, setFiltersModalOpen] = useState(false);

    const getActiveFiltersCount = () => {
        let count = 0;
        if (activeFilters.minPrice !== undefined || activeFilters.maxPrice !== undefined) count++;
        if (activeFilters.rooms) count++;
        if (activeFilters.singleBeds) count++;
        if (activeFilters.doubleBeds) count++;
        if (activeFilters.sofas) count++;
        if (activeFilters.bathrooms) count++;
        if (activeFilters.amenities && activeFilters.amenities.length > 0) count++;
        return count;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: 2,
                mt: 5,
                mb: 2
            }}>

                <Typography variant="body1" 
                    sx={{ 
                        mb: 2,
                        color: 'text.primary',
                        fontSize: '1.3rem',
                    }}
                >
                    {city
                        ? `Found ${totalCount} places in: ${city}`
                        : `Found ${totalCount} places`
                    }
                </Typography>
     

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 200,  }}>
                        <InputLabel id="sort-select-label">Sort</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            value={sortBy ?? ''}
                            label="Sort"
                            onChange={(e) => {
                                const value = e.target.value;
                                onSortChange(value === '' ? undefined : value as OfferSortBy);
                            }}
                            sx={{ borderRadius: 20, px: 1,  }}
                        >
                            <MenuItem value="">
                                None
                            </MenuItem>
                            <MenuItem value={OfferSortBy.PriceAsc}>
                                Price: Low to High
                            </MenuItem>
                            <MenuItem value={OfferSortBy.PriceDesc}>
                                Price: High to Low
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        startIcon={<TuneIcon />}
                        onClick={() => setFiltersModalOpen(true)}
                        sx={{ 
                            minWidth: '100px',
                            borderRadius: '20px',
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            '&:hover': {
                                borderColor: theme.palette.primary.dark,
                            },
                            
                        }}
                    >
                        Filters
                        {activeFiltersCount > 0 && (
                            <Chip
                                label={activeFiltersCount}
                                size="small"
                                color="primary"
                                sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    height: 20,
                                    minWidth: 20,
                                    '& .MuiChip-label': {
                                        fontSize: '0.75rem',
                                        px: 0.5
                                    }
                                }}
                            />
                        )}
                    </Button>
                </Box>

            <FiltersModal
                open={filtersModalOpen}
                onClose={() => setFiltersModalOpen(false)}
                onApplyFilters={onFiltersChange}
                initialFilters={activeFilters}
            />
        </Box>
    );
};

export default SearchHeader;
