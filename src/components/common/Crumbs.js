import { Box, Typography, Avatar } from '@mui/material';
import Link from '../Link';

export default function Crumbs(props) {
  const { items } = props;

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      {items.map((item, i) => {
        let {icon} = item;
        if (icon && icon.toString().match(/^(https?:\/\/|data:image)/)) {
          icon = (
            <Avatar
              sx={{
                width: [16, 24],
                height: [16, 24],
              }}
              src={item.icon}
            />
          );
        }
        const body = (
          <>
            {icon}
            <Typography
              variant="caption"
              sx={{
                textDecoration: 'none',
              }}
            >
              {item.name}
            </Typography>
          </>
        );

        return (
          <Box
            key={item.url}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              '& a': {
                textDecoration: 'none',
              },
            }}
          >
            {item.url && <Link href={item.url}>{body}</Link>}
            {!item.url && body}
            {i < items.length - 1 && (
              <Box
                sx={{
                  mx: 1,
                }}
              >
                <Typography variant="caption">/</Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
