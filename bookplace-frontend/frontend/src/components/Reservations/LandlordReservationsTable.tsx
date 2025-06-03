import React, { useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Avatar,
    TablePagination, Pagination
} from "@mui/material";
import { ReservationInfoModel } from "../../models/ReservationModel.ts";
import { colors } from "../../theme/colors.ts";

interface LandlordReservationsTableProps {
    reservations: ReservationInfoModel[];
    isLoading?: boolean;
    page: number;
    rowsPerPage: number;
    count: number;
    onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
}
const LandlordReservationsTable: React.FC<LandlordReservationsTableProps> = ({ reservations, isLoading, page, rowsPerPage, count, onPageChange }) => {
    return (
        <Box sx={{ width: "100%", py: 3 }}>
            {isLoading ? (
                <Box sx={{ p: 4, textAlign: "center", width: "100%" }}>
                    <Typography variant="h6" color="text.secondary">
                        Loading...
                    </Typography>
                </Box>
            ) : reservations.length > 0 ? (
                <Box sx={{mb: 10}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reservations.map((reservation) => (
                                    <TableRow key={reservation.id}>
                                        <TableCell>
                                            <Avatar
                                                variant="rounded"
                                                src={reservation.offer.img_url}
                                                alt={reservation.offer.title}
                                                sx={{ width: 96, height: 96 }}
                                            />
                                        </TableCell>
                                        <TableCell>{reservation.offer.title}</TableCell>
                                        <TableCell>{`${reservation.offer.city}, ${reservation.offer.country}`}</TableCell>
                                        <TableCell>{new Date(reservation.start_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(reservation.end_date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color:
                                                        reservation.status === "confirmed"
                                                            ? "green"
                                                            : reservation.status === "pending"
                                                            ? "orange"
                                                            : "red",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {reservation.status}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Pagination
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    "&.Mui-selected": {
                                        backgroundColor: colors.blue[600],
                                        color: "white",
                                    },
                                },
                                "& .MuiPaginationItem-ellipsis": {
                                    display: "none",
                                },
                                "& .MuiPaginationItem-root .MuiPaginationItem": {
                                    color: colors.black[900],
                                    backgroundColor: colors.blue[300],
                                    "&:hover": {},
                                },
                            }}
                            count={Math.ceil(count / rowsPerPage)}
                            page={page}
                            onChange={onPageChange}
                            color="primary"
                        />
                    </Box>
                </Box>
            ) : (
                <Box sx={{ p: 4, textAlign: "center", width: "100%" }}>
                    <Typography variant="h6" color="text.secondary">
                        Nothing found
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default LandlordReservationsTable;