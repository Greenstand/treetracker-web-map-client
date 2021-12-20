import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import ParkTwoToneIcon from '@mui/icons-material/ParkTwoTone';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { textAlign } from '@mui/system';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

const useStyles = makeStyles()(() => ({
  sizeAvatar: {
    height: '50%',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    margin: '10px',
    borderRadius: '15px',
  },
  flag: {
    top: '-px',
    position: 'relative',
  },
  customText: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    padding: '10px',
    textAlign: 'center',
  },
  customText2: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    textAlign: 'center',
  },
  clickable: {
    cursor: 'pointer',
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
      <Box
        sx={{
          flexGrow: 1,
          borderRadius: 16,
          borderColor: 'grey.500',
          marginTop: 5,
        }}
      >
        <Grid
          container
          columns={16}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={1}>
            {/* Empty space */}
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h5" className={classes.customText}>
              #
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h5" className={classes.customText}>
              COUNTRY
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h5" className={classes.customText}>
              TREES PLANTED <ParkTwoToneIcon style={{ color: 'green' }} />
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {countries ? (
        countries.map((country, index) => (
          <Box
            key={country.id}
            sx={{
              flexGrow: 1,
              borderRadius: 16,
              borderColor: 'grey.500',
              boxShadow: 5,
            }}
            margin={2}
            borderColor={'beige.500'}
            onClick={() => handleCountryClick(country.id)}
            className={classes.clickable}
          >
            <Grid
              container
              columns={16}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={1}>
                {index === 0 ? (
                  <EmojiEventsTwoToneIcon
                    style={{ color: 'gold', marginLeft: '5' }}
                  />
                ) : (
                  <p></p>
                )}
                {index === 1 ? (
                  <EmojiEventsTwoToneIcon
                    style={{ color: 'silver', marginLeft: '5' }}
                  />
                ) : (
                  <p></p>
                )}
                {index === 2 ? (
                  <EmojiEventsTwoToneIcon
                    style={{ color: 'brown', marginLeft: '5' }}
                  />
                ) : (
                  <p></p>
                )}
              </Grid>

              <Grid item xs={1}>
                <Typography variant="h5" className={classes.customText}>
                  {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Avatar
                  src={country.flag || countries[index].flag}
                  variant="rounded"
                  className={`${classes.flag}  ${classes.sizeAvatar}  `}
                  borderRadius
                />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h5" className={classes.customText}>
                  {country.name}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h5" className={classes.customText2}>
                  {country.planted.toLocaleString()}
                  <ParkTwoToneIcon
                    style={{ color: 'green', marginLeft: '5' }}
                  />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))
      ) : (
        <p>Siuuu</p>
      )}
    </>
  );
}

export default LeaderBoard;
