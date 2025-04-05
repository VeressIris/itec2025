import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Fab,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useRouter } from "next/router";

const mockCurriculums = [
  { id: 1, title: "CV - Mihai.pdf" },
  { id: 2, title: "Project Experience.pdf" },
  { id: 3, title: "Academic Resume.pdf" },
];

export default function MyCurriculum() {
  const [curriculums, setCurriculums] = useState(mockCurriculums);
  const router = useRouter();

  const handleAdd = () => {
    router.push("/curricula/add-curriculum");
  };

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

      <Grid container spacing={3}>
        {curriculums.map((curriculum) => (
          <Grid key={curriculum.id}>
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
