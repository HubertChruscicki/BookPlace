import { colors } from "./colors.ts";
import { createTheme } from "@mui/material/styles";
import '@fontsource/nunito-sans'; // lub '@fontsource/nunito-sans/400.css'


export const theme = createTheme({
  typography: {
    fontFamily: "'ui-sans-serif', sans-serif",
  },
  palette: {
    primary: {
      main: colors.blue[500],
    },
    secondary: {
      main: colors.green[500],
    },
    error: {
      main: colors.red[500],
    },
    background: {
      default: colors.white[100],
    },
    text: {
      primary: colors.black[900],
    },
    grey: {
      ...colors.grey,
    },
  },
});
