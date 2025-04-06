import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import {
  Stack,
  Typography,
  Paper,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { backendUrl } from "@/utils";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";

const MyEvents = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [events, setEventsData] = useState<
    Array<{
      title: string;
      description: string;
      personLimit: number;
      date: Date;
      class: string;
      classTags: string[];
      grade: string;
      _id: string;
    }>
  >([]);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(`${backendUrl}/getUserEvents`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("An error occurred.");

        const { result } = await response.json();
        setEventsData(result);
        setFilteredEvents(
          result.filter((event: any) => {
            return dayjs(event.date).isSame(selectedDate, "day");
          })
        );
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [getToken, selectedDate]);

  if (loading) {
    return (
      <Stack gap={4} direction="row" justifyContent="center" p={4}>
        <Stack spacing={3}>
          <Skeleton
            variant="rectangular"
            width={312}
            height={320}
            sx={{ borderRadius: 2 }}
          />
          <Stack spacing={1}>
            <Skeleton variant="text" width={220} height={28} />
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={300}
                height={48}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Skeleton variant="rectangular" width={120} height={40} />
        </Stack>
      </Stack>
    );
  }

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

        {filteredEvents.length ? (
          <Stack spacing={1}>
            <Typography variant="h6">
              Events on {selectedDate?.format("MMMM D, YYYY")}:
            </Typography>
            {filteredEvents.map((event) => (
              <Paper
                key={event._id}
                sx={{ padding: 1, backgroundColor: "#1e1e2f" }}
              >
                <Typography
                  color="white"
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push(`/events/event/${event._id}`)}
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
};

export default MyEvents;
