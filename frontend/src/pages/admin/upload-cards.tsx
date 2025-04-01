"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Chip, TextField, Autocomplete } from "@mui/material";
import { X, Plus } from "lucide-react";

// Interface definitions
interface CardFormData {
    number: number;
    item: string;
    date: string;
    postmarked: string;
    place: string | null;
    company: string;
    companyInformation: string;
    description: string;
    analysis: string;
    message: string | null;
    isBlurByDefault: boolean;
    isInScrapbook: boolean;
    themes: ThemeOption[];
}

interface ThemeOption {
    id: string;
    name: string;
    isNew?: boolean;
}

interface ImageFile {
    file: File;
    preview: string;
    id: string;
}

// Predefined theme options
const DEFAULT_THEMES = [
    { id: "theme1", name: "Domestic Service" },
    { id: "theme2", name: "Immigration" },
    { id: "theme3", name: "Stereotypes" },
    { id: "theme4", name: "Labor" },
    { id: "theme5", name: "Class" },
    { id: "theme6", name: "Gender" },
    { id: "theme7", name: "Race" },
    { id: "theme8", name: "Religion" },
    { id: "theme9", name: "Politics" },
    { id: "theme10", name: "Education" },
];

// Default form values
const DEFAULT_FORM_VALUES = {
    number: undefined,
    item: "postcard",
    date: "",
    postmarked: "",
    place: null,
    company: "",
    companyInformation: "",
    description: "",
    analysis: "",
    message: null,
    isBlurByDefault: false,
    isInScrapbook: false,
    themes: [],
};

export function UploadCards() {
    // State management
    const [frontImage, setFrontImage] = useState<ImageFile | null>(null);
    const [backImage, setBackImage] = useState<ImageFile | null>(null);
    const [additionalImages, setAdditionalImages] = useState<ImageFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [availableThemes, setAvailableThemes] = useState<ThemeOption[]>(DEFAULT_THEMES);

    // Refs for file inputs
    const frontImageRef = useRef<HTMLInputElement>(null);
    const backImageRef = useRef<HTMLInputElement>(null);
    const additionalImagesRef = useRef<HTMLInputElement>(null);

    // Form setup
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CardFormData>({
        defaultValues: DEFAULT_FORM_VALUES,
    });

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (frontImage) URL.revokeObjectURL(frontImage.preview);
            if (backImage) URL.revokeObjectURL(backImage.preview);
            additionalImages.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, [frontImage, backImage, additionalImages]);

    // Image handlers
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<ImageFile | null>>,
        currentImage: ImageFile | null,
        prefix: string,
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (currentImage) URL.revokeObjectURL(currentImage.preview);
            setter({
                file,
                preview: URL.createObjectURL(file),
                id: `${prefix}-${Date.now()}`,
            });
        }
    };

    const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageChange(e, setFrontImage, frontImage, "front");
    };

    const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageChange(e, setBackImage, backImage, "back");
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                id: `additional-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            }));

            setAdditionalImages((prev) => [...prev, ...newImages]);
        }
    };

    const removeImage = (
        id: string,
        setter: React.Dispatch<React.SetStateAction<ImageFile | null>>,
        ref: React.RefObject<HTMLInputElement>,
    ) => {
        setter(null);
        if (ref.current) {
            ref.current.value = "";
        }
    };

    const removeFrontImage = () => {
        if (frontImage) URL.revokeObjectURL(frontImage.preview);
        removeImage("front", setFrontImage, frontImageRef);
    };

    const removeBackImage = () => {
        if (backImage) URL.revokeObjectURL(backImage.preview);
        removeImage("back", setBackImage, backImageRef);
    };

    const removeAdditionalImage = (id: string) => {
        setAdditionalImages((prev) => {
            const imageToRemove = prev.find((img) => img.id === id);
            if (imageToRemove) URL.revokeObjectURL(imageToRemove.preview);
            return prev.filter((img) => img.id !== id);
        });
    };

    // Form submission
    const onSubmit = async (data: CardFormData) => {
        if (!frontImage) {
            setSubmitError("You must upload the front side of the card");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Create a FormData object to send the images and form data
            const formData = new FormData();

            // Append images
            formData.append("frontImage", frontImage.file);
            if (backImage) formData.append("backImage", backImage.file);
            additionalImages.forEach((img, index) => {
                formData.append(`additionalImage-${index}`, img.file);
            });

            // Process themes to handle new ones
            const processedThemes = data.themes.map((theme) => {
                if (theme.isNew) {
                    return {
                        id: `new-theme-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        name: theme.name,
                    };
                }
                return theme;
            });

            // Update available themes with any new ones
            const newThemes = processedThemes.filter((theme) => theme.isNew);
            if (newThemes.length > 0) {
                setAvailableThemes((prev) => [
                    ...prev,
                    ...newThemes.map((theme) => ({ id: theme.id, name: theme.name })),
                ]);
            }

            // Prepare data for sending
            const formDataToSend = {
                ...data,
                themes: processedThemes.map((theme) => theme.id),
            };

            formData.append("cardData", JSON.stringify(formDataToSend));

            // In a real application, submit to your server
            // await fetch('/api/upload-card', { method: 'POST', body: formData });

            // Simulate successful upload
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Reset form state
            setSubmitSuccess(true);
            resetForm();

            // Reset success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            console.error("Error uploading card:", error);
            setSubmitError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form completely
    const resetForm = () => {
        reset();
        if (frontImage) URL.revokeObjectURL(frontImage.preview);
        if (backImage) URL.revokeObjectURL(backImage.preview);
        additionalImages.forEach((img) => URL.revokeObjectURL(img.preview));
        setFrontImage(null);
        setBackImage(null);
        setAdditionalImages([]);
    };

    // Render image upload section
    const renderImageUpload = (
        title: string,
        image: ImageFile | null,
        onClick: () => void,
        removeHandler: () => void,
    ) => (
        <div className="border border-gray-300 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>

            {image ? (
                <div className="relative">
                    <img
                        src={image.preview}
                        alt={`${title.toLowerCase()} of card`}
                        className="w-full h-48 object-contain mb-2"
                    />
                    <button
                        type="button"
                        onClick={removeHandler}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <X size={16} />
                    </button>
                    <p className="text-xs text-gray-500 truncate">{image.file.name}</p>
                </div>
            ) : (
                <div
                    onClick={onClick}
                    className="border-2 border-dashed border-gray-300 rounded-md h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <Plus className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload {title.toLowerCase()} image</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Upload New Card</h1>

            {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    Card uploaded successfully!
                </div>
            )}

            {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    Error: {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Card Details */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number*</label>
                            <input
                                type="number"
                                {...register("number", { required: "Card number is required" })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Type*</label>
                            <select
                                {...register("item", { required: "Item type is required" })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="postcard">Postcard</option>
                                <option value="tradecard">Trade Card</option>
                                <option value="photograph">Photograph</option>
                                <option value="advertisement">Advertisement</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="text"
                                {...register("date")}
                                placeholder="e.g., 1920s or 'illegible'"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postmarked</label>
                            <input
                                type="text"
                                {...register("postmarked")}
                                placeholder="e.g., Yes; Date: 26 May, 1911, 6PM"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                            <input
                                type="text"
                                {...register("place")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <input
                                type="text"
                                {...register("company")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Information</label>
                            <textarea
                                {...register("companyInformation")}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Themes</label>
                            <Controller
                                name="themes"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        multiple
                                        id="themes-select"
                                        options={availableThemes}
                                        value={field.value}
                                        getOptionLabel={(option: any) => option.name}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        filterSelectedOptions
                                        freeSolo
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => {
                                                const { key, ...tagProps } = getTagProps({ index });
                                                return (
                                                    <Chip
                                                        key={key || option.id || `theme-${index}`}
                                                        label={option.name}
                                                        {...tagProps}
                                                        color={option.isNew ? "primary" : "default"}
                                                    />
                                                );
                                            })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Select or add themes..."
                                                size="small"
                                            />
                                        )}
                                        onChange={(_, newValue) => {
                                            const processedValues = newValue.map((item) => {
                                                if (typeof item === "string") {
                                                    return { id: `temp-${Date.now()}`, name: item, isNew: true };
                                                } else if (item.isNew) {
                                                    return item;
                                                }
                                                return item;
                                            });
                                            field.onChange(processedValues);
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Right Column - Images and Additional Info */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-3">Required Card Images*</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Front Image Upload */}
                                {renderImageUpload(
                                    "Front Side*",
                                    frontImage,
                                    () => frontImageRef.current?.click(),
                                    removeFrontImage,
                                )}

                                {/* Back Image Upload */}
                                {renderImageUpload(
                                    "Back Side",
                                    backImage,
                                    () => backImageRef.current?.click(),
                                    removeBackImage,
                                )}
                            </div>

                            <input
                                type="file"
                                ref={frontImageRef}
                                onChange={handleFrontImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <input
                                type="file"
                                ref={backImageRef}
                                onChange={handleBackImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Additional Images Section */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-3">Additional Images (Optional)</h2>

                            <div className="border border-gray-300 rounded-md p-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                    {additionalImages.map((img) => (
                                        <div key={img.id} className="relative">
                                            <img
                                                src={img.preview}
                                                alt="Additional card image"
                                                className="w-full h-32 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAdditionalImage(img.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    onClick={() => additionalImagesRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-md h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                    <Plus className="w-6 h-6 text-gray-400" />
                                    <span className="mt-2 text-sm text-gray-500">Add more images</span>
                                </div>

                                <input
                                    type="file"
                                    ref={additionalImagesRef}
                                    onChange={handleAdditionalImagesChange}
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                />

                                <p className="mt-2 text-xs text-gray-500">
                                    You can upload multiple additional images related to this card.
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isBlurByDefault"
                                    {...register("isBlurByDefault")}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isBlurByDefault" className="ml-2 block text-sm text-gray-900">
                                    Blur by Default
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isInScrapbook"
                                    {...register("isInScrapbook")}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isInScrapbook" className="ml-2 block text-sm text-gray-900">
                                    Include in Scrapbook
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Width Fields */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Analysis</label>
                        <textarea
                            {...register("analysis")}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message (if any)</label>
                        <textarea
                            {...register("message")}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}>
                        {isSubmitting ? "Uploading..." : "Upload Card"}
                    </button>
                </div>
            </form>
        </div>
    );
}
