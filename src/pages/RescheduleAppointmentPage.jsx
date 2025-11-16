import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import ScheduleAppointmentCalendar from "@/components/appointment/ScheduleAppointmentCalendar.jsx";
import ScheduleAppointmentSlots from "@/components/appointment/ScheduleAppointmentSlots.jsx";
import Layout from "@/components/common/Layout.jsx";
import Error from "@/components/common/Error.jsx";
import {useAvailableAppointmentDates} from "@/utils/useAvailableAppointmentDates.js";
import {handleError} from "@/utils/handleError.js";
import {formatDate} from "@/utils/formatDate.js";
import style from "@/styles/appointment.module.css";

export default function RescheduleAppointmentPage() {
    const {state} = useLocation();
    const appointment = state ? state.appointment : null;
    const appointmentId = appointment ? appointment.id : null;
    const selectedProviders = appointment ? [appointment.doctor.id.toString()] : [];

    const [selectedDate, setSelectedDate] = useState(appointment ? formatDate(appointment.appointmentDate) : null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isContinue, setIsContinue] = useState(false);

    const navigate = useNavigate();
    const authToken = secureLocalStorage.getItem("auth-token");

    const { availableDates, error } = useAvailableAppointmentDates(authToken);
    const [errorMessage, setErrorMessage] = useState(error);

    const isValidAppointment = appointmentId && selectedProviders && selectedDate;
    if (!isValidAppointment) {
        setErrorMessage("It looks like you haven’t selected an appointment yet. Choose one to reschedule.");
    }

    function handleContinue() {
        if (selectedDate) {
            setIsContinue(true)
            setErrorMessage("")
        } else {
            setErrorMessage("Please select a date to continue.");
        }
    }

    function handleBack() {
        setIsContinue(false);
    }

    function handleSubmit() {
        if (!selectedSlot) {
            setErrorMessage("Please select a time slot to continue.");
        } else {
            const payload = {
                token: authToken,
                appointmentId: appointmentId,
                appointmentDate: selectedDate.toISOString().split('T')[0],
                appointmentTime: selectedSlot.startTime,
            };

            axios.post("/update-appointment", payload, {
                headers: {"Content-Type": "application/json"}
            }).then((response) => {
                if (response.status === 200) {
                    setErrorMessage("");
                    alert("Appointment rescheduled successfully!");
                    navigate("/appointments");
                }
            }).catch((err) => {
                handleError(err, setErrorMessage)
            })
        }
    }

    return (
        <Layout>
            <Error message={errorMessage}/>
            {
                isValidAppointment && (
                    !isContinue ?
                        <>
                            <div className={style.schedule_appointment_container}>
                                <ScheduleAppointmentCalendar availableDates={availableDates}
                                                             selectedProviders={selectedProviders}
                                                             selectedDate={selectedDate}
                                                             setSelectedDate={setSelectedDate}/>
                            </div>
                            <div className={`${style.single_btn_section} ${style.bottom_btn_section}`}>
                                <button className="default_btn" onClick={handleContinue}>Next</button>
                            </div>
                        </> :
                        <>
                            <ScheduleAppointmentSlots selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot}
                                                      selectedDate={selectedDate} selectedProviders={selectedProviders}
                                                      allProviders={selectedProviders}
                                                      setErrorMessage={setErrorMessage}/>
                            <div className="default_btn_group">
                                <button className="default_btn" onClick={handleBack}>Back</button>
                                <button className="default_btn" onClick={handleSubmit}>Submit</button>
                            </div>
                        </>
                )}
        </Layout>
    );
}