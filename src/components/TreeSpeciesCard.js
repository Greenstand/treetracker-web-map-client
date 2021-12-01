import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme) => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    boxSizing: 'border-box',
    borderRadius: theme.spacing(4),
    border: '1px solid',
    borderColor: theme.palette.grey[600],
    width: '60%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  countBox: {
    background: theme.palette.grey[600],
    color: theme.palette.common.white,
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const TreeSpeciesCard = (props) => {
  const { classes } = useStyles();
  const theme = useTheme();

  const { name, scientificName, count } = props;

  return (
    <Card className={classes.root} elevation={0}>
      <Box ml={5}>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.textPrimary.main, fontWeight: 600 }}
        >
          {name}
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.grey[600] }}>
          {scientificName}
        </Typography>
      </Box>
      <Box className={classes.countBox}>
        <Typography variant="body1">Count:</Typography>
        <Typography variant="h6">{count}</Typography>
      </Box>
    </Card>
  );
};

export default TreeSpeciesCard;
