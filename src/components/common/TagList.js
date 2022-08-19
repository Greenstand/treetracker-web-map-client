import { Box, SvgIcon } from '@mui/material';
import TreeTag from './TreeTag';

function TagList({ tagListInfo }) {
  const head = [];
  const tail = [];

  tagListInfo.forEach((tag) => {
    const tagComponent = (
      <TreeTag
        key={`${tag.title}-${!tag.value ? tag.error : tag.value}`}
        TreeTagValue={!tag.value ? tag.error : tag.value}
        title={tag.title}
        icon={<SvgIcon component={tag.icon} />}
        disabled={!tag.value}
        subtitle={tag.value ? tag.subtitle : null}
        link={tag.value ? tag.link : null}
      />
    );

    if (!tag.value) {
      tail.push(tagComponent);
      return;
    }

    head.push(tagComponent);
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        mt: (t) => [t.spacing(5), t.spacing(9)],
      }}
    >
      {head}
      {tail}
    </Box>
  );
}

export default TagList;
