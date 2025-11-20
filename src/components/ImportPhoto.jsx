import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import AvatarEditor from "react-avatar-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ImportPhoto = forwardRef((props, ref) => {
    const [imageFile, setImageFile] = useState(null);
    const [zoom, setZoom] = useState(1.2);
    const editorRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getBase64: () => {
            if (!editorRef.current) return null;
            const canvas = editorRef.current.getImageScaledToCanvas();
            return canvas.toDataURL("image/png");
        }
    }));

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <Label htmlFor="imageProfil">Image de profil</Label>

            <Input
                id="imageProfil"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />

            {imageFile && (
                <div className="flex flex-col items-center space-y-2">
                    <AvatarEditor
                        ref={editorRef}
                        image={imageFile}
                        width={180}
                        height={180}
                        border={30}
                        borderRadius={100} // cadre circulaire
                        color={[255, 255, 255, 0.8]}
                        scale={zoom}
                        rotate={0}
                    />

                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.01"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-48"
                    />
                </div>
            )}
        </div>
    );
});

export default ImportPhoto;