import { Box, Button, Typography } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

interface PaginationControlsProps {
    pageNumber: number;
    totalPages: number;
    totalItemsCount: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
    isLoading: boolean;
}

export default function PaginationControls({
                                               pageNumber,
                                               totalPages,
                                               totalItemsCount,
                                               pageSize,
                                               onPageChange,
                                               isLoading
                                           }: PaginationControlsProps) {
    const isFirstPage = pageNumber <= 1;
    const isLastPage = pageNumber >= totalPages;

    const startItem = totalItemsCount > 0 ? (pageNumber - 1) * pageSize + 1 : 0;
    const endItem = Math.min(pageNumber * pageSize, totalItemsCount);

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
            mb={2}
        >
            <Typography variant="body2" color="text.secondary">
                {totalItemsCount > 0 ? (
                    `Showing ${startItem} - ${endItem} of ${totalItemsCount} results`
                ) : (
                    'No results found'
                )}
            </Typography>

            <Box display="flex" gap={1}>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(pageNumber - 1)}
                    disabled={isFirstPage || isLoading}
                    startIcon={<ArrowBackIosNew sx={{ fontSize: 16 }} />}
                    sx={{ borderRadius: 25, textTransform: 'none' }}
                >
                    Previous
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => onPageChange(pageNumber + 1)}
                    disabled={isLastPage || isLoading}
                    endIcon={<ArrowForwardIos sx={{ fontSize: 16 }} />}
                    sx={{ borderRadius: 25, textTransform: 'none' }}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
}