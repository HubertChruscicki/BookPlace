import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../api/axiosApi";
import { ReservationInfoModel } from "../../models/ReservationModel";

export type FilterType = "cancelled" | "archive";

interface UseReservationsOptions {
    enableFilter?: boolean;
    initialFilter?: FilterType;
    itemsPerPage?: number;
}

export function useReservations({enableFilter = false, initialFilter = "archive", itemsPerPage = 3,}: UseReservationsOptions) {
    const [filter, setFilter] = useState<FilterType>(initialFilter);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState<number | null>(null);

    const [pages, setPages] = useState<Record<string, ReservationInfoModel[]>>({});

    const cacheKey = useMemo(() => {
        return enableFilter ? `${filter}_${page}` : `${page}`;
    }, [filter, page, enableFilter]);

    const maxPages = useMemo(() => {
        return totalCount !== null
            ? Math.ceil(totalCount / itemsPerPage)
            : 0;
    }, [totalCount, itemsPerPage]);

    const fetchPage = useCallback(async (key: string, pageToFetch: number, showLoader = true) => {
        if (pages[key]) return;

        if (showLoader) setIsLoading(true);
        try {
            const params: any = {
                limit: itemsPerPage,
                offset: pageToFetch * itemsPerPage,
            };
            if (enableFilter) {
                params.status = filter;
            }
            const res = await api.get("/reservations/", { params });
            const { count, results } = res.data;
            setTotalCount(count);
            setPages(prev => ({
                ...prev,
                [key]: enableFilter
                    ? results
                    : results.filter((r: ReservationInfoModel) => r.status === "pending" || r.status === "confirmed"),
            }));
        } catch (err) {
            console.error("useReservations fetch error:", err);
        } finally {
            if (showLoader) setIsLoading(false);
        }
    }, [filter, pages, enableFilter, itemsPerPage]);

    useEffect(() => {
        setPage(0);
        setPages({});
        setTotalCount(null);
    }, [filter]);

    useEffect(() => {
        fetchPage(cacheKey, page, true);
        const nextPage = page + 1;
        const nextKey = enableFilter ? `${filter}_${nextPage}` : `${nextPage}`;
        if (nextPage < maxPages && !pages[nextKey]) {
            fetchPage(nextKey, nextPage, false);
        }
    }, [cacheKey, fetchPage, maxPages, pages]);

    return {
        filter,
        setFilter,
        page,
        setPage,
        isLoading,
        maxPages,
        reservations: pages[cacheKey] || [],
    };
}
