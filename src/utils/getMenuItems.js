import menuOptions from '@/data/menuOptions.json';

export function getMenuItems(role) {
    switch (role.toLowerCase()) {
        case 'doctor':
            return menuOptions.doctorMenu;
        case 'patient':
            return menuOptions.patientMenu;
        default:
            return [];
    }
}