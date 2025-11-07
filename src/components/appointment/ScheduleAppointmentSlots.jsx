import {useEffect, useState} from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import {formatTime} from "@/utils/formatTime.js";
import {handleError} from "@/utils/handleError.js";
import style from '@/styles/appointment.module.css';


export default function ScheduleAppointmentSlots({selectedSlot, setSelectedSlot, selectedDate, selectedProviders, allProviders, setErrorMessage}) {
    const [availableSlots, setAvailableSlots] = useState([]);
    const authToken = secureLocalStorage.getItem("auth-token");

    const dateString = selectedDate.toISOString().split('T')[0];
    const providersToFetch = selectedProviders.includes("all") ? allProviders.map(provider => provider.id) : selectedProviders.map(textId => parseInt(textId));

    useEffect(() => {
        axios.get("/available-appointment-slots", {
            params: {token: authToken, date: dateString, doctorIds: providersToFetch},
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                setAvailableSlots(response.data);
                setErrorMessage("");
            }
        }).catch((err) => {
            handleError(err, setErrorMessage)
        });
        // eslint-disable-next-line
    }, []);

    function handleSlotClick(doctorId, slot) {
        setSelectedSlot({doctorId, ...slot})
    }

    return (
        <div className={style.appointment_slots_page}>
            <h2>{selectedDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric"
            })}</h2>
            {availableSlots.length > 0 ?
                availableSlots.map((item) => (
                    <div key={item.doctor.id}>
                        <h3>{item.doctor.firstName} {item.doctor.lastName}, {item.doctor.medicalDegree}</h3>
                        <div className={style.slots_container}>
                            {item.availableSlots.map((slot, index) => {
                                const isSelected =
                                    selectedSlot &&
                                    selectedSlot.doctorId === item.doctor.id &&
                                    selectedSlot.startTime === slot.startTime;

                                return (
                                    <button
                                        key={index}
                                        className={`${style.slot_button} ${isSelected ? style.selected_slot : ""}`}
                                        onClick={() => handleSlotClick(item.doctor.id, slot)}
                                    >
                                        {formatTime(slot.startTime)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )) : <p>No available slots for the selected date and providers.</p>}
        </div>
    );
}