import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { Close, FileUpload } from '@mui/icons-material';
import {Button, IconButton, Tooltip } from '@mui/material';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AddIcon from '@mui/icons-material/Add';

import FileList from './FileList';
import TTBox from '../TTProvider/TTBox';


const FilesCard = ({
    title = "Files",
    files = [],
    onSelected,
    onUpdate,
    onRemove,
    onOpen,
    apiURL,
    size = 'small', // small, medium, large
    ...props
}) => {
    const { t } = useTranslation();
    const [dragging, setDragging] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const fileInputRef = useRef(null)

    useEffect(() => {
        onUpdate()
    }, [])

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            setDragging(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        updateUploadFiles(event.dataTransfer.files);
    };



    const updateUploadFiles = (comingFiles) => {
        // FileList türünü listeye çevirilir ve geçici UUID değerleri atanır
        const newFiles = Array.from(comingFiles).map(file => Object.assign(file, { "state": "uploading", "uuid": uuidv4(), "percent": 0 }));

        if (!apiURL || newFiles.length < 1) { return }

        const allFiles = [...uploadFiles, ...newFiles];

        setUploadFiles(allFiles);

        console.log("first", allFiles)
        allFiles.forEach(file => {
            if (file.state !== "uploading") { return }

            const formData = new FormData();
            formData.append('file', file);  // Dosya burada 'file' olarak gönderilecek
            formData.append('description', `${file.size}`); // Dosya açıklamasını ekleyebilirsiniz

            axios.post(apiURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    Object.assign(file, { "percent": Math.round((loaded * 100) / total) });
                },
            }).then((response) => {
                // Yükleme başarılı olduğunda
                if (response.data.success) {
                    // Object.assign(file, { "percent": 100, state: "uploaded" });
                    // Başarıyla yüklendi bu listeden kaldırabiliriz
                    setUploadFiles((prevFiles) => prevFiles.filter(f => f.uuid !== file.uuid));
                } else {
                    Object.assign(file, { "percent": 0, state: "error", "error": response.data.errors });
                }
                onUpdate()
            }).catch((error) => {
                Object.assign(file, { "percent": 0, state: "error", "error": error });
                onUpdate()
                console.error('Yükleme hatası:', error);
            });
        });
    }

    const handleUploadFileChange = (event) => {
        updateUploadFiles(event.target.files)
        fileInputRef.current.value = "";        // value sıfırlanır.
    }

    const fileUploadInput = <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept={".xlsx, .xls"}
        onChange={handleUploadFileChange}
        multiple
    />

    const headerTools = <>
        {fileUploadInput}
        <Tooltip title={t("Add File")} arrow disableInteractive>
            <IconButton
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
                <AddIcon fontSize={size} />
            </IconButton>
        </Tooltip>
    </>

    const footerTools = (
        <Button
            variant="outlined"
            color="primary"
            size={size}
            sx={{ borderRadius: 4 }}
            disabled={!files || !files.some(file => file.selected)}
            onClick={onOpen}
        >
            <FileOpenIcon fontSize={size} sx={{ mr: 1 }} />
            {t("Open File")}
        </Button>
    )
    return (
        <TTBox
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            headerTools={headerTools}
            footerTools={footerTools}
            title={title}
            sxContent={{ mx: 2 }}
            // sx={{
            //     mx: 4,
            //     mt: 2,
            // }}
            {...props}
        >
            <FileList
                files={files}
                onRemove={onRemove}
                onSelected={onSelected}
                uploadMode={dragging}
                onUpdate={onUpdate}
                apiURL={apiURL}
                uploadFiles={uploadFiles}
                setUploadFiles={setUploadFiles}
                uploadingArea={
                    <>
                        <IconButton onClick={() => setDragging(false)} sx={{ display: 'flex', ml: 'auto', mb: 'auto', }}>
                            <Close fontSize={size} />
                        </IconButton>
                        <FileUpload fontSize='large' color='action' sx={{ display: 'flex', mx: 'auto', mb: 'auto' }} />
                        <p></p>
                    </>}
            />
        </TTBox>
    );
};

export default FilesCard;
