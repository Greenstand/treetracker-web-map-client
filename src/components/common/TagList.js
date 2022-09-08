import { Box } from '@mui/material';

// Used to display the TreeTag component in a list
// will define the postion(head/tail) based on the disabled prop on the TreeTag
function TagList({ children }) {
  const tagsHead = [];
  const tagsTail = [];

  // check for every TreeTag if disabled
  children.forEach((tag) => {
    if (tag.props.disabled) {
      // push to the end of the list
      tagsTail.push(tag);
    } else {
      // push to the front of the list
      tagsHead.push(tag);
    }
  });

  return (
    <Box
      sx={{
        marginTop: ({ spacing }) => [spacing(5), spacing(9)],
        flexWrap: 'wrap',
        display: 'flex',
        gap: 4,
      }}
    >
      {tagsHead}
      {tagsTail}
    </Box>
  );
}

export default TagList;
