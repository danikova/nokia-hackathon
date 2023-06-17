import { useState } from 'react';
import { Box } from '@mui/material';
import ResponsiveAppBar from '../@components/AppBar';
import ResponsiveDrawer from '../@components/Navigation/Drawer';
import ResponsiveBottomBar from '../@components/Navigation/BottomBar';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw' }}>
      <Box sx={{ flex: '0 0 64px', display: { xs: 'none', md: 'flex' } }}>
        <ResponsiveDrawer open={isDrawerOpen} setOpen={setIsDrawerOpen} />
      </Box>
      <Box sx={{ flex: '1 1 auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
          <Box sx={{ flex: '0 0 64px' }}>
            <ResponsiveAppBar open={isDrawerOpen} setOpen={setIsDrawerOpen} />
          </Box>
          <Box sx={{ flex: '1 1 auto' }}></Box>
          <Box sx={{ flex: '0 0 64px', display: { xs: 'flex', md: 'none' } }}>
            <ResponsiveBottomBar />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
