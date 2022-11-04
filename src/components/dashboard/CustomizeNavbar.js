import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';

function CustomizeNavbar({ formFields, setFormFields }) {
  const handleChangeInput = (e, index) => {
    const values = [...formFields];
    const property = e.target.name;
    values[index][property] = e.target.value;
    setFormFields(values);
  };

  return (
    <div>
      {formFields.map((formField, index) => (
        <Accordion
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          sx={{
            backgroundColor: 'whitesmoke',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Navbar Item {index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              name="title"
              label="Title"
              variant="standard"
              onChange={(e) => handleChangeInput(e, index)}
              value={formFields[index].title}
            />
            <TextField
              name="url"
              label="Link"
              variant="standard"
              onChange={(e) => handleChangeInput(e, index)}
              value={formFields[index].url}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default CustomizeNavbar;
