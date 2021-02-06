import React, { useState } from "react";
import "./App.css";
import {
  createMuiTheme,
  colors,
  ThemeProvider,
  CssBaseline,
} from "@material-ui/core";

import { useSelector } from "react-redux";
import { RootState } from "./redux/reducers/rootReducer";

import Header from "./components/Header";
import Home from './components/Home';
import Auth from './components/Auth';

function App() {
  // Dark mode theming
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#002884" : colors.indigo[500],
      },
      secondary: {
        main: darkMode ? "#ba000d" : colors.pink["A400"],
      },
    },
  });

  // App functioning
  const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          {isLoggedIn ? <Home /> : <Auth />}
        </CssBaseline>
      </ThemeProvider>
    </div>
  );
}

export default App;
