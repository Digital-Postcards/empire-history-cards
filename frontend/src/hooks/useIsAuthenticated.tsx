import { useContext, useEffect, useState } from "react";
import { ApplicationContext, UserRole } from "contexts/ApplicationContext";
import actions from "utils/actions";
import { AxiosResponse } from "axios";
import instance from "utils/axiosConfig";

export default function useIsAuthenticated(): { isLoading: boolean } {
    const applicationCtx = useContext(ApplicationContext);
    const [isLoading, setIsLoading] = useState(true);

    if (!applicationCtx) {
        throw new Error("useIsAuthenticated must be used within an ApplicationContextProvider");
    }

    useEffect(() => {
        const checkAuth = async (retryCount = 0) => {
            try {
                const response: AxiosResponse = await instance("/authentication/is_authenticated", {
                    method: "GET",
                    withCredentials: true, // Ensure cookies are sent with the request
                });

                if (response?.data?.isAuthenticated) {
                    // Set authentication status
                    applicationCtx.dispatch({
                        type: actions.SET_IS_AUTHENTICATED,
                        payload: true,
                    });

                    // Set user role if available
                    if (response?.data?.user?.role) {
                        applicationCtx.dispatch({
                            type: actions.SET_USER_ROLE,
                            payload: response.data.user.role,
                        });
                    }

                    // Set user data if available
                    if (response?.data?.user) {
                        applicationCtx.dispatch({
                            type: actions.SET_USER_DATA,
                            payload: {
                                id: response.data.user.id,
                                firstName: response.data.user.firstname,
                                lastName: response.data.user.lastname,
                                email: response.data.user.email,
                                role: response.data.user.role || UserRole.MANAGER,
                            },
                        });
                    }
                } else {
                    // Reset authentication state if not authenticated
                    applicationCtx.dispatch({
                        type: actions.SET_IS_AUTHENTICATED,
                        payload: false,
                    });
                    applicationCtx.dispatch({
                        type: actions.SET_USER_ROLE,
                        payload: null,
                    });
                    applicationCtx.dispatch({
                        type: actions.SET_USER_DATA,
                        payload: null,
                    });
                }
                setIsLoading(false);
            } catch (error: any) {
                console.error("Error checking authentication status:", error);

                // If this is not the final retry attempt, try again
                if (retryCount < 2) {
                    console.log(`Retrying authentication check (attempt ${retryCount + 1})...`);
                    setTimeout(() => checkAuth(retryCount + 1), 1000); // Wait 1 second before retrying
                    return;
                }

                // Reset authentication state on error after all retries failed
                applicationCtx.dispatch({
                    type: actions.SET_IS_AUTHENTICATED,
                    payload: false,
                });
                applicationCtx.dispatch({
                    type: actions.SET_USER_ROLE,
                    payload: null,
                });
                applicationCtx.dispatch({
                    type: actions.SET_USER_DATA,
                    payload: null,
                });
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [applicationCtx]);

    return { isLoading };
}
