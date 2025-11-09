import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

import ScheduleAppointmentFilter from "@/components/appointment/ScheduleAppointmentFilter.jsx";
import ScheduleAppointmentCalendar from "@/components/appointment/ScheduleAppointmentCalendar.jsx";
import ScheduleAppointmentSlots from "@/components/appointment/ScheduleAppointmentSlots.jsx";
import Layout from "@/components/common/Layout.jsx";
import Error from "@/components/common/Error.jsx";
import {handleError} from "@/utils/handleError.js";
import style from '@/styles/appointment.module.css';
import {useAvailableAppointmentDates} from "@/utils/useAvailableAppointmentDates.js";


export default function ScheduleAppointmentPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedReason, setSelectedReason] = useState(null);
    const [selectedProviders, setSelectedProviders] = useState(["all"]);
    const [isContinue, setIsContinue] = useState(false);

    const navigate = useNavigate();
    const authToken = secureLocalStorage.getItem("auth-token");

    const { availableDates, error } = useAvailableAppointmentDates(authToken);
    const [errorMessage, setErrorMessage] = useState(error);
    const allProviders = availableDates.map(item => item.doctor);

    function handleContinue() {
        if (selectedReason === null) {
            setErrorMessage("Please select a reason for the appointment.");
            return;
        }
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
                appointmentDate: selectedDate.toISOString().split('T')[0],
                doctorId: selectedSlot.doctorId,
                appointmentTime: selectedSlot.startTime,
                reason: selectedReason
            };

            axios.post("/schedule-appointment", payload, {
                headers: {"Content-Type": "application/json"}
            }).then((response) => {
                if (response.status === 200) {
                    setErrorMessage("");
                    alert("Appointment scheduled successfully!");
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
            {!isContinue ?
                <>
                    <div className={style.schedule_appointment_container}>
                        <ScheduleAppointmentFilter selectedReason={selectedReason} setSelectedReason={setSelectedReason}
                                                   allProviders={allProviders} selectedProviders={selectedProviders}
                                                   setSelectedProviders={setSelectedProviders}/>
                        <ScheduleAppointmentCalendar availableDates={availableDates} selectedProviders={selectedProviders}
                                                     selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
                    </div>
                    <div className={`${style.single_btn_section} ${style.bottom_btn_section}`}>
                        <button className="default_btn" onClick={handleContinue}>Next</button>
                    </div>
                </> :
                <>
                    <ScheduleAppointmentSlots selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot}
                                              selectedDate={selectedDate} selectedProviders={selectedProviders}
                                              allProviders={allProviders} setErrorMessage={setErrorMessage}/>
                    <div className="default_btn_group">
                        <button className="default_btn" onClick={handleBack}>Back</button>
                        <button className="default_btn" onClick={handleSubmit}>Submit</button>
                    </div>
                </>
            }

        </Layout>
    );
};