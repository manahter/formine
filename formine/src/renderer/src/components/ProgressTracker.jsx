import axios from "axios";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import CircularProgressWithLabel from './CircularProgressWithLabel'


const ProgressTracker = ({
    inProgress,
    formfile,
    datafile,
    filename,
    multiPDF,
    items
}) => {
    const { t } = useTranslation()
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null)
    const [donefile, setDonefile] = useState(null)

    useEffect(() => {
        if (!inProgress) {
            if (socket) {
                socket.close()
                setSocket(null)
            }
            return
        }

        // setDonefile(null)
        // const socket = new WebSocket("ws://localhost:8000/process/");
        const _socket = new WebSocket("ws://localhost:8000/process/")
        setSocket(_socket);

        _socket.onopen = () => {
            setMessage(t("The process has started"));
            const data = {
                formfile,
                datafile,
                filename,
                multiPDF,
                items
            }
            _socket.send(JSON.stringify(data));
        };

        _socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("first", data)
            data.message && setMessage(data.message);
            data.progress && setProgress(data.progress)
            data.fileinfo && setDonefile(data.fileinfo)
            data.error && setError(data.error)
        };

        _socket.onerror = (error) => {
            console.error("WebSocket hatası:", error);
            setMessage(t("An error occurred!"))
            if (!error){
                setError(t("An error occurred!"));
            }
        };

        _socket.onclose = () => {
            if (progress === 100) {
                setMessage(t("Connection closed"))
            } else {
                setMessage(t("The process is complete"))
            }
        };

        return () => _socket.close();
    }, [inProgress]);


    const downloadFile = async () => {
        try {
            const response = await axios.get(window.API_URL + '/donefiles/' + donefile.uuid, {
                responseType: 'blob', // Dosya verisi olarak binary (blob) almak
            });

            // Dosya ismini başlıklardan alabiliriz (isteğe bağlı)
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition?.includes('filename=')
                ? contentDisposition.split('filename=')[1]?.replace(/['"]/g, '') ?? donefile.name
                : donefile.name;

            // Blob verisini kullanarak bir link oluşturuyoruz
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Dosyayı indirmek için bir <a> etiketi oluşturuyoruz
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); // Dosya ismi burada belirleniyor
            document.body.appendChild(link);
            link.click();

            // Link'i temizliyoruz
            document.body.removeChild(link);
        } catch (error) {
            console.error('An error occurred while downloading the file:', error);
        }
    };

    if (error){
        return (
            <Box>
                <Typography variant="h6" color="error" sx={{ textAlign: 'center'}}>{t(error)}</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ textAlign: 'center' }}>
            {
                donefile
                    ? <Button
                        size="large"
                        color="primary"
                        variant="text"
                        sx={{ borderRadius: 2 }}
                        onClick={downloadFile}
                        startIcon={<DownloadIcon fontSize="large" />}
                    >
                        {t("DOWNLOAD")}
                    </Button>
                    :
                    <>
                        <CircularProgressWithLabel value={progress} size={60} />
                        <Typography variant="body2" sx={{ mt: 1 }}>{t(message)}</Typography>
                    </>
            }

        </Box>
    );
};

export default ProgressTracker;
