import { useDispatch, useSelector } from 'react-redux';
import FilesCard from './FilesCard'
import { useTranslation } from 'react-i18next';

import { selectFile as selectDatafile } from '../redux/features/datafiles/Slice';
import { fetchDatafiles, openDatafile, removeDatafiles } from '../redux/features/datafiles/API';

import { selectFile as selectFormfile } from '../redux/features/formfiles/Slice';
import { fetchFormfiles, openFormfile, removeFormfiles } from '../redux/features/formfiles/API';
import { reset as resetMappings } from '../redux/features/mappings/Slice';

export function DatafilesCard(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items, selected } = useSelector(state => state.datafiles);

    const handleSelect = (uuid) => {
        dispatch(selectDatafile(uuid))
        dispatch(resetMappings())
    }
    return (
        <FilesCard
            title={t("Data Files")}
            files={items}
            onSelected={handleSelect}
            onRemove={(uuid) => dispatch(removeDatafiles(uuid))}
            onUpdate={() => dispatch(fetchDatafiles())}
            onOpen={() => dispatch(openDatafile(selected))}
            apiURL={`${window.API_URL}/datafiles/upload`}
            {...props}
        />
    )
}

export function FormfilesCard(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items, selected } = useSelector(state => state.formfiles);

    return (
        <FilesCard
            title={t("Form Files")}
            files={items}
            onSelected={(uuid) => dispatch(selectFormfile(uuid))}
            onRemove={(uuid) => dispatch(removeFormfiles(uuid))}
            onUpdate={() => dispatch(fetchFormfiles())}
            onOpen={() => dispatch(openFormfile(selected))}
            apiURL={`${window.API_URL}/formfiles/upload`}
            {...props}
        />
    )
}
