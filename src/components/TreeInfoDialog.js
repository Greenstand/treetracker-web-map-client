import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Grid,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  ImageList,
  ImageListItem,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import maxIcon from '../images/max.svg';
import { makeStyles } from '../models/makeStyles';

const useStyles = makeStyles()(() => ({
  imageLarge: {
    maxWidth: '100%',
  },
  imageSmall: {
    borderRadius: 16,
    maxHeight: '100%',
  },
}));

export default function TreeInfoDialog(props) {
  const { tree, planter, organization } = props;
  const { classes } = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isLgOrSmaller = useMediaQuery(theme.breakpoints.down('lg'));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          cursor: 'pointer',
          '& img': {
            width: [40, 52],
            height: [40, 52],
          },
        }}
      >
        <img alt="fullscreen" src={maxIcon} />
      </Box>
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={handleClose}
        sx={{
          mt: '72px',
        }}
      >
        <DialogTitle>
          <Typography>Tree Information Details</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container columns={{ sm: 1, md: 4 }} spacing={6}>
            <Grid item md={1}>
              <ImageList cols={isLgOrSmaller ? 1 : 2} rowHeight={156}>
                <ImageListItem
                  sx={{
                    background: (t) => t.palette.primary.main,
                    borderRadius: 6,
                    p: 2,
                  }}
                >
                  <img
                    src={`${tree.image_url}`}
                    srcSet={`${tree.image_url}`}
                    alt={`tree - #${tree.id}`}
                    loading="lazy"
                    className={classes.imageSmall}
                  />
                </ImageListItem>
              </ImageList>
            </Grid>
            <Grid item md={2}>
              <Box
                sx={{
                  maxWidth: 1,
                  maxHeight: [332, 664],
                  overflow: 'hidden',
                  borderRadius: 8,
                }}
              >
                <img
                  src={tree.image_url}
                  alt={`tree - #${tree.id}`}
                  className={classes.imageLarge}
                />
              </Box>
            </Grid>
            <Grid
              item
              md={1}
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flex: '1' }}>
                <Typography variant="h4">Palm Tree - {tree.id}</Typography>
                <Typography variant="h6">Eco-Peace-Vision</Typography>
                <List>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemAvatar
                      sx={{
                        height: 56,
                        width: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                      }}
                    >
                      <Avatar
                        src={planter.image_url}
                        alt={`${planter.first_name} ${planter.last_name}`}
                        sx={{
                          height: 48,
                          width: 48,
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Planter"
                      secondary={`${planter.first_name} ${planter.last_name}`}
                    />
                  </ListItem>
                  {organization && (
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemAvatar
                        sx={{
                          height: 56,
                          width: 56,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'start',
                        }}
                      >
                        <Avatar
                          src={organization.logo_url}
                          alt={organization.name}
                          sx={{
                            height: 48,
                            width: 48,
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary="Planting Organization"
                        secondary={organization.name}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 4,
                }}
              >
                <Button
                  startIcon={<FavoriteBorderIcon sx={{ color: '#fff' }} />}
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 3,
                    borderRadius: 3,
                    color: '#fff',
                  }}
                >
                  200
                </Button>
                <Button
                  startIcon={
                    <ShareIcon
                      sx={{ color: (t) => t.palette.text.primaryLight }}
                    />
                  }
                  color="background"
                  variant="contained"
                  sx={{
                    py: 3,
                    borderRadius: 3,
                  }}
                >
                  Share
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
