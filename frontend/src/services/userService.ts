import instance from "../utils/axiosConfig";
import { User } from "../pages/admin/users-management";

export interface UserApiResponse {
    success: boolean;
    data?: User[] | User;
    message?: string;
}

export const userService = {
    // Fetch all users
    getAllUsers: async (): Promise<UserApiResponse> => {
        try {
            const response = await instance.get("/users");
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch users",
            };
        }
    },

    // Get a single user by ID
    getUserById: async (userId: string): Promise<UserApiResponse> => {
        try {
            const response = await instance.get(`/users/${userId}`);
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch user",
            };
        }
    },

    // Create a new user
    createUser: async (userData: Omit<User, "_id" | "id" | "createdAt">): Promise<UserApiResponse> => {
        try {
            const response = await instance.post("/users", userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to create user",
            };
        }
    },

    // Update an existing user
    updateUser: async (userId: string, userData: Partial<User>): Promise<UserApiResponse> => {
        try {
            console.log("Making API call to update user with ID:", userId);
            const response = await instance.put(`/users/${userId}`, userData);
            return { success: true, data: response.data };
        } catch (error: any) {
            console.error("Error updating user:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update user",
            };
        }
    },

    // Delete a user
    deleteUser: async (userId: string): Promise<UserApiResponse> => {
        try {
            await instance.delete(`/users/${userId}`);
            return { success: true, message: "User deleted successfully" };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to delete user",
            };
        }
    },

    // Change user role
    changeUserRole: async (userId: string, role: string): Promise<UserApiResponse> => {
        try {
            const response = await instance.put(`/users/${userId}/role`, { role });
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to change user role",
            };
        }
    },
};
