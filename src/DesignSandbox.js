import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const colorData = [
  'primary',
  'secondary',
  'textPrimary',
  'textSecondary',
  'textAlternative',
  'textLight',
];

function Row({ color, isBackground }) {
  return (
    <StyledTableRow>
      <TableCell component="th" scope="row">
        <Typography variant="h6">{color}</Typography>
      </TableCell>
      <TableCell align="right">
        <Box
          sx={{
            height: 50,
            width: 50,
            borderRadius: '50%',
            bgcolor: isBackground || `${color}.main`,
            background: (theme) => theme.palette.background[color],
          }}
        />
      </TableCell>
    </StyledTableRow>
  );
}

function DesignSandbox() {
  const theme = useTheme();
  const bgData = Object.entries(theme.palette.background).map(
    (entry) => entry[0],
  );

  return (
    <div>
      <Grid container justifyContent="space-around">
        <Grid item>
          <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 300 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <Typography variant="h6">Color Swatch</Typography>
                  </StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {colorData.map((color) => (
                  <Row key={color} color={color} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item>
          <TableContainer component={Paper}>
            <Table sx={{ maxWidth: 300 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <Typography variant="h6">Background Swatch</Typography>
                  </StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {bgData.map((color) => (
                  <Row key={color} color={color} isBackground />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="h3" mt={4} mb={4}>
          Typography:
        </Typography>
        <Typography variant="h1" component="div" gutterBottom>
          h1. Heading 48px
        </Typography>
        <Typography variant="h2" gutterBottom component="div">
          h2. Heading 36px
        </Typography>
        <Typography variant="h3" gutterBottom component="div">
          h3. Heading 32px
        </Typography>
        <Typography variant="h4" gutterBottom component="div">
          h4. Heading 28px
        </Typography>
        <Typography variant="h5" gutterBottom component="div">
          h5. Heading 20px
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          h6. Heading 16px
        </Typography>
        <Typography variant="subtitle1" gutterBottom component="div">
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="button" display="block" gutterBottom>
          button text
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          caption text
        </Typography>
        <Typography variant="overline" display="block" gutterBottom>
          overline text
        </Typography>
      </Box>
    </div>
  );
}

export default DesignSandbox;
