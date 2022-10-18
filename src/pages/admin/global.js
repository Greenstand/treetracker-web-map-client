import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import log from 'loglevel';
import { useState } from 'react';

const green = '#61892F';
const lightGrey = '#f5f5f3';

function Tab({ children, value, index, onClick }) {
  return (
    <ListItem
      onClick={() => onClick(index)}
      sx={{
        cursor: 'pointer',
        boxSizing: 'border-box',
        borderLeft:
          value === index ? `2px solid ${green}` : `2px solid ${lightGrey}`,
      }}
    >
      {children}
    </ListItem>
  );
}

function TabPanel({ children, value, index }) {
  return value === index ? children : null;
}

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
          backgroundColor: lightGrey,
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
            <ListItemText>Theme Settings</ListItemText>
          </Tab>
          <Tab value={currentTab} index={1} onClick={handleSidebarClick}>
            <ListItemText>Map Settings</ListItemText>
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
