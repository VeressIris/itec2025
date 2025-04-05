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
import Link from "next/link";

export default function Event() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useClerk();

  const [eventDetails, setEventDetails] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(false);
  const [attending, setAttending] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  const generateGoogleCalendarLink = (event: EventType) => {
    const start = dayjs(event.date).format("YYYYMMDDT000000Z");
    const end = dayjs(event.date).add(1, "day").format("YYYYMMDDT000000Z");

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
    const id = router.query.id as string;

    try {
      await fetch(`${backendUrl}/leaveEvent?eventId=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/events/my-events");
    } catch (error) {
      console.error("Error while leaving event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    const token = await getToken();
    const id = router.query.id as string;

    try {
      await fetch(`${backendUrl}/joinEvent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: id }),
      });
      setAttending(true);
    } catch (error) {
      console.error("Error while joining event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    setLoading(true);
    const token = await getToken();
    const id = router.query.id as string;

    try {
      await fetch(`${backendUrl}/deleteEvent?eventId=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/events/my-events");
    } catch (error) {
      console.error("Error while deleting event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.query.id || !user) return;

    const fetchEventDetails = async () => {
      setLoading(true);
      const id = router.query.id as string;

      try {
        const response = await fetch(`${backendUrl}/getEvent?eventId=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        const data = await response.json();
        setEventDetails(data.result);
        setAttending(data.result.joinedBy.includes(user.id));
        setIsCreator(data.result.addedBy.clerkId === user.id);
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
                  {eventDetails.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {eventDetails.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  🕒 {dayjs(eventDetails.date).format("dddd, MMMM D YYYY")}
                </Typography>

                <Stack direction="row" spacing={2} mt={4} flexWrap="wrap">
                  {!attending && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleJoin}
                    >
                      Attend Event
                    </Button>
                  )}

                {attending && (
                  <Stack direction="column" spacing={2}>
                    <Stack direction="row" spacing={2}>
                      {isCreator ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleDelete}
                        >
                          Delete Event
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleAttend}
                        >
                          Leave Event
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        color="secondary"
                        component="a"
                        href={generateGoogleCalendarLink(eventDetails)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Add to Google Calendar
                      </Button>
                    </Stack>

                    <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      href={`/chat/${eventDetails.chatRoom}`}
                    >
                      Go to Event Chat
                    </Button>
                  </Stack>
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
