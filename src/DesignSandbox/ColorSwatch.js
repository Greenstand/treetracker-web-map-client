import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import StyledTableCell from './StyledTableCell';

function ColorSwatch({ title, usage, data, footnote, dynamic }) {
  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">Usage: {usage}</Typography>

      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 300 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {data.map((color) => (
                <StyledTableCell key={color}>{color}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {data.map((color) => (
                <TableCell key={color} sx={{ minWidth: '100px' }}>
                  <Box
                    sx={{
                      height: 50,
                      width: 50,
                      borderRadius: '50%',
                      bgcolor: dynamic ? `text.${color}` : `${color}.main`,
                      background: (theme) => theme.palette.background[color],
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography>*{footnote}</Typography>
    </>
  );
}

export default ColorSwatch;
