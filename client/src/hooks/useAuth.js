import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // This line was missing

export const useAuth = () => {
    return useContext(AuthContext);
};
