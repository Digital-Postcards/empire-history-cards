import { useContext, useEffect } from "react";
import { ApplicationContext } from "contexts/ApplicationContext";
import actions from "utils/actions";
import { AxiosResponse } from "axios";
import instance from "utils/axiosConfig";

export default function useIsAuthenticated(): void {
    const applicationCtx = useContext(ApplicationContext);

    if (!applicationCtx) {
        throw new Error("useIsAuthenticated must be used within an ApplicationContextProvider");
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response: AxiosResponse = await instance("/authentication/is_authenticated", {
                    method: "GET",
                });

                applicationCtx.dispatch({
                    type: actions.SET_IS_AUTHENTICATED,
                    payload: response?.data?.isAuthenticated,
                });
            } catch (error: any) {
                applicationCtx.dispatch({
                    type: actions.SET_IS_AUTHENTICATED,
                    payload: error.status === 200,
                });
            }
        };

        checkAuth();
    }, []);

    return;
}
