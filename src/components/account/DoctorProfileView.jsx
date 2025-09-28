import style from '@/styles/profile.module.css';


export default function DoctorProfileView({profileData}) {
    return (
        <>
            <div className={style.user_name}>
                <h2>{profileData.firstName} {profileData.lastName}, {profileData.medicalDegree}</h2>
                <p>{profileData.specialty}</p>
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

            <div className={`${style.card} ${style.full_width}`}>
                <h3>More About Dr. {profileData.lastName}</h3>
                <p><span>Experience: {profileData.yearsOfExperience} years</span>
                    <span>NPI number: {profileData.npiNumber}</span></p>
                <p>Languages spoken: {profileData.languages}</p>
            </div>
        </>
    );
}