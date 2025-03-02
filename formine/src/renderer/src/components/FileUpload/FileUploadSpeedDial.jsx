import React, { useState, useEffect, forwardRef } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { SpeedDialAction } from '@mui/material';
import FileUploadModal from './FileUploadModal';

const FileUploadSpeedDial = forwardRef(
    ({ type_description, handleUpdate, handleOpen, ...props }, ref) => {
        const [open, setOpen] = useState(false);
        
        useEffect(() => {
            // Drag olaylarını dinleyin
            const handleDragOver = (e) => {
                handleOpen(); // Dosya bırakıldığında modal'ı aç
                e.preventDefault();
            };

            // Pencereye olayları bağlayın
            window.addEventListener('dragover', handleDragOver);

            // Temizlik işlemi, bileşen kaldırıldığında olayları siler
            return () => {
                window.removeEventListener('dragover', handleDragOver);
            };
        }, []);

        return (
            <>
                <SpeedDialAction
                    ref={ref}
                    {...props}
                    key={"upload"}
                    icon={<UploadFileIcon />}
                    tooltipTitle={"Yükle"}
                    tooltipOpen
                    onClick={() => handleOpen() & setOpen(true)}
                />
                <FileUploadModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    type_description={type_description}
                    handleUpdate={handleUpdate}
                />
            </>
        );
    }
);

export default FileUploadSpeedDial;
