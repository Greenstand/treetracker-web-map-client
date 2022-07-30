import CloseIcon from '@mui/icons-material/Close';
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
import heartIcon from '../images/icons/heart.svg';
import shareIcon from '../images/icons/share-icon.svg';
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

function CustomListText(props) {
  const { primary, secondary } = props;
  return (
    <ListItemText
      primary={
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 400,
            letterSpacing: '0.04em',
          }}
        >
          {primary}
        </Typography>
      }
      secondary={
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {secondary}
        </Typography>
      }
    />
  );
}

function CustomListAvatar(props) {
  const { src, alt } = props;
  return (
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
        src={src}
        alt={alt}
        sx={{
          height: 48,
          width: 48,
        }}
      />
    </ListItemAvatar>
  );
}

function CustomImageItem(props) {
  const { src, alt, isActive } = props;
  const { classes } = useStyles();
  return (
    <ImageListItem
      sx={{
        background: (t) => (isActive ? t.palette.primary.main : ''),
        borderRadius: 6,
        maxWidth: '132px',
        p: 2,
      }}
    >
      <img
        src={src}
        srcSet={src}
        alt={alt}
        loading="lazy"
        className={classes.imageSmall}
      />
    </ImageListItem>
  );
}

export default function TreeInfoDialog(props) {
  const { tree, planter, organization } = props;
  const { classes } = useStyles();
  /* eslint-disable no-shadow */
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
        open={open}
        onClose={handleClose}
        scroll={fullScreen ? 'paper' : 'body'}
        PaperProps={{
          sx: {
            borderRadius: { sm: 0, md: 4 },
            mt: { xs: 18, md: 16 },
            mx: 0,
            maxWidth: 1,
            width: '100vw',
          },
        }}
        sx={{
          py: { xs: 9, md: 4 },
          fontFamily: 'Lato',
          height: { xs: 'calc(100vh - 36)' },
          zIndex: 9999, // same index as zoom buttons
        }}
      >
        <DialogTitle>
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
        <DialogContent
          sx={{
            pb: 9,
          }}
        >
          <Grid
            container
            columns={{ sm: 1, md: 4 }}
            spacing={6}
            sx={{ pb: { sm: 6, md: 0 } }}
          >
            <Grid item md={1}>
              <ImageList
                rowHeight={156}
                gap={8}
                sx={{
                  gridTemplateColumns: {
                    xs: 'repeat(3, 1fr) !important',
                    sm: 'repeat(4, 1fr) !important',
                    md: 'repeat(1, 1fr) !important',
                    lg: 'repeat(2, 1fr) !important',
                    xl: 'repeat(3, 1fr) !important',
                  },
                  justifyItems: 'center',
                  my: 0,
                }}
              >
                <CustomImageItem
                  isActive
                  src={tree.image_url}
                  alt={`tree - #${tree.id}`}
                />
              </ImageList>
            </Grid>
            <Grid item md={2}>
              <Box
                sx={{
                  maxWidth: 1,
                  maxHeight: [512, 'calc(100vh - 196px)'],
                  overflow: 'hidden',
                  borderRadius: 4,
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
                <Typography variant="h4" fontSize="24px">
                  Palm Tree - {tree.id}
                </Typography>
                <Typography variant="h6">Eco-Peace-Vision</Typography>
                <List>
                  <ListItem sx={{ pl: 0 }}>
                    <CustomListAvatar
                      src={planter.image_url}
                      alt={`${planter.first_name} ${planter.last_name}`}
                    />
                    <CustomListText
                      primary="Planter"
                      secondary={`${planter.first_name} ${planter.last_name}`}
                    />
                  </ListItem>
                  {organization && (
                    <ListItem sx={{ pl: 0 }}>
                      <CustomListAvatar
                        src={organization.logo_url}
                        alt={organization.name}
                      />
                      <CustomListText
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
                  startIcon={<img src={heartIcon} />}
                  disableElevation
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 3,
                    borderRadius: 3,
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                  }}
                >
                  200
                </Button>
                <Button
                  startIcon={<img src={shareIcon} />}
                  disableElevation
                  variant="contained"
                  color="background"
                  sx={{
                    color: 'text.text1',
                    py: 3,
                    borderRadius: 3,
                    backgroundColor: '#e1e2e2',
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
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
