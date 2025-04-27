import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import actions from "utils/actions";

export enum UserRole {
    SUPER_ADMIN = "super_admin",
    MANAGER = "manager",
}

interface UserData {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: UserRole;
    profilePictureUrl?: string | null;
}

interface AppState {
    isAuthenticated: boolean;
    userRole: UserRole | null;
    userData: UserData | null;
}

interface DispatchType {
    type: string;
    payload: any;
}

interface ApplicationContextType extends AppState {
    dispatch: Dispatch<DispatchType>;
}

export const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

const initialState: AppState = {
    isAuthenticated: false,
    userRole: null,
    userData: null,
};

const reducer = (state: AppState, action: any): AppState => {
    switch (action.type) {
        case actions.SET_IS_AUTHENTICATED:
            return { ...state, isAuthenticated: action.payload };
        case actions.SET_USER_ROLE:
            return { ...state, userRole: action.payload };
        case actions.SET_USER_DATA:
            return { ...state, userData: action.payload };
        case actions.SET_AUTH_STATE:
            return {
                isAuthenticated: action.payload.isAuthenticated,
                userRole: action.payload.userRole,
                userData: action.payload.userData,
            };
        default:
            return state;
    }
};

interface ApplicationContextProviderProps {
    children: ReactNode;
}

export const ApplicationContextProvider: React.FC<ApplicationContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <ApplicationContext.Provider value={{ ...state, dispatch }}>{children}</ApplicationContext.Provider>;
};
