import { backendUrl } from "@/utils";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Event() {
  const router = useRouter();

  const [eventDetails, setEventDetails] = useState<{
    title: string;
    description: string;
    personLimit: number;
    date: Date;
    class: string;
    classTags: string[];
    grade: string;
    _id: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!router.query.id) return;
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
        setEventDetails(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [router.query.id]);

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
          <div>
            <h1>{eventDetails.title}</h1>
            <p>{eventDetails.description}</p>
            <p>Date: {new Date(eventDetails.date).toLocaleDateString()}</p>
            <p>Class: {eventDetails.class}</p>
            <p>Grade: {eventDetails.grade}</p>
            <p>Person Limit: {eventDetails.personLimit}</p>
          </div>
        )}
        {!loading && !eventDetails && <p>No event found</p>}
      </div>
    </div>
  );
}
