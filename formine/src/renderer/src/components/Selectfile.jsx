import { useEffect } from 'react'
import {
    Box,
    IconButton,
    Tooltip,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DeleteOutline, FileOpenOutlined, FileCopyOutlined } from '@mui/icons-material';

import FileUploadButton from './FileUpload/FileUploadButton'

function Selectfile({ title, status, items, selected, handle_update, handle_open, handle_remove, handle_change, upload_folder }) {
    const { t } = useTranslation();

    useEffect(() => {
        handle_update()
    }, [])
    

    const elements =
        <>
            <FileUploadButton
                upload_folder={upload_folder}
                handleUpdate={handle_update} />

            <IconButton disabled={!selected} onClick={handle_open}>
                <Tooltip title={t("Open File")}>
                    <FileOpenOutlined />
                </Tooltip>
            </IconButton>

            <FormControl sx={{ m: 1, minWidth: 140, width: "100%" }} size="small" error={!selected || status !== "succeeded"}>
                <InputLabel id="select-label">{t(`Select ${title} File`)}</InputLabel>
                <Select
                    labelId="select-label"
                    id="select-label"
                    value={selected || ``}
                    label={t(`Select ${title} File`)}
                    onChange={handle_change}
                >
                    <MenuItem value=""><em>{t(`Select ${title} File`)}</em></MenuItem>
                    {items.map((value, i) => (
                        <MenuItem key={value.uuid} value={value.uuid}>{value.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>


            <IconButton disabled={!selected} onClick={handle_remove}>
                <Tooltip title={t("Duplicate File")}>
                    <FileCopyOutlined />
                </Tooltip>
            </IconButton>

            <IconButton disabled={!selected} onClick={handle_remove}>
                <Tooltip title={t("Remove File")}>
                    <DeleteOutline />
                </Tooltip>
            </IconButton>

        </>
    return (
        <Box
            style={{ display: "flex", alignItems: 'center' }}
            sx={{ mx: 6, mt: 2, bgcolor: "background.default", borderRadius: 3, boxShadow: 1,
                bgcolor: '#0002', }}>

            {/* {status !== "loading" && elements} */}
            {elements}
        </Box >
    )
}

export default Selectfile