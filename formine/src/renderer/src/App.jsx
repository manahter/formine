import { Alert, Box, Grow, Snackbar } from '@mui/material';
import TTProvider from './components/TTProvider'
import ColHeaders from './components/ColHeaders';
import ActionCard from './components/ActionCard';
import MappingCard from './components/MappingCard';
import { hideSnackbar } from './redux/features/snackbar/Slice';
import { DatafilesCard, FormfilesCard } from './components/AllFilesCard';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

window.API_URL = "http://localhost:8000";


const defaultProps = {
  sx: {
    mx: 4, mt: 2,
    minWidth: 280,
    maxWidth: 480,
  }
}


function App() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { message: snackMessage, open: snackOpen, state: snackState } = useSelector(state => state.snackbar)
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')


  const snackBar = (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={snackOpen}
      TransitionComponent={Grow}
      autoHideDuration={3000}
      onClose={() => dispatch(hideSnackbar())}
    // message={snackMessage}
    >
      <Alert
        severity={snackState}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {t(snackMessage)}
      </Alert>
    </Snackbar>)



  return (
    <TTProvider title={"Formine"} transition={true}>
      {/* Select Files */}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 6 }}>
        <DatafilesCard {...defaultProps} />
        <FormfilesCard  {...defaultProps} />
      </Box>

      <ColHeaders />

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <MappingCard  {...defaultProps} />
        <ActionCard  {...defaultProps} />
      </Box>
      {snackBar}

    </TTProvider>
  )
}

export default App