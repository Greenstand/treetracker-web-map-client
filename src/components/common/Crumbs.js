import { Box, Typography, Avatar, Breadcrumbs } from '@mui/material';
import Link from '../Link';

export default function Crumbs(props) {
  const { items } = props;

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          <Typography
            variant="caption"
            gutterBottom={false}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              minHeight: [16, 24],
            }}
          >
            /
          </Typography>
        }
      >
        {items.map((item) => {
          let { icon } = item;
          if (icon && icon.toString().match(/^(https?:\/\/|data:image)/)) {
            icon = (
              <Avatar
                sx={{
                  width: [16, 24],
                  height: [16, 24],
                  mr: 0.5,
                }}
                src={item.icon}
              />
            );
          }
          
          return (
            <Link href={item.url || '#'} key={item.url}>
              <Typography
                variant="caption"
                gutterBottom={false}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  minHeight: [16, 24],
                  cursor: item.url || 'text',
                }}
              >
                {icon}
                {item.name}
              </Typography>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
