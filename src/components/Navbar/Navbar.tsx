import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { useAuthStore, useFirmStore } from '#root/store';
import { useApi } from '#root/hooks';
import { Status } from '#root/const';
import Logo from '../logo/Logo';

type NavbarProperties = {
  className?: string;
  onMenuClick: () => void;
};

function Navbar({ onMenuClick, className }: NavbarProperties) {
  const api = useApi();
  const { authData, logout } = useAuthStore();
  const { status, firmInfo, fetchFirmData } = useFirmStore();

  const isIdle = status === Status.Idle;
  const isSuccess = status === Status.Success;
  const firmName = firmInfo?.firmname;

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElement(null);
  };

  useEffect(() => {
    if (!firmName && isIdle && authData?.firmId) {
      fetchFirmData(authData.firmId, api);
    }
  }, [firmName, isIdle, authData?.firmId, fetchFirmData, api]);

  return (
    <AppBar position="static" className={className}>
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
        )}

        {!isMobile && <Logo />}

        {isMobile ? (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              {isSuccess ? firmName : 'Загрузка...'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1 }} />
        )}

        <Tooltip title="Открыть настройки пользователя">
          <IconButton color="inherit" onClick={handleOpenUserMenu}>
            <PersonIcon />
            {!isMobile && (
              <Typography
                variant="subtitle1"
                sx={{
                  ml: 1,
                  fontSize: '1rem',
                }}
              >
                {isSuccess ? firmName : 'Загрузка...'}
              </Typography>
            )}
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-nav-bar"
          anchorEl={anchorElement}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElement)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem
            onClick={() => {
              logout();
              handleCloseUserMenu();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Выйти
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
