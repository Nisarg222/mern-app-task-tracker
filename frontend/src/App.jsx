import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./routes/AppRouter";

const theme = createTheme({
  palette: {
    primary: { main: "#6c47ff" },
    secondary: { main: "#ff6b6b" },
  },
  typography: {
    fontFamily: "Roboto, system-ui, sans-serif",
  },
  shape: { borderRadius: 8 },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
