import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { Box, Typography } from '@mui/material';

function TreeCapturesTimeline({
  captures = [],
  imgWidth = '160px',
  imgMaxHeight = '240px',
}) {
  return (
    <Box>
      <Timeline position="alternate">
        {captures.map((capture, index) => (
          <TimelineItem key={capture.id}>
            <>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent color="text.secondary">
                <Typography
                  variant="h6"
                  sx={[
                    {
                      fontSize: [18, 20],
                      lineHeight: (t) => [t.spacing(7.25), t.spacing(8.5)],
                    },
                  ]}
                >
                  <time dateTime={capture.time_created}>
                    {new Date(capture.time_created).toLocaleDateString()}
                  </time>
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                  }}
                >
                  <img
                    src={capture.image_url}
                    alt={`Capture ${capture.id}`}
                    style={{
                      width: imgWidth,
                      maxHeight: imgMaxHeight,
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              </TimelineContent>
            </>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}

export default TreeCapturesTimeline;
