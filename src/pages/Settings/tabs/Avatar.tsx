import { useState, useCallback } from "preact/hooks";
import Cropper from "react-easy-crop";
import { useAuth } from "../../../hooks/useAuth";

// Helper function to create cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });

const getCroppedImg = async (imageSrc: string, pixelCrop: any, outputSize = 200) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return "";

    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputSize,
        outputSize
    );

    return canvas.toDataURL("image/jpeg", 0.9);
};

export default function Avatar() {
    const { user, updateAvatar, removeAvatar } = useAuth();
    const [avatarImage, setAvatarImage] = useState<any>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Check if user has a custom image avatar (not letter-based)
    // Note: Assuming user object has this property as in legacy code
    const hasCustomAvatar = user?.is_custom_avatar;

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileSelect = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select an image file");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setAvatarImage(reader.result);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveAvatar = async () => {
        if (!avatarImage || !croppedAreaPixels) return;

        setError("");
        setSuccess("");
        setAvatarLoading(true);

        try {
            const croppedImage = await getCroppedImg(avatarImage, croppedAreaPixels);
            const result = await updateAvatar(croppedImage);

            if (result.success) {
                setSuccess("Avatar updated successfully");
                setAvatarImage(null);
            } else {
                setError(result.error || "Failed to update avatar");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to process image");
        }

        setAvatarLoading(false);
    };

    const handleCancelAvatar = () => {
        setAvatarImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

    const handleRemoveAvatar = async () => {
        setError("");
        setSuccess("");
        setAvatarLoading(true);

        const result = await removeAvatar();

        if (result.success) {
            setSuccess("Avatar removed successfully");
        } else {
            setError(result.error || "Failed to remove avatar");
        }

        setAvatarLoading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-base-content">Profile Avatar</h3>
                <p className="text-sm text-base-content/60 mt-1">Upload and crop a custom profile picture.</p>
            </div>

            {/* Feedback messages */}
            {error && (
                <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {success}
                </div>
            )}

            <div className="flex flex-col items-center gap-6">
                {/* Current Avatar Preview */}
                <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-medium text-base-content/70">
                        Current Avatar
                    </span>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-base-300 shadow-lg">
                        {user?.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <div className="w-full h-full bg-base-200 flex items-center justify-center text-4xl font-bold opacity-30">
                                {user?.name?.charAt(0) || "?"}
                            </div>
                        )}
                    </div>
                    {/* Only show remove if they have a custom avatar AND we are not currently editing a new one */}
                    {hasCustomAvatar && !avatarImage && (
                        <button
                            type="button"
                            className={`btn btn-ghost btn-sm text-error hover:bg-error/10 ${avatarLoading ? "loading" : ""}`}
                            onClick={handleRemoveAvatar}
                            disabled={avatarLoading}
                        >
                            {!avatarLoading && (
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                            {avatarLoading ? "" : "Remove Avatar"}
                        </button>
                    )}
                </div>

                {!avatarImage ? (
                    /* File Upload Area */
                    <div className="w-full max-w-md">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-base-300 rounded-xl cursor-pointer bg-base-200/30 hover:bg-base-200/50 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10 mb-3 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mb-2 text-sm text-base-content/70">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-base-content/50">PNG, JPG or GIF (MAX. 2MB)</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                        </label>
                    </div>
                ) : (
                    /* Crop Area */
                    <div className="w-full max-w-md space-y-4">
                        <div className="relative w-full h-72 bg-base-200 rounded-xl overflow-hidden">
                            <Cropper
                                image={avatarImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        {/* Zoom Slider */}
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                            </svg>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e: any) => setZoom(Number(e.target.value))}
                                className="range range-primary range-sm flex-1"
                            />
                            <svg className="w-5 h-5 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={handleCancelAvatar}
                                disabled={avatarLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`btn btn-primary px-8 ${avatarLoading ? "loading" : ""}`}
                                onClick={handleSaveAvatar}
                                disabled={avatarLoading || !croppedAreaPixels}
                            >
                                {avatarLoading ? "" : "Save Avatar"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
