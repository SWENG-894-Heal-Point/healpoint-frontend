import {addDays} from "date-fns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import Box from "@mui/material/Box";
import style from "@/styles/appointment.module.css";

export default function ScheduleAppointmentCalendar({
                                                        availableDates,
                                                        selectedProviders,
                                                        selectedDate,
                                                        setSelectedDate
                                                    }) {
    const today = new Date();
    const maxDate = addDays(today, 90);

    const filteredDates = [
        ...new Set(availableDates
            .filter(item =>
                selectedProviders.includes("all") || selectedProviders.includes(item.doctor.id.toString())
            ).flatMap(item => item.availableDates)
        )];

    function shouldDisableDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return !filteredDates.includes(dateString);
    }

    return (
        <div className={style.right_panel}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                    sx={{
                        backgroundColor: "white",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        justifyContent: "center",
                        padding: 0,
                    }}
                >
                    <DateCalendar
                        value={selectedDate}
                        onChange={(newValue) => {
                            setSelectedDate(newValue);
                        }}
                        minDate={today}
                        maxDate={maxDate}
                        shouldDisableDate={shouldDisableDate}
                    />
                </Box>
            </LocalizationProvider>
        </div>
    );
}