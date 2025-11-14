import style from '@/styles/appointment.module.css';

export default function IconLine({icon, text}) {
    return (
        <div className={style.icon_line}>{icon} {text}</div>
    );
}