"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Grid,
  Avatar,
  CardActionArea,
  Chip,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { backendUrl } from "@/utils";
import { Box } from "@mui/system";

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  class: string;
  classTags: string[];
  personLimit: number;
  joinedBy: string[];
  addedBy: {
    firstName: string;
    lastName: string;
    profileImage: string;
    clerkId: string;
  };
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/getEvents`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("An error occurred.");

        const data = await response.json();
        setEvents(data.result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Stack alignItems="center" spacing={2} sx={{ mt: 5 }}>
        <Typography gutterBottom variant="h5" component="div" color="black">
          Upcoming Events
        </Typography>

        <Stack spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              sx={{
                width: { xs: "80%", sm: "90%", md: "90%", lg: 600 },
                borderRadius: 1.5,
                backgroundColor: "#131d4c",
              }}
            >
              <CardContent sx={{ padding: "8px 16px", minHeight: 60 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Stack>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={180} height={28} />
                  </Stack>
                </Stack>
              </CardContent>

              <Skeleton variant="rectangular" height={140} width="100%" />

              <CardContent>
                <Skeleton variant="text" width="100%" height={40} />
                <Stack direction="row" spacing={1} mt="5px">
                  {[...Array(3)].map((_, idx) => (
                    <Skeleton
                      key={idx}
                      variant="rounded"
                      width={80}
                      height={30}
                    />
                  ))}
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <Skeleton variant="circular" width={18} height={18} />
                  <Skeleton variant="text" width={50} height={20} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" spacing={2} sx={{ mt: 5 }}>
      <Typography gutterBottom variant="h5" component="div" color="black">
        Upcoming Events
      </Typography>

      {events == undefined ? (
        <Typography variant="h6" color="gray">
          No events found for this month.
        </Typography>
      ) : (
        events.map((event) => (
          <Box
            onClick={() => router.push(`/events/${event._id}`)}
            key={event._id}
            sx={{
              width: { xs: "80%", sm: "90%", md: "90%", lg: 600 },
              borderRadius: 1.5,
              backgroundColor: "#131d4c",
            }}
          >
            <CardContent sx={{ padding: "8px 16px", minHeight: 60 }}>
              <Grid container alignItems="center" spacing={1}>
                <Grid>
                  <Avatar
                    src={
                      event.addedBy.profileImage || "/images/default-avatar.png"
                    }
                    alt={event.addedBy.firstName}
                    sx={{ width: 40, height: 40 }}
                    // sx={{ width: 40, height: 40, cursor: "pointer" }}
                    // onClick={() => router.push(`/users/${event.addedBy.clerkId}`)}
                  />
                </Grid>
                <Grid>
                  <Typography
                    variant="body2"
                    component="div"
                    color="white"
                    marginTop={0.8}
                    marginBottom={-1}
                  >
                    {event.addedBy.firstName} {event.addedBy.lastName}
                  </Typography>
                  <Typography variant="h6" component="div" color="white">
                    {event.title}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>

            {event.imageUrl ? (
              <CardActionArea
                onClick={() => router.push(`/events/${event._id}`)}
              >
                <CardMedia
                  component="img"
                  height="auto"
                  sx={{ maxHeight: "45vh" }}
                  image={event.imageUrl || "/images/default-project.pn"}
                  alt="Event Image"
                />
              </CardActionArea>
            ) : (
              <></>
            )}

            <CardContent>
              <Typography variant="body2" color="white">
                {event.description}
              </Typography>
              <Stack direction="row" spacing={1} mt="5px">
                {event.classTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    color="primary"
                    variant="filled"
                  />
                ))}
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 1 }}
              >
                <SupervisorAccountIcon sx={{ color: "white", fontSize: 18 }} />
                <Typography variant="body2" color="white">
                  {event.joinedBy.length}/{event.personLimit} {"People"}
                </Typography>
              </Stack>
            </CardContent>
          </Box>
        ))
      )}
    </Stack>
  );
}
