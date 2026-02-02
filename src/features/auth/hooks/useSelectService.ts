import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/AuthStore';

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
}

const servicesList: Service[] = [
    {
        id: 'hris',
        title: 'HRIS',
        description: 'Human Resource Information System',
        icon: '/images/logo/hris-logo.png',
        path: '/dashboard',
    },
    {
        id: 'iam',
        title: 'IAM',
        description: 'Integrated Accounting Management',
        icon: '/images/logo/hris-logo.png',
        path: '/iam',
    },
    {
        id: 'erp',
        title: 'ERP',
        description: 'Enterprise Resource Planning',
        icon: '/images/logo/hris-logo.png',
        path: '/erp',
    },
    {
        id: 'omb',
        title: 'OMB',
        description: 'Operasional Manajemen Bisnis',
        icon: '/images/logo/hris-logo.png',
        path: '/omb',
    },
    {
        id: 'bms',
        title: 'BMS',
        description: 'Busnies Manajemen System',
        icon: '/images/logo/hris-logo.png',
        path: '/bms',
    },
    {
        id: 'ccc',
        title: 'CCC',
        description: 'Customer Chat Care',
        icon: '/images/logo/hris-logo.png',
        path: '/ccc',
    },
];

export const useSelectService = () => {
    const { user, logout } = useAuthStore((state) => state);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleServiceClick = (path: string) => {
        navigate(path);
    };

    return {
        user,
        services: servicesList,
        handleLogout,
        handleServiceClick,
    };
};
