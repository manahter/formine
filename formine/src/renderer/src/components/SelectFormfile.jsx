import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Selectfile from './Selectfile';
import { selectFile as selectFormfile } from '../redux/features/formfiles/Slice';
import { fetchFormfiles, openFormfile, removeFormfiles } from '../redux/features/formfiles/API';

function SelectFormfile() {
  const dispatch = useDispatch();
  const { status, items, selected } = useSelector((state) => state.formfiles)

  useEffect(() => {
    handle_update()
  }, [])

  const handle_update = () => {
    dispatch(fetchFormfiles())
  }
  const handle_open = () => {
    dispatch(openFormfile(selected))
  }

  const handle_remove = () => {
    dispatch(removeFormfiles(selected))
  }

  const handle_change = (event) => {
    dispatch(selectFormfile(event.target.value))
  }

  return (
    <Selectfile
      title={"Form"}
      status={status}
      items={items}
      selected={selected}
      handle_open={handle_open}
      handle_remove={handle_remove}
      handle_update={handle_update}
      handle_change={handle_change}
      upload_folder={"formfiles"}
      />
  )
}

export default SelectFormfile