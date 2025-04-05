import { backendUrl } from "@/utils";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { EventType } from "@/types";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function Event() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useClerk();

  const [eventDetails, setEventDetails] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(false);
  const [attending, setAttending] = useState(false);

  const generateGoogleCalendarLink = (event: EventType) => {
    const start = dayjs(event.date).format("YYYYMMDDT");
    const end = dayjs(event.date).add(24, "hour").format("YYYYMMDDT");

    const url = new URL("https://www.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", event.title);
    url.searchParams.set("dates", `${start}/${end}`);
    url.searchParams.set("details", event.description);
    url.searchParams.set("sf", "true");
    url.searchParams.set("output", "xml");

    return url.toString();
  };

  const handleAttend = async () => {
    setLoading(true);
    const token = await getToken();
    await fetch(`${backendUrl}/joinEvent`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setAttending(!attending);
    setLoading(false);
  };

  useEffect(() => {
    if (!router.query.id) return;
    if (!user) return;

    const fetchEventDetails = async () => {
      setLoading(true);
      const id = router.query.id as string;
      if (!id) return;
      try {
        const response = await fetch(`${backendUrl}/getEvent?eventId=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        const data = await response.json();
        setEventDetails(data.result);
        console.log(data.result.joinedBy.includes(user?.id));
        setAttending(data.result.joinedBy.includes(user?.id));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [router.query.id, user]);

  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        {loading && <CircularProgress size={24} sx={{ mr: 2 }} />}
        {!loading && eventDetails && (
          <Box display="flex" justifyContent="center" mt={5}>
            <Card sx={{ maxWidth: 600, width: "100%", p: 3 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {eventDetails?.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {eventDetails?.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  🕒 {dayjs(eventDetails?.date).format("dddd, MMMM D YYYY")}
                </Typography>

                <Stack direction="row" spacing={2} mt={4}>
                  {!attending && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAttend}
                    >
                      Attend Event
                    </Button>
                  )}

                  {attending && (
                    <>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={handleAttend}
                      >
                        Unattend Event
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        component="a"
                        href={generateGoogleCalendarLink(eventDetails!)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Add to Google Calendar
                      </Button>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}
        {!loading && !eventDetails && <p>No event found</p>}
      </div>
    </div>
  );
}
