import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo, useState } from 'react';
import { SquareIconButton } from 'components/playground';
import { useConfigContext } from 'context/configContext';
import {
  addNavItem,
  removeNavItem,
  reorderNavItems,
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

function CustomAccordion({ item: defaultItem, index }) {
  const { dispatch } = useConfigContext();
  const [item, setItem] = useState(defaultItem);
  const [expanded, setExpanded] = useState(false);

  const hasItemChanged = useMemo(() => {
    if (item.title !== defaultItem.title || item.url !== defaultItem.url)
      return true;
    return false;
  }, [item.title, item.url, defaultItem.title, defaultItem.url]);

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
    <Draggable draggableId={`dnd-${item.id}`} index={index}>
      {(provided) => (
        <Accordion
          key={item.id}
          sx={{
            backgroundColor: 'whitesmoke',
            minWidth: '400px',
          }}
          expanded={expanded}
          onChange={() => setExpanded((prev) => !prev)}
          component="li"
          ref={provided.innerRef}
          {...provided.draggableProps}
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
            <div {...provided.dragHandleProps}>
              <DragIndicatorIcon />
            </div>
            <Typography>{item.title}</Typography>
            <Box>
              {hasItemChanged && <Button onClick={handleUpdate}>Update</Button>}
              <SquareIconButton
                icon={<DeleteIcon />}
                onClick={handleDelete}
                tooltip="Remove this navigation item"
                color="error"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <CustomInputs
              item={item}
              setItem={setItem}
              defaultItem={defaultItem}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </Draggable>
  );
}

function CustomizeNavbar() {
  const { state: config, dispatch } = useConfigContext();

  const onAddNewItem = () => {
    dispatch(addNavItem());
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) return;
    // dropped in same place
    if (result.destination.index === result.source.index) return;

    dispatch(reorderNavItems(result.source.index, result.destination.index));
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {config.navbar.items.map((item, idx) => (
                <CustomAccordion key={item.id} item={item} index={idx} />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={onAddNewItem}>New Item</Button>
    </>
  );
}

export default CustomizeNavbar;
