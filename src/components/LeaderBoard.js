import { Avatar, Box, Grid, Typography } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

import Ribbon from './Ribbon';

const useStyles = makeStyles()((theme) => ({
  sizeAvatar: {
    height: '50%',
    width: '55%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    [theme.breakpoints.down('md')]: {
      borderRadius: '4px',
    },
  },
  flag: {
    margin: theme.spacing(5),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(3.5),
    },
    boxShadow: '0 4px 20px rgba(0, 0, 0, .25)',
  },
  top: {
    margin: theme.spacing(14),
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
    margin: theme.spacing(8),
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
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(-1),
    },
  },
}));

function LeaderBoard(props) {
  const { countries, handleCountryClick } = props;

  if (countries) {
    // hard code
    countries[0].flag =
      'https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tanzania.svg';
    countries[1].flag =
      'https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Uganda.svg';
    countries[2].flag =
      'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg';
    countries[3].flag =
      'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg';
  }

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
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              #
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h5">COUNTRY</Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="h5" sx={{ textAlign: 'right' }}>
              {'TREES PLANTED '}
              <img src={'../images/tree_icon.svg'} alt="tree icon" />
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>

      {countries &&
        countries.map((country, index) => (
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
              <Grid item xs={2}>
                {index < 3 ? (
                  <p></p>
                ) : (
                  <Typography
                    variant="h5"
                    sx={{ textAlign: 'center', marginLeft: '50%' }}
                  >
                    {index + 1}
                  </Typography>
                )}
                {/* Here we add the position number for the top 3 countries with an svg file */}
                {index === 0 && (
                  <div className={classes.ribbons}>
                    <Ribbon fill="#FFD700" />
                    <Typography variant="h5" className={classes.rank}>
                      {index + 1}
                    </Typography>
                  </div>
                )}
                {index === 1 && (
                  <div className={classes.ribbons}>
                    <Ribbon fill="#cccccc" />
                    <Typography variant="h5" className={classes.rank}>
                      {index + 1}
                    </Typography>
                  </div>
                )}
                {index === 2 && (
                  <div className={classes.ribbons}>
                    <Ribbon fill="#9f7a33" />
                    <Typography variant="h5" className={classes.rank}>
                      {index + 1}
                    </Typography>
                  </div>
                )}
                {/* Here we add the position number for the rest of the countries */}
              </Grid>
              <Grid item xs={4}>
                <Avatar
                  src={country.flag || countries[index].flag}
                  className={`${classes.flag}  ${classes.sizeAvatar}  `}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h5">{country.name}</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: 'right',
                    marginRight: '19.99%',
                  }}
                >
                  {`${country.planted.toLocaleString()} `}
                  <img src={'../images/tree_icon.svg'} alt="tree icon" />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      <Box pb={4} />
    </>
  );
}

export default LeaderBoard;
