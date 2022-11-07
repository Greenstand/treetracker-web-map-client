import { Box, Typography, Divider, List } from '@mui/material';
import { useEffect, useState } from 'react';
import ChangeLogoSection from 'components/dashboard/ChangeLogoSection';
import { Tab, TabPanel } from 'components/dashboard/Tabs';
import { ConfigProvider, useConfigContext } from 'context/configContext';
import { getOrganizationById } from 'models/api';
import { updateLogoUrl } from 'models/config.reducer';
import { wrapper } from 'models/utils';

function Global({ organization }) {
  const [currentTab, setCurrentTab] = useState(0);
  const { dispatch } = useConfigContext();

  useEffect(() => {
    dispatch(updateLogoUrl(organization.logo_url));
  }, []);

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
            <Typography>Navbar Settings</Typography>
          </Tab>
          <Tab value={currentTab} index={1} onClick={handleSidebarClick}>
            <Typography>Theme Settings</Typography>
          </Tab>
          <Tab value={currentTab} index={2} onClick={handleSidebarClick}>
            <Typography>Map Settings</Typography>
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
          <Typography variant="h5">Navbar View</Typography>
          <ChangeLogoSection />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h5">Theme View</Typography>
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <Typography variant="h5">Map View</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}

function GlobalWithContext(props) {
  return (
    <ConfigProvider>
      <Global {...props} />
    </ConfigProvider>
  );
}

export default GlobalWithContext;

export const getServerSideProps = wrapper(async () => {
  const id = 178; // hardcoded FCC organization
  const organization = await getOrganizationById(id);
  return {
    props: {
      organization: {
        ...organization,
      },
    },
  };
});
