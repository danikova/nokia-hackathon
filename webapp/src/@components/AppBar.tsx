import { FC } from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box, { BoxProps } from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import { rgbToHex, styled } from '@mui/material';
import { drawerWidth } from './Navigation/constants';
import UserInfo from './UserInfo';

interface ResponsiveAppBarProps {
  open?: boolean;
  setOpen?: (newValue: boolean) => void;
}

const NokiaLogo: FC<BoxProps> = (props) => (
  <Box {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="40"
      viewBox="0 0 576 131"
      fill="none"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g clip-path="url(#clip0_31_4489-2)">
        <path
          d="M398.16 4.53001V126.43H417.25V4.53001H398.16ZM194.22 2.45001C157.03 2.45001 128.18 28.37 128.18 65.48C128.18 104.26 157.03 128.51 194.22 128.51C231.41 128.51 260.32 104.26 260.26 65.48C260.21 30.32 231.41 2.45001 194.22 2.45001ZM241.21 65.48C241.21 92.95 220.17 111.16 194.22 111.16C168.27 111.16 147.23 92.95 147.23 65.48C147.23 38.51 168.27 19.8 194.22 19.8C220.17 19.8 241.21 38.51 241.21 65.48ZM0 0.580017V126.43H19.48V43.26L120.72 130.37V104.28L0 0.580017ZM274.62 65.48L345.47 126.43H373.88L302.92 65.48L373.87 4.53001H345.46L274.62 65.48ZM576 126.43H555L539.64 99.44H470.09L454.73 126.43H433.73L459.16 81.44H529.65L494.5 18.91L504.86 0.580017L576 126.43Z"
          fill="white"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_31_4489-2">
          <rect width="576" height="129.79" fill="white" transform="translate(0 0.580017)"></rect>
        </clipPath>
      </defs>
    </svg>
  </Box>
);

interface AppBarProps extends MuiAppBarProps, Omit<ResponsiveAppBarProps, 'setOpen'> {}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  background: 'rgb(37, 89, 246)',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const ResponsiveAppBar: FC<ResponsiveAppBarProps> = ({ open, setOpen }) => {
  return (
    <AppBar position="fixed" open={open}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              marginRight: 5,
              display: { xs: 'none', md: 'flex' },
              ...(open && { display: 'none' }),
            }}
            onClick={() => setOpen && setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <NokiaLogo sx={{ display: 'flex', alignContent: 'center' }} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />
          <NokiaLogo sx={{ display: { xs: 'flex', md: 'none' } }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <UserInfo />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
