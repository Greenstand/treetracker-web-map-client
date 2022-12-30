import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import {
  Typography,
  Stack,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

function JSONTextarea({ value, onChange }) {
  return (
    <Accordion square disableGutters elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="json-textarea-content"
        id="json-textarea-header"
        sx={{
          background: '#eee',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: 1,
          }}
        >
          <Typography>Theme in JSON format</Typography>
          <Tooltip title="Note that you can not just copy this theme and use it in your own MUI theme since this is customized to support dark and light themes">
            <InfoIcon
              sx={{
                fontSize: 'medium',
                marginRight: 2,
              }}
            />
          </Tooltip>
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: 0,
          display: 'flex',
        }}
      >
        <textarea
          onChange={onChange}
          style={{
            height: '100%',
            maxHeight: '350px',
            minHeight: '300px',
            flex: 1,
            border: 'none',
            outline: 'none',
          }}
          value={JSON.stringify(value, null, 2)}
        />
      </AccordionDetails>
    </Accordion>
  );
}

export default JSONTextarea;
