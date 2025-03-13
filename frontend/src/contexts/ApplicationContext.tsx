import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import actions from "utils/actions";

interface AppState {
    isAuthenticated: boolean;
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
};

const reducer = (state: AppState, action: any): AppState => {
    switch (action.type) {
        case actions.SET_IS_AUTHENTICATED:
            return { ...state, isAuthenticated: action.payload };
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
