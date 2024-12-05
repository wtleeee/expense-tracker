import { toast } from 'react-toastify';
import './styles/Toastify.css';

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right'
    })
}

export const handleError = (msg) => {
    toast.error(msg, {
        position: 'top-right'
    })
}

export const APIUrl = import.meta.env.VITE_REACT_APP_API_URL;