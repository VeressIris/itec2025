import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Fab,
  CircularProgress,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { backendUrl } from "@/utils";
import { CurriculumType } from "@/types";

export default function MyCurriculum() {
  const [curriculums, setCurriculums] = useState<CurriculumType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleAdd = () => {
    router.push("/curricula/add-curriculum");
  };

  useEffect(() => {
    setLoading(true);
    const fetchCurriculums = async () => {
      try {
        const response = await fetch(`${backendUrl}/getCurricula`);
        const data = await response.json();
        console.log(data);
        setCurriculums(data.result);
      } catch (error) {
        console.error("Error fetching curriculums:", error);
      }
    };
    setLoading(false);

    fetchCurriculums();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        color="black"
        fontWeight="semibold"
        textAlign={"center"}
        style={{ marginBottom: "50px" }}
      >
        My Curricula
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {curriculums?.map((curriculum) => (
          <Grid key={curriculum._id}>
            <Card>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <PictureAsPdfIcon
                  sx={{ fontSize: 40, color: "#4617a3", mr: 2 }}
                />
                <Typography variant="h6">{curriculum.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAdd}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
