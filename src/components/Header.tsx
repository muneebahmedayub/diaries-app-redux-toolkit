import React, { useState } from "react";
import {
  AppBar,
  makeStyles,
  Toolbar,
  Tooltip,
  Typography,
  IconButton,
  colors,
  Menu,
  MenuItem,
} from "@material-ui/core";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { setUser } from "../redux/reducers/userSlice";
import { clearToken, setAuthState } from "../redux/reducers/authSlice";
import { addAll } from '../redux/reducers/diariesSlice'
import { useAppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers/rootReducer";
import http from "../services/api";
import { useNavigate } from 'react-router-dom'

interface Props {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const useStyles = makeStyles({
  title: {
    flex: 1,
  },
});

const Header: React.FC<Props> = ({ darkMode, setDarkMode }) => {
  const classes = useStyles();
  const navigate = useNavigate()

  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open: boolean = Boolean(anchorEl);

  const logout = () => {
    dispatch(setUser(null));
    dispatch(clearToken());
    dispatch(setAuthState(false));
    dispatch(addAll(null))
    setAnchorEl(null);
    navigate('/')
  };

  const deleteAccount = async () => {
    http.delete(`/delete-user/${user?.id}`)
    logout()
  }

  return (
    <div>
      <AppBar
        position="static"
        style={{ background: darkMode ? "#212121" : colors.indigo[500] }}
      >
        <Toolbar>
          <Typography className={classes.title} variant="h4">
            Diaries App
          </Typography>
          <Tooltip title="Toggle light/dark theme">
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          {isLoggedIn ? (
            <>
              <Tooltip title="Menu">
                <IconButton
                  color="inherit"
                  onClick={(e: React.MouseEvent<HTMLElement>) =>
                    setAnchorEl(e.currentTarget)
                  }
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={logout}>Logout</MenuItem>
                <MenuItem onClick={deleteAccount}>Delete Account</MenuItem>
              </Menu>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
