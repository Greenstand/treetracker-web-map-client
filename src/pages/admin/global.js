import { Box, Typography, Divider, List } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import HeadTag from 'components/HeadTag';
import Navbar from 'components/Navbar';
import ChangeLogoSection from 'components/dashboard/ChangeLogoSection';
import ChangeNavSection from 'components/dashboard/ChangeNavSection';
import { Tab, TabPanel } from 'components/dashboard/Tabs';
import { ConfigProvider, useConfigContext } from 'context/configContext';
import { CustomThemeProvider } from 'context/themeContext';
import { getOrganizationById } from 'models/api';
import { updateLogoUrl } from 'models/config.reducer';
import { wrapper } from 'models/utils';
import { MapContextProvider, useMapContext } from '../../mapContext';

const MapLayout = dynamic(() => import('components/GlobalMapLayout'), {
  ssr: false,
});

function Global({ organization }) {
  const [currentTab, setCurrentTab] = useState(0);
  const { state, dispatch } = useConfigContext();
  const mapContext = useMapContext();

  useEffect(() => {
    dispatch(updateLogoUrl(organization.logo_url));
  }, []);

  const handleSidebarClick = (index) => {
    setCurrentTab(index);
  };

  useEffect(() => {
    async function setUpMap() {
      const { map } = mapContext;
      if (map && organization) {
        const { lat, lon, zoom } = state.map.initialLocation;
        await map.setFilters({
          map_name: organization.map_name,
        });

        if (lat && lon && zoom) {
          map.gotoView(+lat, +lon, +zoom);
        }
      }
    }

    setUpMap();
  }, [mapContext, organization, state.map.initialLocation]);

  return (
    <CustomThemeProvider>
      <HeadTag title="Admin Dashboard" />
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
            <Typography variant="h4">Navbar Preview</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingY: '50px;',
                backgroundColor: 'background.paperDark',
                borderRadius: '8px',
                marginBottom: '24px',
              }}
            >
              <Navbar preview />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <ChangeLogoSection />
              <ChangeNavSection />
            </Box>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <Typography variant="h5">Theme View</Typography>
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <Typography variant="h5">Map View</Typography>
            <MapLayout />
          </TabPanel>
        </Box>
      </Box>
    </CustomThemeProvider>
  );
}

function GlobalWithContext(props) {
  return (
    <ConfigProvider>
      <MapContextProvider>
        <Global {...props} />
      </MapContextProvider>
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
