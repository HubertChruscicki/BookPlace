import {Box, Button, Typography} from "@mui/material";
import { colors } from "../../theme/colors.ts";
import Divider from "@mui/material/Divider";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {LandlordReservationsModel, ReservationInfoModel} from "../../models/ReservationModel.ts";
import LandlordReservationsTable from "./LandlordReservationsTable.tsx";
import {QueryFunctionContext, useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import api from "../../api/axiosApi.ts";
import {PaginatedResponse} from "../../models/ResponseModel.ts";

interface LandlordReservationsContentProps {
    activeTab: string;
}

const LandlordReservationsContent: React.FC<LandlordReservationsContentProps> = ({activeTab}) => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const rowsPerPage = 8;

    const tabs = [
        { name: "upcoming", link: "/landlord/reservations/upcoming" },
        { name: "archive", link: "/landlord/reservations/archive" },
        { name: "canceled", link: "/landlord/reservations/canceled" },
        { name: "all", link: "/landlord/reservations/all" },
    ];

    const getStatusParam = (tabStatus: string) => {
        switch (tabStatus) {
            case 'upcoming': return 'confirmed';
            case 'archive':  return 'archive';
            case 'canceled': return 'cancelled';
            case 'all':      return ['confirmed', 'archive', 'cancelled'];
            default:         return 'confirmed';
        }
    };

    const fetchReservations = async ({queryKey,}: QueryFunctionContext<[string, string, number]>):
        Promise<PaginatedResponse<LandlordReservationsModel>> => {
        const [_, status, currentPage] = queryKey;
        const statusParam = getStatusParam(status);
        const response = await api.get('/reservations/landlord/', {
            params: {
                status: statusParam,
                offset: (currentPage-1) * rowsPerPage,
                limit: rowsPerPage
            }
        });
        return response.data;
    };
    const {data, isLoading,}: UseQueryResult<PaginatedResponse<ReservationInfoModel>, Error> =
        useQuery<
            PaginatedResponse<ReservationInfoModel>,
            Error,
            PaginatedResponse<ReservationInfoModel>,
            [string, string, number]
        >({
            queryKey: ["reservations", activeTab, page],
            queryFn: fetchReservations,
            staleTime: 60 * 1000,
            placeholderData: (oldData) => oldData,
    });

    useEffect(() => {
        if (data?.next) {
            queryClient.prefetchQuery({
                queryKey: ['reservations', activeTab, page + 1],
                queryFn: fetchReservations,
                staleTime: 60 * 1000,
            });
        }
    }, [data?.next, page, queryClient, activeTab]);

    useEffect(() => {
        tabs.forEach(tab => {
            if (tab.name !== activeTab) {
                queryClient.prefetchQuery({
                    queryKey: ['reservations', tab.name, 1],
                    queryFn: fetchReservations,
                    staleTime: 60 * 1000,
                });
            }
        });
    }, [activeTab, queryClient]);

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const reservations: ReservationInfoModel[] = data?.results || [];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: `${colors.white[800]}`,
                width: "90%",
                height: "100%",
                marginTop: "30px",
            }}
        >
            <Typography sx={{ fontWeight: "bold", fontSize: "2.5rem", mb: 3, ml: 1 }}>
                Your reservations
            </Typography>

            <Box>

            </Box>

            <Box sx={{ display: { xs: 'none', lg: "flex" }, alignItems: 'center', gap: '2rem' }}>
                {tabs.map((tab) => (
                    <Button
                        key={tab.name}
                        component={Link}
                        to={tab.link}
                        sx={{
                            height: '100%',
                            textTransform: 'capitalize',
                            letterSpacing: '0.06rem',
                            fontWeight: 400,
                            fontSize: "1rem",
                            position: 'relative',
                            color: activeTab === tab.name ? colors.blue[600] : colors.black[900],
                            "&:hover": {
                                backgroundColor: 'transparent',
                                color: colors.blue[600],
                            },
                            "&::after": {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: activeTab === tab.name ? '100%' : '0',
                                height: '2px',
                                backgroundColor: colors.blue[600],
                                transition: 'width 0.3s ease',
                                borderRadius: '10px',
                            }
                        }}
                    >
                        {tab.name}
                    </Button>
                ))}
            </Box>
            <Divider
                sx={{
                    ml: "-40px",
                    mr: "-40px",
                }}
            />
            <LandlordReservationsTable
                reservations={reservations}
                isLoading={isLoading}
                page={page}
                rowsPerPage={rowsPerPage}
                count={data?.count || 0}
                onPageChange={handlePageChange}
            />
        </Box>
    );
};

export default LandlordReservationsContent;