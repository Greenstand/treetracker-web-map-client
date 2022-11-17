import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function CustomizeNavbar({ formFields, setFormFields }) {
  const handleChangeInput = (e, index) => {
    const values = [...formFields];
    const property = e.target.name;
    values[index][property] = e.target.value;
    setFormFields(values);
  };

  return (
    <>
      {formFields.map((formField, index) => (
        <Accordion
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          sx={{
            backgroundColor: 'whitesmoke',
            minWidth: '400px',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{formField.title}</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <TextField
              name="title"
              label="Title"
              variant="standard"
              onChange={(e) => handleChangeInput(e, index)}
              value={formField.title}
            />
            <TextField
              name="url"
              label="Link"
              variant="standard"
              onChange={(e) => handleChangeInput(e, index)}
              value={formField.url}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export default CustomizeNavbar;
