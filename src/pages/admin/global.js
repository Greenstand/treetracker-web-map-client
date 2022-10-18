import { Box, Typography, Divider, List } from '@mui/material';
import log from 'loglevel';
import { useState } from 'react';
import { Tab, TabPanel } from '../../components/dashboard/Tabs';

function Global() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleSidebarClick = (index) => {
    setCurrentTab(index);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          minWidth: '220px',
          p: 2,
          backgroundColor: '#f5f5f3',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
          }}
        >
          Dashboard
        </Typography>
        <Divider
          sx={{
            my: 2,
          }}
        />
        <List
          sx={{
            p: 0,
          }}
        >
          <Tab value={currentTab} index={0} onClick={handleSidebarClick}>
            <Typography>Theme Settings</Typography>
          </Tab>
          <Tab value={currentTab} index={1} onClick={handleSidebarClick}>
            <Typography>Theme Settings</Typography>
          </Tab>
        </List>
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 2,
        }}
      >
        <TabPanel value={currentTab} index={0}>
          <Typography variant="h5">Theme View</Typography>
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h5">Map View</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default Global;

export async function getServerSideProps({ params }) {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve(), 10));
  log.warn('on the server, global page, params: ', params);
  return {
    props: {},
  };
}
