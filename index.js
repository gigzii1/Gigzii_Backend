const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const mongoose =require('mongoose');


dotenv.config();
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);


const authroutes = require('./routes/V3/Authroute');
const adminEvent=require("./routes/Admin/EventRoute")
const adminUsers=require("./routes/Admin/UserRoute")
const booking=require("./routes/Client/bookingRoute")
const Artistslots=require("./routes/Artist/slotsRoutes")

app.use('/v3/auth/', authroutes);
app.use('/admin/eventCat/', adminEvent);
app.use('/admin/users/', adminUsers);
app.use('/client/booking/', booking);
app.use('/artist/addSlots/', Artistslots);

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