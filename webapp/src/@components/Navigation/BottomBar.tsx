import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { menuItems } from './constants';
import UserInfo from '../UserInfo';

const ResponsiveBottomBar = () => {
  return (
    <Box sx={{ width: '100vw' }}>
      <BottomNavigation
        showLabels
        // value={value}
        // onChange={(event, newValue) => {
        //   setValue(newValue);
        // }}
      >
        {menuItems.map((m) => {
          const { label, icon: IconComp } = m;
          return <BottomNavigationAction key={label} label={label} icon={<IconComp />} />;
        })}
        <BottomNavigationAction icon={<UserInfo />} />
      </BottomNavigation>
    </Box>
  );
};

export default ResponsiveBottomBar;
