import { useEffect, useState } from 'react'
import {
    Box,
    Tooltip,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    TextField,
    Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


import { selectCol } from '../redux/features/datafiles/Slice';
import { fetchColumns } from '../redux/features/datafiles/API';
import { showSnackbar } from '../redux/features/snackbar/Slice';
import { addItem as addMappingItem } from '../redux/features/mappings/Slice';


function ColHeaders() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [textValue, setTextValue] = useState("");
    const [errorTextValue, setErrorTextValue] = useState(true);
    const { cols, selected: selectedDatafile, selectedCol } = useSelector((state) => state.datafiles)


    useEffect(() => {
        dispatch(fetchColumns(selectedDatafile))
    }, [selectedDatafile])

    const handledChangeCol = (event) => {
        dispatch(selectCol(event.target.value))
    }

    const handleChangeTexValue = (e) => {
        const inputValue = e.target.value.toUpperCase(); // Büyük harfe dönüştür
        const regex = /^[A-Z]{1,2}[1-9][0-9]*$/; // Excel hücre formatı kontrolü

        if (regex.test(inputValue)) {
            setErrorTextValue(false); // Hata yok
        } else {
            setErrorTextValue(true); // Geçersiz giriş
        }

        setTextValue(inputValue);
    };

    const handleAddMappingItem = () => {
        if (!selectedCol) {
            return dispatch(showSnackbar({message: "Please Select a Column", state: "warning"}))
        }
        if (errorTextValue || !textValue){
            return dispatch(showSnackbar({message: "Please enter a valid Excel cell name (e.g., A5, D7)", state: "error"}))
        }
        dispatch(addMappingItem({ datacol: selectedCol, formcell: textValue }))
        setTextValue("")
    }
    return (
        <Box>
            <Box style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}
                sx={{ m: 4 }}>
                <FormControl sx={{ minWidth: 140, maxWidth: 410, width: "100%" }} size="small" >
                    <InputLabel id="select-label">{t("Select Column")}</InputLabel>
                    <Select
                        labelId="select-label"
                        id="select-label"
                        value={selectedCol || ""}
                        label={t("Select Column")}
                        onChange={handledChangeCol}
                        disabled={!cols.length}
                    >
                        <MenuItem value=""><em>{t("Select Column")}</em></MenuItem>
                        {cols.map((value, i) => (
                            <MenuItem key={value} value={value}>{value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Tooltip title={t("Add to Table")}>
                    <span>
                        <Button
                            variant='outlined'
                            disabled={!selectedCol || errorTextValue || !textValue}
                            onClick={handleAddMappingItem}
                            role={undefined}
                            sx={{ mx: 5 }}>
                            <ArrowDownwardIcon />
                        </Button>
                    </span>
                </Tooltip>

                <TextField
                    error={textValue && errorTextValue}
                    // helperText={errorTextValue ? "Lütfen geçerli bir Excel hücre ismi girin (örn. A5, AB33)" : ""}
                    id="excel-cell-input"
                    label={t("Form Cell")}
                    value={textValue}
                    onChange={handleChangeTexValue}
                    size="small"
                    sx={{ width: "100%", maxWidth: 410 }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleAddMappingItem()
                        }
                    }}
                />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center', mt: 2 }}>

            </Box>
        </Box>

    )
}

export default ColHeaders