import { Box } from '@mui/material';

function TagList({ children }) {
  const tagsHead = [];
  const tagsTail = [];

  children.forEach((tag) => {
    if (tag.props.disabled) {
      tagsTail.push(tag);
    } else {
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
