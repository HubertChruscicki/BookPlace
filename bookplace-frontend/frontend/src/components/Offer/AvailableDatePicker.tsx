import dayjs, {Dayjs} from "dayjs";
import React, {useCallback, useEffect, useState} from "react";
import api from "../../api/axiosApi.ts";
import {DatePicker} from "@mui/x-date-pickers";

interface AvailableDatePickerProps {
    offerID: number;
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
    label: string;
    minDate?: Dayjs;
    onSetDateRangeError: (error: string | null) => void;
}

const AvailableDatePicker: React.FC<AvailableDatePickerProps> = ({offerID, value, onChange, label, minDate, onSetDateRangeError}) => {
    const [blocked, setBlocked] = useState<string[]>([])
    const handleGetUnavailableDates = useCallback(async (month: number, year: number) => {
        try {
            const res = await api.get<string[]>(
                `/reservations/${offerID}/unavailable-dates/`,
                { params: { month, year } }
            )
            setBlocked(res.data)
            onSetDateRangeError(null)
        } catch (err) {
            console.error(err)
            onSetDateRangeError('Could not load unavailable dates')
            setBlocked([])
        }
    }, [offerID])

    const handleMonthChange = useCallback((month: Dayjs) => {
        handleGetUnavailableDates(month.month() + 1, month.year())
    }, [handleGetUnavailableDates])

    useEffect(() => {
        const today = value ?? undefined
        if (today) {
            handleMonthChange(today)
        }
        if (minDate) {
            handleMonthChange(minDate);
        }
    }, [minDate, value, handleMonthChange])

    useEffect(() => {
        if (minDate) handleMonthChange(minDate);
    }, [minDate, handleMonthChange]);


    const handleOpen = () => {
        const ref = value ?? minDate ?? dayjs();
        handleMonthChange(ref);
    };


    return (
        <DatePicker
            sx={{flex: 1}}
            label={label}
            value={value}
            disablePast
            minDate={minDate}
            onChange={onChange}
            onOpen={handleOpen}
            onMonthChange={handleMonthChange}
            shouldDisableDate={date =>
                blocked.includes(date.format('YYYY-MM-DD'))
            }
            format="DD.MM.YYYY"
            onError={(reason) => {
                if (reason) {
                    onSetDateRangeError(`Date range error`);
                } else {
                    onSetDateRangeError(null)
                }
            }}
        />
    )
}

export default AvailableDatePicker