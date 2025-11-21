export function advancedSearch(dataArray, query) {
    if (!query || !dataArray?.length) return dataArray;

    const terms = query.toLowerCase().trim().split(/\s+/);

    return dataArray.filter(item => {
        const gender = item.gender?.toLowerCase() || '';

        const combinedFields = [
            item.firstName,
            item.lastName,
            item.dateOfBirth,
            item.phone,
            item.email,
            item.specialty,
            item.role
        ].filter(Boolean).join(' ').toLowerCase();

        return terms.every(term => {
            if (gender) {
                const genderWords = gender.split(/\s+/);
                if (genderWords.some(word => word === term)) return true;
            }

            return combinedFields.includes(term);
        });
    });
}