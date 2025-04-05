export async function connectDb(client) {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

export async function createChatRoom(creatorId, db) {
  const chatRooms = db.collection("chatRooms");

  const result = await chatRooms.insertOne({
    members: [creatorId],
    messages: [],
  });

  return result.insertedId;
}
