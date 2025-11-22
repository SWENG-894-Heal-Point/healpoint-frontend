import {useEffect, useState} from "react";
import {Box, Modal} from "@mui/material";
import {Form, Formik} from "formik";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

import FormikDropdown from "@/components/common/FormikDropdown.jsx";
import {handleError} from "@/utils/handleError.js";
import accountStyle from "@/styles/account.module.css";
import style from "@/styles/admin-portal.module.css";
import validDays from "@/data/validDays.json";

export default function ScheduleModal({openModal, setOpenModal, doctorId}) {
    const [schedule, setSchedule] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const timeOptions = generateTimeOptions(7, 19);
    const authToken = secureLocalStorage.getItem("auth-token");

    function mapScheduleByDay(schedules) {
        const result = {};

        validDays.forEach(day => {
            const entry = schedules.find(s => s.dayName.toUpperCase() === day.value);

            result[day.value] = {
                start: entry ? formatTime(entry.startTime) : '',
                end: entry ? formatTime(entry.endTime) : ''
            };
        });

        return result;
    }

    useEffect(() => {
        axios.get("/get-doctor-schedule", {
            params: {token: authToken, doctorId: doctorId},
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                setSchedule(mapScheduleByDay(response.data));
                setLoading(false);
            }
        }).catch((err) => {
            handleError(err, setErrorMessage)
            setSchedule(null);
        });
        // eslint-disable-next-line
    }, []);

    function handleClose() {
        setErrorMessage("");
        setOpenModal(false);
    }

    function handleSubmit(values) {
        console.log(values);
        const payload = {token: authToken, doctorId: doctorId, workDays: []};
        validDays.forEach(day => {
            payload.workDays.push({
                dayName: day.value,
                startTime: values[`start${day.value}`],
                endTime: values[`end${day.value}`]
            });
        });

        axios.post("/insert-or-update-schedule", payload, {
            headers: {"Content-Type": "application/json"}
        }).then((response) => {
            if (response.status === 200) {
                alert("Schedule updated successfully.");
                setErrorMessage('');
                handleClose();
            }
        }).catch((err) => {
            handleError(err, setErrorMessage);
        });
    }

    if (loading) {
        return null;
    }

    return (
        <Modal open={openModal} onClose={handleClose}>
            <Box
                sx={{
                    p: 4,
                    borderRadius: 2,
                    position: "absolute",
                    width: "300px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24
                }}
            >
                <div>
                    <div className={style.modal_prompt}>
                        Manage schedule for doctor ID: {doctorId}
                    </div>
                    <Formik initialValues={{
                        startMON: schedule ? schedule["MON"]?.start : '',
                        endMON: schedule ? schedule["MON"]?.end : '',
                        startTUE: schedule ? schedule["TUE"]?.start : '',
                        endTUE: schedule ? schedule["TUE"]?.end : '',
                        startWED: schedule ? schedule["WED"]?.start : '',
                        endWED: schedule ? schedule["WED"]?.end : '',
                        startTHU: schedule ? schedule["THU"]?.start : '',
                        endTHU: schedule ? schedule["THU"]?.end : '',
                        startFRI: schedule ? schedule["FRI"]?.start : '',
                        endFRI: schedule ? schedule["FRI"]?.end : '',
                        startSAT: schedule ? schedule["SAT"]?.start : '',
                        endSAT: schedule ? schedule["SAT"]?.end : '',
                        startSUN: schedule ? schedule["SUN"]?.start : '',
                        endSUN: schedule ? schedule["SUN"]?.end : '',
                    }} onSubmit={(values, {setSubmitting}) => {
                        setTimeout(() => {
                            setSubmitting(false);
                        }, 500);
                        handleSubmit(values);
                    }}>
                        <Form className={style.schedule_table}>
                            <div className={style.schedule_row}>
                                <div>Day</div>
                                <div>Shift Start</div>
                                <div>Shift End</div>
                            </div>
                            {
                                validDays.map((day) => {
                                    return (
                                        <div className={style.schedule_row} key={day.value}>
                                            <label className={style.schedule_cell}>{day.label}</label>
                                            <FormikDropdown id={`start${day.value}`} label="" options={timeOptions}/>
                                            <FormikDropdown id={`end${day.value}`} label="" options={timeOptions}/>
                                        </div>
                                    );
                                })
                            }
                            <div className={accountStyle.error}>
                                {errorMessage && <p>{errorMessage}</p>}
                            </div>
                            <div className={style.button_group}>
                                <button className="default_btn" type="button" onClick={handleClose}>
                                    Cancel
                                </button>
                                <button className="default_btn" type="submit">
                                    Submit
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </Box>
        </Modal>
    );
}

function generateTimeOptions(start, end) {
    const times = [];
    times.push({value: "", label: "Off"});

    for (let i = start * 60; i <= end * 60; i += 30) {
        const h = String(Math.floor(i / 60)).padStart(2, "0");
        const m = String(i % 60).padStart(2, "0");
        const time = `${h}:${m}`;
        times.push({value: time, label: time});
    }

    return times;
}

function formatTime(time) {
    const [hour, minute, _second] = time.split(":").map(Number);
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}