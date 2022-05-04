import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import * as d3 from 'd3';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme) => ({
  root: {
    boxSizing: 'border-box',
    borderRadius: theme.spacing(4),
    border: '1px solid',
    borderColor: d3
      .color(theme.palette.greyLight.main)
      .copy({ opacity: 0.5 })
      .formatRgb(),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

function TreeSpeciesCard(props) {
  const { classes } = useStyles();

  const { name, count, subTitle } = props;

  return (
    <Card
      sx={{
        bgcolor: (t) => t.palette.background.paper,
      }}
      className={classes.root}
      elevation={0}
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
    </Card>
  );
}

export default TreeSpeciesCard;
