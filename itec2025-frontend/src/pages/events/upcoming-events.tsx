"use client";
import * as React from "react";
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
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

interface Event {
    id: string;
    title: string;
    description: string;
    images: string[];
    tags: string[];
    likeCount: number;
    organizer: {
        name: string;
        profileImage: string;
        id: string;
    };
}

const hardcodedEvents: Event[] = [
    {
        id: "1",
        title: "AI Hackathon",
        description: "Join us for a weekend of innovation and collaboration in AI.",
        images: ["/images/event-ai.jpg"],
        tags: ["AI", "Hackathon", "Tech"],
        likeCount: 45,
        organizer: {
            name: "Liga AC",
            profileImage: "/images/liga-avatar.png",
            id: "user123",
        },
    },
    {
        id: "2",
        title: "Open Source Day",
        description: "A day dedicated to contributing to open source and learning git.",
        images: ["/images/event-oss.jpg"],
        tags: ["Git", "Open Source", "Community"],
        likeCount: 32,
        organizer: {
            name: "FII Practic",
            profileImage: "/images/fii-avatar.png",
            id: "user456",
        },
    },
    {
        id: "3",
        title: "Tech Talk: Web3",
        description: "Explore the future of the decentralized web with top speakers.",
        images: ["/images/event-web3.jpg"],
        tags: ["Web3", "Blockchain", "Talk"],
        likeCount: 19,
        organizer: {
            name: "Hack Society",
            profileImage: "/images/hack-avatar.png",
            id: "user789",
        },
    },
];

export default function Page() {
    const [events, setEvents] = React.useState<Event[]>([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        setTimeout(() => {
            setEvents(hardcodedEvents);
            setLoading(false);
        }, 1000); // simulate fetch
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

            {events.length === 0 ? (
                <Typography variant="h6" color="gray">
                    No events found for this month.
                </Typography>
            ) : (
                events.map((event) => (
                    <Card
                        key={event.id}
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
                                            event.organizer.profileImage ||
                                            "/images/default-avatar.png"
                                        }
                                        alt={event.organizer.name}
                                        sx={{ width: 40, height: 40, cursor: "pointer" }}
                                        onClick={() =>
                                            router.push(`/users/${event.organizer.id}`)
                                        }
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
                                        {event.organizer.name}
                                    </Typography>
                                    <Typography variant="h6" component="div" color="white">
                                        {event.title}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>

                        {event.images.length > 0 ? (
                            <CardActionArea onClick={() => router.push(`/events/${event.id}`)}>
                                <CardMedia
                                    component="img"
                                    height="auto"
                                    sx={{ maxHeight: "45vh" }}
                                    image={event.images?.[0] || "/images/default-project.png"}
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
                                {event.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        color="primary"
                                        variant="filled"
                                    />
                                ))}
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                <ThumbUpIcon sx={{ color: "white", fontSize: 18 }} />
                                <Typography variant="body2" color="white">
                                    {event.likeCount} {event.likeCount === 1 ? "Like" : "Likes"}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                ))
            )}
        </Stack>
    );
}
