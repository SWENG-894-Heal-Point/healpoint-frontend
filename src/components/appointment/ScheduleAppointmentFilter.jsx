import style from '@/styles/appointment.module.css';

export default function ScheduleAppointmentFilter({
                                                      selectedReason,
                                                      setSelectedReason,
                                                      allProviders,
                                                      selectedProviders,
                                                      setSelectedProviders
                                                  }) {
    const reasons = [
        {label: "Follow-up visit", value: "follow-up"},
        {label: "Discuss a new problem", value: "new-problem"},
        {label: "Annual physical exam", value: "annual-exam"},
    ];

    function onProviderChange(e) {
        const id = e.target.value;

        if (selectedProviders.includes("all")) {
            setSelectedProviders([id]);
        } else if (!selectedProviders.includes(id)) {
            setSelectedProviders([...selectedProviders, id]);
        } else {
            const updatedProviders = selectedProviders.filter(providerId => providerId !== id);
            setSelectedProviders(updatedProviders);
        }
    }

    return (
        <div className={style.left_panel}>
            <div className={style.section}>
                <h3>Reason for visit</h3>
                {reasons.map((reason) => (
                    <label key={reason.value}>
                        <input type="radio" name="reason" value={reason.value} checked={selectedReason === reason.value}
                               onChange={() => setSelectedReason(reason.value)}/>
                        {reason.label}
                    </label>
                ))}
            </div>
            <div className={`${style.section} ${style.provider_section}`}>
                <h3>Providers</h3>
                <label>
                    <input type="checkbox" name="provider" value="all" checked={selectedProviders.includes("all")}
                           onChange={() => setSelectedProviders(["all"])}/>
                    All
                </label>
                {allProviders.map((provider) => (
                    <label key={provider.id}>
                        <input type="checkbox" name="provider" value={provider.id}
                               checked={selectedProviders.includes("all") || selectedProviders.includes(provider.id.toString())}
                               onChange={onProviderChange}/>
                        {provider.firstName} {provider.lastName}, {provider.medicalDegree}
                    </label>
                ))}
            </div>
        </div>
    );
}