import style from '@/styles/profile.module.css';


export default function PatientProfileView({profileData}) {
    const na = "Not Available";
    return (
        <>
            <div className={style.user_name}>
                <h2>{profileData.firstName} {profileData.lastName}</h2>
            </div>

            <div className={style.row}>
                <div className={style.card}>
                    <h3>Biographical Information</h3>
                    <p>Date of Birth: {profileData.dateOfBirth}</p>
                    <p>Gender: {profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : ""}</p>
                </div>

                <div className={style.card}>
                    <h3>Contact</h3>
                    <p>Phone: {profileData.phone}</p>
                    <p>Email: {profileData.email}</p>
                </div>
            </div>
            <div className={style.row}>
                <div className={style.card}>
                    <h3>Insurance</h3>
                    <p>Provider: {profileData.insuranceProvider !== "null" ? profileData.insuranceProvider : na}</p>
                    <p>Member ID: {profileData.insuranceId !== "null" ? profileData.insuranceId : na}</p>
                </div>

                <div className={style.card}>
                    <h3>Address</h3>
                    <p>{profileData.streetAddress}</p>
                    <p>{profileData.city}, {profileData.state} {profileData.zipCode}</p>
                </div>
            </div>
        </>
    );
}