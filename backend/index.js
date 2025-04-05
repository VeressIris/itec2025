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
import { connectDb, createChatRoom } from "./utils.js";

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

  const chatRoomId = await createChatRoom(userId, db);

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
    chatRoom: chatRoomId,
    //image maybe?
  });

  return res.json({ message: "Added succesfuly" });
});

app.get("/getUser", async (req, res) => {
  const users = db.collection("users");

  const result = await users.findOne({ clerkId: req.query.userId });

  return res.json({ result });
});

app.get("/getEvent", async (req, res) => {
  const events = db.collection("events");

  const result = await events.findOne({ _id: new ObjectId(req.query.eventId) });

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
  const event = await events.findOne({ _id: new ObjectId(eventId) });

  const chatRooms = db.collection("chatRooms");
  const messages = db.collection("messages");
  const eventChatRoom = await chatRooms.findOne({ _id: event.chatRoom });

  // delete all messages from chatroom
  if (eventChatRoom.messages && eventChatRoom.messages.length > 0) {
    await messages.deleteMany({
      _id: { $in: eventChatRoom.messages.map((id) => id) },
    });
  }

  // delete chatroom
  await chatRooms.deleteOne({ _id: event.chatRoom });

  // delete event
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

// Chatroom features

app.get("/socket/auth", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  return res.json({ userId });
});

app.post("/addMessage", requireAuth(), async (req, res) => {
  const messages = db.collection("messages");
  const { userId } = getAuth(req);

  const chatRooms = db.collection("chatRooms");
  const chatRoomId = req.body.chatRoomId;

  const result = await messages.insertOne({
    sentBy: userId,
    text: req.body.message,
    dateSent: new Date(),
  });

  await chatRooms.updateOne(
    { _id: new ObjectId(chatRoomId) },
    { $push: { messages: result.insertedId } }
  );

  return res.json({ result });
});

app.get("/getChatroomMessages", async (req, res) => {
  const chatRooms = db.collection("chatRooms");
  const chatRoom = await chatRooms.findOne({
    _id: new ObjectId(req.query.chatRoomId),
  });
  
  const messages = db.collection("messages");
  const result = await messages
    .find({ _id: { $in: chatRoom.messages } })
    .toArray();
  return res.json({ result });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
