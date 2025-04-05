import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Stack, Typography, Paper, Button, Alert } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { backendUrl } from "@/utils";
import { useRouter } from "next/router";

export default function MyEvents() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [eventsData, setEventsData] = useState<
    {
      title: string;
      description: string;
      personLimit: number;
      date: Date;
      class: string;
      classTags: string[];
      grade: string;
      _id: string;
    }[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getEventsData = async () => {
      const response = await fetch(`${backendUrl}/getEvents`, {
        method: "GET",
      });

      if (!response.ok) {
        setError("An error occured.");
        return;
      }

      const data = await response.json();
      setEventsData(data.result);
    };

    getEventsData();
  }, []);

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
      spacing={4}
      sx={{ minHeight: "100vh", paddingTop: 4 }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <Stack spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={selectedDate} onChange={setSelectedDate} />
        </LocalizationProvider>

        {eventsData.filter(
          (event) =>
            dayjs(event.date).format("MMMM D, YYYY") ===
            selectedDate?.format("MMMM D, YYYY")
        ).length > 0 ? (
          <Stack spacing={1}>
            <Typography variant="h6">
              Events on {selectedDate?.format("MMMM D, YYYY")}:
            </Typography>
            {eventsData
              .filter(
                (event) =>
                  dayjs(event.date).format("MMMM D, YYYY") ===
                  selectedDate?.format("MMMM D, YYYY")
              )
              .map((event, index) => (
                <Paper
                  key={index}
                  sx={{ padding: 1, backgroundColor: "#1e1e2f" }}
                >
                  <Typography
                    color="white"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      router.push(`/events/event/${event._id}`);
                    }}
                  >
                    {event.title}
                  </Typography>
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
          <Button variant="contained" color="primary" href="add-event">
            Add event
          </Button>
        </Typography>
      </Stack>
    </Stack>
  );
}
