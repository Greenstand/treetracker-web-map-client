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
import StyledTableRow from './StyledTableRow';
import typographyData from './TypographyData';

function TypographyTable() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mt={4} mb={4}>
        Typography:
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Typography</StyledTableCell>
              <StyledTableCell align="right">Size&nbsp;</StyledTableCell>
              <StyledTableCell align="right">fontFamily</StyledTableCell>
              <StyledTableCell align="right">fontWeight</StyledTableCell>
              <StyledTableCell align="right">lineHeight</StyledTableCell>
              <StyledTableCell align="right">letterSpacing</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {typographyData.map((row) => (
              <StyledTableRow
                key={row.typography}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.typography}
                </TableCell>
                <TableCell align="right">{row.size}</TableCell>
                <TableCell align="right">{row.fontFamily}</TableCell>
                <TableCell align="right">{row.fontWeight}</TableCell>
                <TableCell align="right">{row.lineHeight}</TableCell>
                <TableCell align="right">{row.letterSpacing}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography>* Desktop&nbsp;(mobile)</Typography>
      <Typography>
        * Every Typography components default color is the &apos;Dark Grey&apos;
        #474B4F
      </Typography>
    </Box>
  );
}

export default TypographyTable;
