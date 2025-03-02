import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TaskRoundedIcon from '@mui/icons-material/TaskRounded';
import { useTranslation } from 'react-i18next';

const FileListItem = ({
    file,
    onRemove,
    onSelected,
    height = 40,

}) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleSelected = () => !file.state && onSelected(file.uuid);

    const tooltip = () => {
        switch (file.state) {
            case "uploading":
                return t("Uploading");
            case "error":
                return t("Error");
            default:
                return "";
        }
    }

    const color = (hover = false) => {
        switch (file.state) {
            case "uploading":
                return "warning.main";
            case "error":
                return "error.main";
            default:
                return (file.selected || hover) ? "text.primary" : "text.disabled";
        }
    }

    const iconProps = {
        fontSize: 'small',
        sx: { mr: 1 },
    }

    const icon = () => {
        if (file.selected) {
            return <TaskRoundedIcon {...iconProps} />;
        }
        switch (file.state) {
            case "uploaded":
                return <InsertDriveFileRoundedIcon {...iconProps} />;
            case "uploading":
                return <CircularProgress {...iconProps} variant="determinate" size={18} value={file.percent} color='warning' />;
            // return <AccessAlarmRoundedIcon {...iconProps} />;
            case "error":
                return <ErrorOutlineRoundedIcon {...iconProps} color='error' />;
            default:
                return <InsertDriveFileRoundedIcon {...iconProps} />;
        }
    }



    return (
        <Tooltip title={tooltip()} arrow placement='right'>
            <Box //className={file.state === "error" ? "fade-out" : ""}
                sx={{
                    color: color(),
                    height: { height },
                    display: 'flex', alignItems: 'center',
                    borderRadius: 5,
                    // border: theme => border(theme.palette),
                    pl: 1,
                    '&:hover': {
                        color: color(true),
                        bgcolor: 'rgba(156, 156, 156, 0.1)',
                    }
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleSelected}
            >
                {icon()}
                <Typography
                    variant="h3"
                    fontSize={13}
                    fontWeight={file.selected ? 'bold' : 'normal'}
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1, // Kalan alanı kaplasın
                    }}
                >
                    {file.name}
                    {/* {file.state === "error" && " - Siliniyor"} */}
                </Typography>

                {isHovered && file.state !== "uploading" &&
                    <IconButton onClick={() => onRemove(file.uuid)} sx={{ ml: 'auto' }}>
                        <DeleteOutlineIcon fontSize='small' />
                    </IconButton>}
            </Box>
        </Tooltip>
    );
};


const FileList = ({
    files,
    onRemove,
    onSelected,
    apiURL,
    itemHeight = 40,
    visibleItems = 3,
    uploadFiles,
    setUploadFiles,
    uploadMode,
    uploadingArea,
}) => {

    const renderUploadFiles = () => (
        uploadFiles.map((file) => (
            <FileListItem
                key={file.uuid}
                file={file}
                onRemove={(uuid) => setUploadFiles(uploadFiles.filter(f => f.uuid !== uuid))}
                // onSelected={onSelected}
                height={itemHeight}
                apiURL={apiURL}
            />
        ))
    )

    const renderExistFiles = () => (
        files.map((file) => (
            <FileListItem
                key={file.uuid}
                file={file}
                onRemove={onRemove}
                onSelected={onSelected}
                height={itemHeight}
                apiURL={apiURL}
            />
        ))
    )

    return (
        <Box
            sx={{
                py: 1,
                pr: 1,
                height: ((itemHeight) * visibleItems),
                overflowY: 'auto',
                '&::-webkit-scrollbar-track': {
                    m: 1
                },
            }}>
            {uploadMode
                ? <Box sx={{
                    bgcolor: "#0003",
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    {uploadingArea}
                </Box>
                : <>
                    {renderUploadFiles()}
                    {renderExistFiles()}
                </>
            }
        </Box>
    );
};


export default FileList;