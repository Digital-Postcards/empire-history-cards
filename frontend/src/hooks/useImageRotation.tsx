import { useState } from "react";

interface UseImageRotationReturn {
    rotation: number;
    rotateClockwise: () => void;
    rotateCounterClockwise: () => void;
    resetRotation: () => void;
    setRotation: (angle: number) => void;
}

/**
 * A custom hook for managing image rotation
 * @param initialRotation - The initial rotation angle in degrees (0, 90, 180, 270)
 * @returns An object with rotation state and rotation control functions
 */
const useImageRotation = (initialRotation: number = 0): UseImageRotationReturn => {
    // Normalize rotation angle to be between 0 and 270 degrees in 90-degree increments
    const normalizeRotation = (angle: number): number => {
        const normalized = ((angle % 360) + 360) % 360;
        return Math.floor(normalized / 90) * 90;
    };

    const [rotation, setRotationState] = useState<number>(normalizeRotation(initialRotation));

    // Rotate image 90 degrees clockwise
    const rotateClockwise = () => {
        setRotationState((prev) => normalizeRotation(prev + 90));
    };

    // Rotate image 90 degrees counter-clockwise
    const rotateCounterClockwise = () => {
        setRotationState((prev) => normalizeRotation(prev - 90));
    };

    // Reset rotation to initial state (0 degrees)
    const resetRotation = () => {
        setRotationState(0);
    };

    // Set rotation to a specific angle
    const setRotation = (angle: number) => {
        setRotationState(normalizeRotation(angle));
    };

    return {
        rotation,
        rotateClockwise,
        rotateCounterClockwise,
        resetRotation,
        setRotation,
    };
};

export default useImageRotation;
