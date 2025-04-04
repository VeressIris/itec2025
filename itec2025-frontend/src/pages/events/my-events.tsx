import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Stack, Typography, Paper } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

const eventsData: Record<string, string[]> = {
  '2025-04-05': ['TeamUp Hackathon', 'Project BrainCircle Update'],
  '2025-04-10': ['Math Contest', 'Meeting with AI Team'],
};

export default function MyEvents() {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());

  const formattedDate = selectedDate?.format('YYYY-MM-DD') || '';
  const events = eventsData[formattedDate] || [];

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
      spacing={4}
      sx={{ minHeight: '100vh', paddingTop: 4 }}
    >
      <Stack spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={selectedDate} onChange={setSelectedDate} />
        </LocalizationProvider>

        {events.length > 0 ? (
          <Stack spacing={1}>
            <Typography variant="h6">Events on {selectedDate?.format('MMMM D, YYYY')}:</Typography>
            {events.map((event, index) => (
              <Paper key={index} sx={{ padding: 1, backgroundColor: '#1e1e2f' }}>
                <Typography color="white">{event}</Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No events on this day.
          </Typography>
        )}
      </Stack>

      <Stack>
        <Typography variant="h6" color="text.primary">
          Bla bla bla
        </Typography>
      </Stack>
    </Stack>
  );
}
