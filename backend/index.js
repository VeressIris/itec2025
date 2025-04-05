import express from "express";
import cors from "cors";
import {
  clerkMiddleware,
  clerkClient,
  requireAuth,
  getAuth,
} from "@clerk/express";
import "dotenv/config";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { connectDb } from "./utils.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
connectDb(client);
const db = client.db("itec2025");

app.get("/", (req, res) => {
  res.send("Hello itec2025!");
});

app.post("/addUser", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);

  const user = await clerkClient.users.getUser(userId);
  const users = db.collection("users");

  const result = await users.insertOne({
    clerkId: userId,
    email: user.primaryEmailAddress.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    grade: req.body.grade,
    username: req.body.username,
    imageUrl: user.imageUrl,
  });

  return res.json({ result });
});

app.post("/addEvent", requireAuth(), async (req, res) => {
  const events = db.collection("events");
  const { userId } = getAuth(req);

  const user = await clerkClient.users.getUser(userId);
  events.insertOne({
    addedBy: {
      clerkId: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
    date: req.body.date,
    joinedBy: [userId],
    title: req.body.title,
    description: req.body.description,
    class: req.body.class,
    classTags: req.body.classTags,
    grade: req.body.grade,
    personLimit: req.body.personLimit || 30,
    //image maybe?
  });

  return res.json({ message: "Added succesfuly" });
});

app.get("/getUser", async (req, res) => {
  const users = db.collection("users");

  const result = await users.findOne({ clerkId: req.query.userId });

  return res.json({ result });
});

// get all upcoming events
app.get("/getEvents", async (req, res) => {
  const events = db.collection("events");
  const query = { date: { $gt: new Date().toISOString() } };
  const result = await events.find(query).toArray();

  return res.json({ result });
});

app.patch("/joinEvent", requireAuth(), async (req, res) => {
  const events = db.collection("events");

  const { userId } = getAuth(req);
  const eventId = req.query.eventId;

  const event = await events.findOne({ _id: new ObjectId(eventId) });
  if (event.joinedBy.length >= event.personLimit) {
    return res.status(400).json({ message: "Event is full" });
  }

  await events.updateOne(
    { _id: new ObjectId(eventId) },
    { $addToSet: { joinedBy: userId } }
  );

  return res.json({ message: "Joined event" });
});

// get upcoming events that have are either the same class, have the same tags or are for the same grade as a specific event
app.get("/getSimilarEvents", async (req, res) => {
  const events = db.collection("events");
  const event = await events.findOne({ _id: new ObjectId(req.query.eventId) });
  console.log(event);
  const query = {
    date: { $gt: new Date().toISOString() },
    $or: [
      { class: event.class },
      { classTags: event.classTags }, // change to classTags: { $in: event.classTags || [] } for handling arrays
      { grade: event.grade },
    ],
    _id: { $ne: new ObjectId(req.query.eventId) },
  };
  const result = await events.find(query).toArray();

  return res.json({ result });
});

app.delete("/deleteEvent", async (req, res) => {
  const events = db.collection("events");

  const eventId = req.query.eventId;
  const result = await events.deleteOne({ _id: new ObjectId(eventId) });

  return res.json({ result });
});

app.patch("/updateEvent", async (req, res) => {
  const events = db.collection("events");
  const eventId = req.query.eventId;
  const result = await events.updateOne(
    { _id: new ObjectId(eventId) },
    {
      $set: {
        date: req.body.date,
        title: req.body.title,
        description: req.body.description,
        class: req.body.class,
        classTags: req.body.classTags,
        grade: req.body.grade,
        personLimit: req.body.personLimit || 30,
      },
    }
  );
  return res.json({ result });
});

app.get("/getUserEvents", requireAuth(), async (req, res) => {
  const events = db.collection("events");
  const { userId } = getAuth(req);
  const query = { $or: [{ joinedBy: userId }, { "addedBy.clerkId": userId }] };
  const result = await events.find(query).toArray();

  return res.json({ result });
});

app.patch("/leaveEvent", requireAuth(), async (req, res) => {
  const events = db.collection("events");

  const { userId } = getAuth(req);
  const eventId = req.query.eventId;

  await events.updateOne(
    { _id: new ObjectId(eventId) },
    { $pull: { joinedBy: userId } }
  );

  return res.json({ message: "Left event" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
