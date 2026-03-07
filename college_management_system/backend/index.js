require("dotenv").config();

console.log("Loaded MONGO_URL:", process.env.MONGO_URL);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Routes = require("./routes/route.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

app.use('/api', Routes);


app.listen(PORT, () => {
  console.log(`🔥 Server started on port ${PORT}`);
});
