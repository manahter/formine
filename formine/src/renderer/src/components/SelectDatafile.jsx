import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Selectfile from './Selectfile';
import { selectFile as selectFile } from '../redux/features/datafiles/Slice';
import { fetchDatafiles, openDatafile, removeDatafiles } from '../redux/features/datafiles/API';


function SelectDatafile() {
  const dispatch = useDispatch();
  const { status, items, selected } = useSelector((state) => state.datafiles)

  useEffect(() => {
    handle_update()
  }, [])

  const handle_update = () => {
    dispatch(fetchDatafiles())
  }

  const handle_open = () => {
    dispatch(openDatafile(selected))
  }

  const handle_remove = () => {
    dispatch(removeDatafiles(selected))
  }

  const handle_change = (event) => {
    dispatch(selectFile(event.target.value))
  }

  return (
    <Selectfile
      title={"Data"}
      status={status}
      items={items}
      selected={selected}
      handle_open={handle_open}
      handle_remove={handle_remove}
      handle_update={handle_update}
      handle_change={handle_change}
      upload_folder={"datafiles"}
      />
  )
}

export default SelectDatafile