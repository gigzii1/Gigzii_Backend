const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();


dotenv.config();
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(
  cors({
    origin: '*',
  }),
);


// const mongoDB = process.env.MONGODB_URL;
// mongoose
//   .connect(mongoDB)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});