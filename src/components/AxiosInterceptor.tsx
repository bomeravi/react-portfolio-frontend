import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiInstances } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export function AxiosInterceptor() {
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const interceptors: number[] = [];

        apiInstances.forEach((api) => {
            const interceptor = api.interceptors.response.use(
                (response) => response,
                (error) => {
                    const { response, code, message } = error;

                    // Handle Network Errors (Connection Refused, Offline)
                    if (code === 'ERR_NETWORK') {
                        addToast('Connection error. Please check your internet connection.', 'error');
                        return Promise.reject(error);
                    }

                    // Handle Timeout
                    if (code === 'ECONNABORTED' || message.includes('timeout')) {
                        addToast('Request timed out. Please try again later.', 'error');
                        return Promise.reject(error);
                    }

                    // Handle Response Errors
                    if (response) {
                        const status = response.status;

                        if (status === 500) {
                            addToast('Internal Server Error. Please try again later.', 'error');
                        } else if (status === 401) {
                            // Handle unauthorized access globally
                            addToast('Session expired. Please login again.', 'warning');
                            navigate('/login');
                        } else if (status === 403) {
                            addToast('You do not have permission to perform this action.', 'error');
                        }
                        else {
                            // Fallback for other errors
                            const errorMessage = response.data?.message || 'An unexpected error occurred.';
                            addToast(errorMessage, 'error');
                        }
                    }

                    return Promise.reject(error);
                }
            );
            interceptors.push(interceptor);
        });

        return () => {
            apiInstances.forEach((api, index) => {
                api.interceptors.response.eject(interceptors[index]);
            });
        };
    }, [addToast, navigate]);

    return null;
}
