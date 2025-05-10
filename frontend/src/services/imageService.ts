import instance from "../utils/axiosConfig";

/**
 * Updates the orientation of an image
 * @param imageId ID of the image to update
 * @param orientation New orientation value
 * @returns Updated image data
 */
export const updateImageOrientation = async (imageId: string, orientation: number) => {
    try {
        // Remove the duplicate '/api' prefix since API_URL already includes it
        const response = await instance.patch(`/images/${imageId}/orientation`, { orientation });
        return response.data;
    } catch (error) {
        console.error("Error updating image orientation:", error);
        throw error;
    }
};

/**
 * Gets a single image by ID
 * @param imageId ID of the image to fetch
 * @returns Image data
 */
export const getImage = async (imageId: string) => {
    try {
        // Remove the duplicate '/api' prefix since API_URL already includes it
        const response = await instance.get(`/images/${imageId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching image:", error);
        throw error;
    }
};
