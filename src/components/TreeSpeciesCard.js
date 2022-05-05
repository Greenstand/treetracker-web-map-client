import { Paper, Card } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as d3 from 'd3';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme) => ({}));

function TreeSpeciesCard(props) {
  const { classes } = useStyles();

  const { name, count, subTitle } = props;

  return (
    <Paper
      // sx={{
      //   bgcolor: (t) => t.palette.background.paper,
      // }}
      className={classes.root}
      variant="outlined"
      sx={{
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Box ml={6}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Lato',
            fontWeight: 600,
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
          }}
        >
          {subTitle || '---'}
        </Typography>
      </Box>
      <Box
        sx={{
          background: (t) => t.palette.background.paperDark,
          color: (t) => t.palette.text.primaryReverse,
          padding: (t) => [t.spacing(5.75, 7.5), t.spacing(6, 8)],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1">Count:</Typography>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Lato',
            fontWeight: 700,
            fontSize: [24, 32],
            letterSpacing: '0.04em',
            lineHeight: (t) => [t.spacing(7.25), t.spacing(9.5)],
            mt: [1, 2],
          }}
        >
          {count}
        </Typography>
      </Box>
    </Paper>
  );
}

export default TreeSpeciesCard;
