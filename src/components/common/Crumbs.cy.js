import { Box, Typography } from '@mui/material';
import Crumbs from './Crumbs';
import { mountWithTheme as mount } from '../../models/test-utils';

describe('Crumbs', () => {
  it('cases', () => {
    const items = mount(
      <>
        <Typography>top page crumbs</Typography>
        <Box
          sx={{
            p: 10,
          }}
        >
          <Crumbs
            items={[
              {
                // icon: <HomeIcon />,
                name: 'Home',
                url: '/',
              },
              {
                name: 'tree spotlight',
                url: '/top',
              },
            ]}
          />
        </Box>
        <Typography>tree in planter context</Typography>
        <Box
          sx={{
            p: 10,
          }}
        >
          <Crumbs
            items={[
              {
                // icon: <HomeIcon />,
                name: 'Home',
                url: '/',
              },
              {
                name: 'sebastian g',
                url: '/planters/940',
                icon: 'https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.10.18.32.42_b4fad89a-10b6-40cc-a134-0085d0e581d2_IMG_20190710_183201_8089920786231467340.jpg',
              },
              {
                name: 'tree 1234',
              },
            ]}
          />
        </Box>
        <Typography>tree in planter context</Typography>
        <Box
          sx={{
            p: 10,
          }}
        >
          <Crumbs
            items={[
              {
                // icon: <HomeIcon />,
                name: 'Home',
                url: '/',
              },
              {
                name: 'tree 1234',
              },
            ]}
          />
        </Box>
      </>,
    );
  });
});
