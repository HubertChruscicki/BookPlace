import {Box, Button, Typography} from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {colors} from "../../../theme/colors.ts"


interface ImagesDropzoneProps {
    onFilesChange: (files: File[]) => void;
    maxFiles: number;
}

const ImagesDropzone: React.FC<ImagesDropzoneProps> = ({ onFilesChange, maxFiles }) => {

    const onDrop= useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles.length > maxFiles){
            alert(`You can upload max ${maxFiles} images`);
        }
        onFilesChange(acceptedFiles);
    }, [onFilesChange]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        accept: {
            "image/*": []
        },
        onDrop,
        multiple: true,
        maxFiles: maxFiles,
        useFsAccessApi: true,
        noClick: true,
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                my: 4,
                p: 3,
                border: `2px dashed ${colors.blue[300]}`,
                backgroundColor: isDragActive ? colors.grey[100] : "white",
                borderRadius: 4,
                transition: 'all 0.2s',
            }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <Typography
                variant="body1"
                sx={{ fontWeight: "bold", whiteSpace: "pre-line", textAlign: "center" }}
            >
                {isDragActive
                    ? "DROP HERE..."
                    : "DRAG AND DROP HERE"}
            </Typography>
            <Button variant="contained" onClick={open}>
                Upload Images
            </Button>
            <Typography variant="caption" color="textSecondary">
                {maxFiles} images max
            </Typography>
        </Box>
    )
}


export default ImagesDropzone;