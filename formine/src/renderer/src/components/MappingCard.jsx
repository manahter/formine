import { useState } from 'react';
import {
    Table,
    Tooltip,
    TableRow,
    Checkbox,
    TableCell,
    TableBody,
    TableHead,
    IconButton,
    TableContainer,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import RepartitionIcon from '@mui/icons-material/Repartition';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import { savePresets, loadPresets } from '../redux/features/mappings/API';
import { removeItem } from '../redux/features/mappings/Slice';
import TTBox from './TTProvider/TTBox';

export default function MappingCard(props) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [selected, setSelected] = useState([]);
    const { items } = useSelector((state) => state.mappings)
    const { selected: selectedForm } = useSelector((state) => state.formfiles)
    const { selected: selectedData, cols: checkCols } = useSelector((state) => state.datafiles)

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = items.map((n) => n.formcell);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };


    const handleDelete = () => {
        console.log("Selected", selected)
        selected.forEach(item => dispatch(removeItem(item)))
        setSelected([])
    }

    const handleSetPresets = () => {
        dispatch(savePresets({uuid: selectedForm, presets: items}))
    }

    const handleGetPresets = () => {
        dispatch(loadPresets({uuid: selectedForm, checkCols}))
    }

    const loadPresetsButton = (
        <div>
            <IconButton onClick={handleGetPresets} disabled={!selectedForm || !selectedData} >
                <Tooltip arrow title={t("Load Presets")}>
                    <RepartitionIcon />
                </Tooltip>
            </IconButton>
            <IconButton onClick={handleSetPresets} disabled={!selectedForm} >
                <Tooltip arrow title={t("Save table for form")}>
                    <SaveRoundedIcon />
                </Tooltip>
            </IconButton>
        </div>
    )

    const deleteButton = (
        <Tooltip title={t("Delete")}>
            <IconButton onClick={handleDelete}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    )

    return (
        <TTBox
            title={t("Mapping Table")}
            headerTools={loadPresetsButton}
            headerActionMode={selected.length}
            headerActionText={`${selected.length} ` + t("selected")}
            headerActionTools={deleteButton}
            {...props}
        >
            {/* <TableToolbar numSelected={selected.length} onDelete={handleDelete} /> */}
            <TableContainer sx={{ maxHeight: 180, minHeight: 180 }}>
                <Table size={'small'}>
                    <TableHead sx={{ fontWeight: 'bold' }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selected.length > 0 && selected.length < items.length}
                                    checked={items.length > 0 && selected.length === items.length}
                                    onChange={handleSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all desserts',
                                    }}
                                />
                            </TableCell>
                            <TableCell align='left' padding='none'>
                                {t("Data Column")}
                            </TableCell>

                            <TableCell align='center'></TableCell>
                            <TableCell align='right' padding='normal' >
                                {t("Form Cell")}
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {items.map((item, index) => {
                            const isItemSelected = selected.includes(item.formcell);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, item.formcell)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={item.formcell}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell padding='none'>{item.datacol}</TableCell>
                                    <TableCell padding='none' align='center'><ArrowRightAltIcon /></TableCell>
                                    <TableCell align="right" >{item.formcell}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </TTBox>
    );
}