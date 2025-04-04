import express from "express";
import cors from "cors";
import {
  clerkMiddleware,
  clerkClient,
  requireAuth,
  getAuth,
} from "@clerk/express";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(cors());
app.use(clerkMiddleware());

app.get("/test-protected", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);

  const user = await clerkClient.users.getUser(userId);

  return res.json({ user });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
