const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.set('trust proxy', true);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://www.gigzi.in",
  "https://gigziadmin.netlify.app",
  "https://gigzi.in",
  "https://admin.gigzi.in",
  "https://www.admin.gigzi.in",
  "exp://",
  "http://192.168"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for origin: " + origin));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const authroutes = require('./routes/V3/Authroute');
const adminEvent = require("./routes/Admin/EventRoute");
const adminArtist = require("./routes/Admin/ArtistRoute");
const adminDashboard = require("./routes/Admin/DashBoardRoute");
const adminUsers=require("./routes/Admin/UserRoute")
const adminOrders=require("./routes/Admin/OrderRoute")
const adminWallet=require("./routes/Admin/WalletRoute")
const booking = require("./routes/Client/bookingRoute");
const Artistslots = require("./routes/Artist/slotsRoutes");
const order = require("./routes/Client/OrderRoute");
const ArtistOrder = require("./routes/Artist/ArtistOrderRoute");

//Common Routes
app.use('/v3/auth/', authroutes);

//Admin Routes
app.use('/admin/eventCat/', adminEvent);
app.use('/admin/artist/', adminArtist);
app.use('/admin/dashBoard/', adminDashboard);
app.use('/admin/users/', adminUsers);
app.use('/admin/orders/', adminOrders);
app.use('/admin/wallet/', adminWallet);


// Client Routes
app.use('/client/booking/', booking);
app.use('/client/order/', order);

//Artist Routes
app.use('/artist/order/', ArtistOrder);
app.use('/artist/addSlots/', Artistslots);

const startServer = async () => {
  try {
    const mongoDB = process.env.MONGODB_URL;
    if (!mongoDB) throw new Error('Missing MONGODB_URL in env');

    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Gigzii server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
