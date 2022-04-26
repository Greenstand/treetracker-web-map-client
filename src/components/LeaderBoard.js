import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import countries from 'i18n-iso-countries';
import Image from 'next/image';
import { makeStyles } from 'models/makeStyles';
import { fixCountryNames } from 'models/utils';
import Ribbon from './Ribbon';

const useStyles = makeStyles()((theme) => ({
  flagContainer: {
    position: 'relative',
    margin: theme.spacing(5),
    width: 88,
    height: 60,
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(3.5),
      width: 54,
      height: 40,
    },
    '& span': {
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, .25)',
    },
  },
  top: {
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(5),
    },
    [theme.breakpoints.only('md')]: {
      margin: theme.spacing(9.75),
    },
  },
  item: {
    borderRadius: '100px',
    boxShadow: '0 4px 10px 0px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    margin: theme.spacing(8, 4),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(3),
    },
  },
  ribbons: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(-15),
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(-10),
    },
  },
  rank: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    marginTop: theme.spacing(-2),
    fontFamily: 'Lato',
    fontSize: '24px',
    lineHeight: '28.8px',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(-1),
      fontSize: '16px',
      lineHeight: '19.2px',
    },
  },
  title: {
    fontFamily: 'Lato',
    fontWeight: 700,
    // color: theme.palette.text.secondary,
    [theme.breakpoints.down('md')]: {
      fontWeight: 400,
    },
  },
}));

function RibbonWrapper({ fill, index }) {
  const { classes } = useStyles();

  return (
    <div className={classes.ribbons}>
      <Ribbon fill={fill} />
      <Typography variant="h5" className={classes.rank}>
        {index + 1}
      </Typography>
    </div>
  );
}

function TreeImage() {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Image
      src="/images/tree_icon.svg"
      alt="tree icon"
      width={!isMobileScreen ? 13.5 : 12}
      height={!isMobileScreen ? 18 : 14}
    />
  );
}

function LeaderBoard(props) {
  const { countries: rankedCountries, handleCountryClick } = props;

  const fixedCountries = fixCountryNames(rankedCountries);

  // to support a browser environment:
  /* eslint-disable global-require */
  countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
  /* eslint-enable global-require */

  const { classes } = useStyles();

  return (
    <>
      <Box className={classes.top}>
        <Grid
          container
          columns={16}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={2}>
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                marginLeft: '38px',
              }}
              color="text.secondary"
              className={classes.title}
            >
              #
            </Typography>
          </Grid>
          <Grid item xs={4} pl={4}>
            <Typography
              variant="h5"
              color="text.secondary"
              className={classes.title}
              sx={{
                marginLeft: '16px',
              }}
            >
              COUNTRY
            </Typography>
          </Grid>

          <Grid
            item
            xs={9}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingRight: '4px',
            }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                textAlign: 'right',
                marginRight: '8px',
              }}
              className={classes.title}
            >
              TREES PLANTED
            </Typography>
            <TreeImage />
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Box>

      {fixedCountries &&
        fixedCountries.map((country, index) => (
          <Box
            key={country.id}
            className={classes.item}
            onClick={() => handleCountryClick(country.id)}
          >
            <Grid
              container
              columns={16}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={2} justifySelf="center">
                {index < 3 ? (
                  <p />
                ) : (
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{
                      marginLeft: '50%',
                      fontFamily: 'Lato',
                      lineHeight: ['28.8px', '19.2px'],
                    }}
                  >
                    {index + 1}
                  </Typography>
                )}
                {/* Here we add the position number for the top 3 countries with an svg file */}
                {index === 0 && <RibbonWrapper fill="#FFD700" index={index} />}
                {index === 1 && <RibbonWrapper fill="#cccccc" index={index} />}
                {index === 2 && <RibbonWrapper fill="#9f7a33" index={index} />}

                {/* Here we add the position number for the rest of the countries */}
              </Grid>
              <Grid item xs={4}>
                <Box className={classes.flagContainer}>
                  <Image
                    alt={`${country.name}`}
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countries.getAlpha2Code(
                      `${country.name}`,
                      'en',
                    )}.svg`}
                    layout="fill"
                    objectFit="cover"
                  />
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ fontFamily: 'Lato' }}
                >
                  {country.name}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: 1,
                    boxSizing: 'border-box',
                    paddingRight: '32px',
                  }}
                >
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{
                      textAlign: 'right',
                      fontFamily: 'Lato',
                      marginRight: '8px',
                    }}
                  >
                    {`${country.planted.toLocaleString()} `}
                  </Typography>
                  <TreeImage />
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      <Box pb={4} />
    </>
  );
}

export default LeaderBoard;
