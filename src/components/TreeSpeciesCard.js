import { Paper, Card, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as d3 from 'd3';
import { makeStyles } from 'models/makeStyles';
import Link from './Link';

const useStyles = makeStyles()((theme) => ({}));

function TreeSpeciesCard(props) {
  const { classes } = useStyles();

  const { name, count, subTitle } = props;
  const formattedCount = new Intl.NumberFormat('en', {
    notation: 'compact',
  }).format(count);

  return (
    <Paper
      className={classes.root}
      variant="outlined"
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        mb: [2, 4],
      }}
    >
      <Grid
        container
        direction="row"
        columns={[4, 6]}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid
          item
          ml={6}
          sx={{
            wordWrap: 'break-word',
            width: '65%',
            padding: '8px 0',
          }}
        >
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
            {subTitle && subTitle.match(/^https?:/) ? (
              <Link href={subTitle} target="_blank">
                <Typography
                  variant="caption"
                  sx={{ textDecoration: 'underline' }}
                >
                  Learn more
                </Typography>
              </Link>
            ) : (
              subTitle
            )}
            {!subTitle && '---'}
          </Typography>
        </Grid>
        <Grid
          item
          xs={1}
          md={1}
          sx={{
            background: (t) => t.palette.background.paperDark,
            color: (t) => t.palette.text.primaryReverse,
            padding: (t) => [t.spacing(4, 5), t.spacing(6, 8)],
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
            {formattedCount}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TreeSpeciesCard;
