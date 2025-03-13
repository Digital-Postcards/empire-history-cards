import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useState } from "react";
import instance from "utils/axiosConfig";

const useApi = (url: string, options?: AxiosRequestConfig) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState<number | null>(null);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response: AxiosResponse = await instance(url, options);
            setStatus(response.status);
            setData(response.data);
            return response.data;
        } catch (error: any) {
            setStatus(error.status);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { data, status, isLoading, error, fetchData };
};

export default useApi;
