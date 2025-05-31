const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const mongoose =require('mongoose');


dotenv.config();

const allowedOrigins = [
  "http://localhost:3000", // for web dev
  "http://localhost:5173", // for Vite or React dev
  "https://gigzi.in",      // your live frontend
  "exp://*",               // for React Native if using Expo Go
  "http://192.168.*.*",    // optional for LAN React Native
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
const authroutes = require('./routes/V3/Authroute');
const adminEvent=require("./routes/Admin/EventRoute")
const adminUsers=require("./routes/Admin/UserRoute")
const booking=require("./routes/Client/bookingRoute")
const Artistslots=require("./routes/Artist/slotsRoutes")
const order=require("./routes/Client/OrderRoute")

app.use('/v3/auth/', authroutes);
app.use('/admin/eventCat/', adminEvent);
app.use('/admin/users/', adminUsers);
app.use('/client/booking/', booking);
app.use('/artist/addSlots/', Artistslots);
app.use('/client/order/', order);

const mongoDB = process.env.MONGODB_URL;

mongoose.connect(mongoDB)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Gigzii server  is running on port ${PORT}`);
});