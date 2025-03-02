import { useState } from 'react';
import {
    Box,
    Button,
    Select,
    Switch,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
    FormControl,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import TTBox from './TTProvider/TTBox';
import ProgressTracker from './ProgressTracker';

function ActionCard(props) {
    const { t } = useTranslation()
    const { items } = useSelector(state => state.mappings)
    const { selected: selectedFormfile } = useSelector(state => state.formfiles)
    const { selected: selectedDatafile, cols } = useSelector(state => state.datafiles)
    const [multiPDF, setMultiPDF] = useState(false)
    const [outputFilename, setOutputFilename] = useState("")
    const [inProgress, setInProgress] = useState(false)


    const footerTools = (
        inProgress
            ? <Button
                variant="outlined"
                color="error"
                sx={{ borderRadius: 4 }}
                size={'small'}
                onClick={() => setInProgress(false)}
            >
                <CancelIcon fontSize={'small'} sx={{ mr: 1 }} />
                {t("Cancel")}
            </Button>
            : <Button
                variant="outlined"
                color="primary"
                sx={{ borderRadius: 4 }}
                size={'small'}
                disabled={!(selectedDatafile && selectedFormfile && items.length)}
                onClick={() => setInProgress(true)}
            >
                <PlayArrowIcon fontSize={'small'} sx={{ mr: 1 }} />
                {t("Start")}
            </Button>
    )


    const progressContent = (
        <ProgressTracker
            inProgress={inProgress}
            formfile={selectedFormfile}
            datafile={selectedDatafile}
            filename={outputFilename}
            multiPDF={multiPDF}
            items={items}
        />
    )

    const outputNameSelector = (
        <FormControl sx={{ minWidth: 140, maxWidth: 410, width: "100%" }} size='small'>
            <InputLabel id="select-label2">{t("File Name Selection")}</InputLabel>
            <Select
                labelId="select-label2"
                id="select-label2"
                value={outputFilename}
                label={t("File Name Selection")}
                onChange={(e) => setOutputFilename(e.target.value)}
            >
                <MenuItem value="">
                    <em>{selectedDatafile
                        ? t("File Name Selection")
                        : t("Select Data File First")}
                    </em>
                </MenuItem>
                {cols.map((value, i) => (
                    <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )

    const outputNameField = (
        <TextField
            fullWidth
            value={outputFilename}
            onChange={e => setOutputFilename(e.target.value)}
            margin='none'
            variant='outlined'
            label={t("File Name Input")}
            size='small'
        />
    )
    const checkMultiPDF = (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }} >

            <Typography variant='subtitle2'>
                {multiPDF ? t("Multiple PDF") : t("Single PDF")}
            </Typography>
            <Switch
                checked={!multiPDF}
                onChange={(a) => setMultiPDF(!multiPDF)} />
        </Box>
    )

    const configContent = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%', width: '100%',
            justifyContent: 'space-between',
        }}>
            {multiPDF ? outputNameSelector : outputNameField}
            {checkMultiPDF}
        </Box>
    )


    return (
        <TTBox
            title={t("Action")}
            footerTools={footerTools}
            color={"text.primary"}

            sxContent={{
                mx: 3, my: 2,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            // headerTools={headerTools}
            {...props}
        >
            {
                inProgress
                    ? progressContent
                    : configContent
            }

        </TTBox>
    )
}

export default ActionCard