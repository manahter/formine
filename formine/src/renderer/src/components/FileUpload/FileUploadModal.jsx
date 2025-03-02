import React, { useState, useCallback } from 'react';
import {
    Box,
    List,
    Alert,
    Button,
    Dialog,
    ListItem,
    AlertTitle,
    Typography,
    IconButton,
    DialogTitle,
    ListItemText,
    ListItemIcon,
    DialogContent,
    DialogActions,
    LinearProgress,
} from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import { FileUploadOutlined } from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


const fileFilter = (files, file) => files.filter(_file => (!(_file.path === file.path && _file.size === file.size)))


const FileUploadModal = ({ open, handleClose, type_description, handleUpdate, upload_folder, acceptedFileTypes = {
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
} }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // file'ın parametrelerini günceller
    const updateFile = (file, params = {}) => {
        setFiles(prevFiles => [...fileFilter(prevFiles, file), Object.assign(file, params)])
    }

    const removeFile = (file) => () => {
        setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    };

    const onDrop = useCallback(
        (acceptedFiles) => {
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    percent: 0,
                    status: "waiting",  // ["waiting", "success", "error"]
                    error: "",
                })
            );
            setFiles((prevFiles) => [...prevFiles, ...newFiles.filter(nf => (!prevFiles.some(pf => (pf.size == nf.size && pf.path == nf.path))))]);
        },
        [setFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: acceptedFileTypes,
    });

    const handleUpload = () => {
        setLoading(true);
        const uploadPromises = files.map((file) => {
            if (file.status === "success") {
                return Promise.resolve();
            }
    
            const formData = new FormData();
            formData.append('file', file); // Dosya burada 'file' olarak gönderilecek
            formData.append('description', `${file.size}`); // Dosya açıklamasını ekleyebilirsiniz
    
            const apiUrl = `http://localhost:8000/${upload_folder}/upload`; // FastAPI endpoint'inizi burada belirtin
    
            return axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percent = Math.round((loaded * 100) / total);
                    updateFile(file, { "percent": percent });
                },
            }).then((response) => {
                // Yükleme başarılı olduğunda
                if (response.data.success) {
                    Object.assign(file, { "percent": 100, status: "success" });
                } else {
                    Object.assign(file, { "percent": 0, status: "error", "error": response.data.errors });
                }
            }).catch((error) => {
                // Yükleme sırasında hata oluştuğunda dosya listede kalacak
                Object.assign(file, { "percent": 0, status: "error", "error": ["Bilinmeyen Hata..."] });
                console.error('Yükleme hatası:', error);
            });
        });
    
        Promise.all(uploadPromises).then(() => {
            setLoading(false);
    
            // Tüm dosya durumlarını kontrol et
            if (files.every(file => file.status === "success")) {
                handleCancel(); // Yükleme başarılıysa işlemi sonlandır
            }
    
            // Güncellenmek üzere girilen metod varsa burada güncellenir
            if (handleUpdate) {
                handleUpdate();
            }
        });
    };

    const handleCancel = () => {
        setFiles([]);
        handleClose();
    };

    const showResult = (file, index) => (
        <Alert severity={file.status} key={file.name + index} onClose={removeFile(file)} sx={{ marginBottom: '1rem' }}>
            <AlertTitle>{file.name}</AlertTitle>
            {file.status === "success"
                ? "Dosya başarıyla yüklendi"
                : file.error.map((item, i) => <>{item} <br /></>)
            }
        </Alert>
    )

    return (
        <>
            <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs" sx={{
                "& .MuiPaper-root": {
                    borderRadius: "1rem",
                    paddingBottom: "1rem"
                },
            }}>
                <DialogTitle sx={{
                    fontWeight: 'bold',
                    letterSpacing: '-0.01rem',
                    fontSize: "1.1rem",
                    marginTop: "0.5rem"
                }}>
                    Dosya Yükleme
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCancel}
                        sx={{ position: 'absolute', right: 28, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ margin: "0px", paddingBottom: "0px" }}>
                    <Box
                        {...getRootProps()}
                        sx={{
                            borderRadius: '16px',
                            marginBottom: "0.5rem",
                            border: 'dashed 1px #ddd',
                            padding: '2rem 20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            bgcolor: isDragActive ? 'action.disabled' : "action.selected",
                        }}
                    >
                        <input {...getInputProps()} />
                        <Box
                            sx={{
                                borderRadius: '50%',
                                padding: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.default',
                            }}
                        >
                            <FileUploadOutlined sx={{ fontSize: 30, color: 'gray' }} />
                        </Box>
                        <Typography variant="subtitle1" color="textSecondary" sx={{ fontWeight: 'bold', letterSpacing: '-0.02rem', marginTop: "1em" }} >
                            Dosyalarınızı buraya sürükleyin
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ letterSpacing: '-0.02rem', }} >
                            veya
                            <br />
                            Dosya seçmek için tıklayın
                            <br />
                            {type_description}
                        </Typography>
                    </Box>

                    {files.length > 0 && (
                        <Box>
                            <List>
                                {files.map((file, index) => (
                                    file.status !== "waiting" ?
                                        (showResult(file, index)) :
                                        <ListItem
                                            sx={{
                                                borderRadius: "16px",
                                                border: "solid 1px", //  #ececec
                                                borderColor: "action.hover",
                                                bgcolor: "action.selected",
                                                marginBottom: '1rem',
                                            }}
                                            key={file.name + index}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={removeFile(file)}>
                                                    <DeleteOutlineOutlinedIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemIcon>
                                                <InsertDriveFileIcon />
                                            </ListItemIcon>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                <ListItemText
                                                    secondary={file.name}
                                                    secondaryTypographyProps={{
                                                        sx: {
                                                            fontWeight: "bold",
                                                            whiteSpace: 'nowrap',     // Tek satırda tut
                                                            overflow: 'hidden',       // Taşan kısmı gizle
                                                            textOverflow: 'ellipsis', // ... ile kısalt
                                                            maxWidth: '200px'         // Maksimum genişlik
                                                        }
                                                    }} />
                                                <Box sx={{ width: '100%', marginTop: 1, paddingBottom: "10px" }}>
                                                    <LinearProgress variant="determinate" value={file.percent} sx={{
                                                        height: '6px', backgroundColor: 'lightgray',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: 'black',
                                                        }
                                                    }} />
                                                </Box>
                                            </Box>
                                        </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </DialogContent>
                {files.length > 0 && (
                    <DialogActions sx={{ marginRight: "12px", marginBottom: 0 }}>
                        <Button onClick={handleCancel} variant="outlined" sx={{
                            borderColor: 'action.disabled',
                            color: 'action.disabled',
                            '&:hover': {
                                borderColor: 'error.main',
                                color: 'error.main',
                            }
                        }}>
                            İptal
                        </Button>
                        <Button onClick={handleUpload} color="primary" variant="contained" disabled={loading}>
                            {loading ? 'Yükleniyor...' : 'Yükle'}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
}
export default FileUploadModal;
