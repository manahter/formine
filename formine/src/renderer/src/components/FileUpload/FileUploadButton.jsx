import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileUploadModal from './FileUploadModal';
import { IconButton, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';


function FileUploadButton({ type_description, handleUpdate, upload_folder }) {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation()

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton aria-label={t("File Upload")} onClick={handleOpen}  >
        <Tooltip title={t("File Upload")}>
          <UploadFileIcon />
        </Tooltip>
      </IconButton>
      <FileUploadModal
        open={open}
        handleClose={handleClose}
        type_description={type_description}
        handleUpdate={handleUpdate}
        upload_folder={upload_folder}
      />
    </>
  );
}

export default FileUploadButton;
