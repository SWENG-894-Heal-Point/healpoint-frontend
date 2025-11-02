import Layout from "@/components/common/Layout.jsx";
import style from '@/styles/appointment.module.css';
import {useNavigate} from "react-router-dom";


export default function AppointmentListPage() {
    const navigate = useNavigate();

    return (
        <>
            <Layout>
                <div className={style.single_btn_section}>
                    <button className="default_btn" onClick={() => navigate("/schedule-appointment")}>
                        New Appointment
                    </button>
                </div>
            </Layout>
        </>
    );
};