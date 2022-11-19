import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useConfigContext } from 'context/configContext';
import {
  addNavItem,
  removeNavItem,
  updateNavItem,
} from 'models/config.reducer';

function CustomInputs({ item, setItem, defaultItem }) {
  const [error, setError] = useState({
    title: '',
    url: '',
  });

  const { state: config } = useConfigContext();

  const handleChange = useCallback(
    (e) => {
      // will be either "title" or "url"
      const { name } = e.target;
      const { value } = e.target;

      // some validation
      // check if the value is not the original value
      // then check if the value does not already exists in the global config
      if (
        value !== defaultItem[name] &&
        config.navbar.items.find((n) => n[name] === value)
      ) {
        // set the error to the corresponding "name"
        setError((prevError) => ({
          ...prevError,
          [name]: `This ${name} is already taken`,
        }));
      } else {
        // clear the error of "name"
        setError((prevError) => ({
          ...prevError,
          [name]: '',
        }));
      }

      // update the input values
      setItem((prevItem) => ({
        ...prevItem,
        [name]: value,
      }));
    },
    [item, error, config.navbar.items],
  );

  return (
    <>
      <TextField
        name="title"
        label="Title"
        variant="standard"
        onChange={handleChange}
        value={item.title}
        error={error.title !== ''}
        helperText={error.title}
      />
      <TextField
        name="url"
        label="Url"
        variant="standard"
        onChange={handleChange}
        value={item.url}
        error={error.url !== ''}
        helperText={error.url}
      />
    </>
  );
}

function CustomAccordion({ item: defaultItem }) {
  const { dispatch } = useConfigContext();
  const [item, setItem] = useState(defaultItem);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = useCallback(() => {
    dispatch(removeNavItem(defaultItem.id));
  }, [defaultItem]);

  const handleUpdate = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(updateNavItem(item));
    },
    [item],
  );

  return (
    <Accordion
      key={item.id}
      sx={{
        backgroundColor: 'whitesmoke',
        minWidth: '400px',
      }}
      expanded={expanded}
      onChange={() => setExpanded((prev) => !prev)}
    >
      <AccordionSummary
        sx={{
          '.MuiAccordionSummary-content': {
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>{item.title}</Typography>
        <Box>
          <Button onClick={handleUpdate}>Update</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <CustomInputs item={item} setItem={setItem} defaultItem={defaultItem} />
      </AccordionDetails>
    </Accordion>
  );
}

function CustomizeNavbar() {
  const { state: config, dispatch } = useConfigContext();

  const onAddNewItem = () => {
    dispatch(addNavItem());
  };

  return (
    <>
      {config.navbar.items.map((item) => (
        <CustomAccordion key={item.id} item={item} />
      ))}
      <Button onClick={onAddNewItem}>New Item</Button>
    </>
  );
}

export default CustomizeNavbar;
