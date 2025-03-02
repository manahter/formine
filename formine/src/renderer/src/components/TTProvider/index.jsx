import './styles.css'
import { useEffect, useState } from 'react'
import { ThemeProvider, createTheme, Box, Typography, IconButton } from '@mui/material';
import { showSnackbar } from '../../redux/features/snackbar/Slice';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Button, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import '@fontsource/roboto/400.css';
import axios from 'axios';


// TitleThemeProvider
function TTProvider({ title, children, transition }) {
  const [darkMode, setDarkMode] = useState(true);
  const [isWindowActive, setIsWindowActive] = useState(true);
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isBackendRunning, setIsBackendRunning] = useState(0);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get(window.API_URL)
      .then(response => {
        changeLanguage(response.data?.language)
        setDarkMode(response.data?.darkMode)
        setIsBackendRunning(1)
      })
      .catch(() => {
        setIsBackendRunning(-1)
      })

    if (transition) {

      const handleFocus = () => setIsWindowActive(true);
      const handleBlur = () => setIsWindowActive(false);

      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);

      return () => {
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  // Dil değiştirme fonksiyonu
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setAnchorEl(null); // Menü kapanacak
  };

  const gradients = {
    // "PremiumDark": "linear-gradient(-20deg, #161616 -10%, #2f2f2f 100%)",
    "PremiumDark": "linear-gradient(-20deg, #000 -10%, #434343 100%)",
    "DarkActive": "linear-gradient(-20deg, #0f0e0c -10%, #403b35 150%)",
    "DarkPassive": "linear-gradient(-20deg, #000 -30%, #434343 150%)",

    "RiskyConcrete": "linear-gradient(to top,rgb(188, 189, 190) 0%, #dcdddf 52%, #ebebeb 100%)",
    "LightActive": "linear-gradient(-20deg, #bec3cd 0%, #d9dce2 52%, #efe7e7 100%)",
    "LightPassive": "linear-gradient(-20deg,hsl(220, 10.30%, 71.60%) 0%,hsl(216, 4.90%, 79.80%) 52%,hsl(0, 2.90%, 79.40%) 100%)",
    // "LightPassive": "linear-gradient(to top, #c4c5c7 0%, #c4c5c7 100%)",
    // "LightPassive": "linear-gradient(to top, #c4c5c7 0%, #dcdddf 52%, #ebebeb 100%)",

    "Hershey": "linear-gradient(-20deg, #1e130c 0%, #9a8478 100%)", // ***
    "Moonwalker": "linear-gradient(-20deg, #000 0%, #152331 100%)",
    "KoyuKahvemsi": "linear-gradient(-30deg,rgb(14, 10, 7) 0%, #231f1a 100%)",
    "MoonlitAsteroid": "linear-gradient(-20deg, #0F2027 0%, #203A43 100%, #2C5364 100%)",
    "RoyalBlue": "linear-gradient(-10deg, #536976 0%, #292e49 100%)",
    "PaloAlto": "linear-gradient(-60deg, #ff5858 0%, #f09819 100%)",
    "CloudyApple": "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
  }

  const themeOptions = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#00E676' : '#1B5E20',
      },
      // secondary: {
      //   main: '#333333',
      // },
      background: {
        // default: darkMode ? '#434343': '#fff'
      }
    },
    typography: {
      h1: {
        fontSize: '4.6rem',
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 'bold',
          },
        },
      },
    },
    me: {
      transition: "background 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      backgroundImage: gradients[(darkMode ? "Dark" : "Light") + (isWindowActive ? "Active" : "Passive")],
      background: !isWindowActive ? "transparent" : (darkMode ? "#fff1" : "#fff9"),
      softBorder: "1px solid " + (darkMode ? "#0006" : "#fff6"),
      softShadow: !isWindowActive ? "transparent" : "0 4px 8px #0002, inset 0 1px 2px" + (darkMode ? " #fff3" : "#0002"),
      glass: darkMode ? "#0002" : "#fff8",
    },
  });


  const themeModeSelector = <IconButton
    size="medium"
    edge="end"
    color="text.primary"
    onClick={() => setDarkMode((prevMode) => !prevMode)}
    aria-label="theme toggle"
    sx={{ mr: 0 }}
  >
    {!darkMode ? <LightModeIcon /> : <DarkModeIcon />}
  </IconButton>


  const titleElement = <Typography
    style={{ WebkitAppRegion: 'drag' }}
    fontWeight={"500"}
    variant="h6"
    color="textPrimary"
  // sx={{ mr: 'auto', width: "100%" }}
  >
    {title}
  </Typography>


  const languageSelector = <>
    <Button
      onClick={(e) => setAnchorEl(e.currentTarget)} // Menü açma
      sx={{ color: "text.secondary", minWidth: 40, mr: "auto" }}
    >
      {i18n.language}
    </Button>

    {/* Menü */}
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={() => changeLanguage('tr')}>Türkçe</MenuItem>
      <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
      {/* Diğer diller buraya eklenebilir */}
    </Menu>
  </>


  const titleBar = <Box
    sx={{
      // position: 'fixed',
      // top: 0,
      // left: 0,
      // right: 0,
      // zIndex: 1000,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: "auto",
      height: "42px",
    }}
  >
    {themeModeSelector}
    {titleElement}
    {languageSelector}

    {/* Boşluk, tutamaç */}
    <Box
      sx={{
        // border: "1px dashed gray",
        width: "100%",
        height: "100%",
        WebkitAppRegion: 'drag',
      }}
    />
  </Box>

  if (isBackendRunning < 0) {
    dispatch(showSnackbar({ message: "Uygulama başlatılamadı. Kapatıp tekrar deneyin", state: "error" }))
  }
  return (
    <ThemeProvider theme={themeOptions}>
      <Box
        sx={{
          minHeight: '100vh',
          p: 0, m: 0,
          // pt: '42px',
          bgcolor: "background.default",
          transition: theme => theme.me.transition,
          backgroundImage: theme => theme.me.backgroundImage,
          boxShadow: "inset 1px 1px 4px #000f",
        }}>
        {titleBar}
        {children}
      </Box>
      <Typography
        onClick={() => window.open('https://github.com/manahter/formine')}
        sx={{
          position: "absolute",
          right: 20,
          bottom: 10,
          textAlign: 'right',
          color: '#8888',
          cursor: 'pointer',
        }}>@manahter</Typography>
    </ThemeProvider>
  )
}

export default TTProvider