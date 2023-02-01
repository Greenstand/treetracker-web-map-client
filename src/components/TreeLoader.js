import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import Icon from 'components/common/CustomIcon';
import { useMobile } from 'hooks/globalHooks';
import CalendarIcon from 'images/icons/calendar.svg';
import LocationIcon from 'images/icons/location.svg';
import OriginIcon from 'images/icons/origin.svg';

export default function TreeLoader({ nextExtraIsEmbed }) {
  const theme = useTheme();
  const isMobile = useMobile();

  return (
    <Box
      sx={[
        {
          borderRadius: 4,
          maxHeight: [332, 764],
          mt: 6,
          position: 'relative',
          overflow: 'hidden',
          '& img': {
            objectFit: 'cover',
            width: '100%',
            [theme.breakpoints.down('sm')]: {
              maxHeight: '450px',
            },
          },
        },
        nextExtraIsEmbed && {
          '& img': {
            maxHeight: 600,
            objectFit: 'cover',
          },
        },
      ]}
    >
      <Box
        sx={{
          position: 'absolute',
          // top: [4, 6],
          // left: [4, 6],
          pt: [4, 6],
          px: [4, 6],
          width: 1,
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Skeleton
          variant="circular"
          width="62px"
          height="62px"
          sx={{ backgroundColor: 'greyLight.main', opacity: 0.9 }}
        />
        <Skeleton
          width="7em"
          height="40px"
          sx={{ backgroundColor: 'greyLight.main', opacity: 0.9 }}
        />
      </Box>

      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          backgroundColor: 'greyLight.main',
          opacity: 0.9,
        }}
        height="764px"
      />

      {!isMobile && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            background:
              'linear-gradient(359.38deg, #222629 0.49%, rgba(34, 38, 41, 0.8) 37.89%, rgba(34, 38, 41, 0.7) 50.17%, rgba(34, 38, 41, 0.6) 58.09%, rgba(34, 38, 41, 0.2) 82.64%, rgba(34, 38, 41, 0.05) 92.94%, rgba(34, 38, 41, 0) 99.42%)',
            p: 6,
            width: 1,
            height: 260,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="h2" color={theme.palette.common.white}>
            <Skeleton
              width="7em"
              sx={{ backgroundColor: 'greyLight.main', opacity: 0.9 }}
            />
          </Typography>

          <Box
            sx={{
              mt: 2,
              color: theme.palette.common.white,
              filter: 'opacity(0.8)',
            }}
          >
            <Typography
              sx={{
                color: 'text.text',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                '& svg': {
                  filter: 'opacity(0.8)',
                  maxWidth: 16,
                  maxHeight: 16,
                },
                '& path': { fill: theme.palette.common.white },
              }}
            >
              <Icon icon={OriginIcon} />
              <Skeleton
                width="7em"
                sx={{ backgroundColor: 'darkGrey.main', opacity: 0.9 }}
              />
            </Typography>
            <Typography
              sx={{
                color: 'text.text',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                '& svg': {
                  filter: 'opacity(0.8)',
                  maxWidth: 16,
                  maxHeight: 16,
                },
                '& path': { fill: theme.palette.common.white },
              }}
            >
              <Icon icon={CalendarIcon} />

              <Skeleton
                width="10em"
                sx={{ backgroundColor: 'darkGrey.main', opacity: 0.9 }}
              />
            </Typography>
            <Typography
              sx={{
                color: 'text.text',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                '& svg': {
                  filter: 'opacity(0.8)',
                  maxWidth: 16,
                  maxHeight: 16,
                },
                '& path': { fill: theme.palette.common.white },
              }}
            >
              <Icon icon={LocationIcon} />

              <Skeleton
                width="9em"
                sx={{ backgroundColor: 'darkGrey.main', opacity: 0.9 }}
              />
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 2,
            }}
          >
            <Skeleton
              width="4em"
              sx={{ backgroundColor: 'brightGrey.main', opacity: 0.9 }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
