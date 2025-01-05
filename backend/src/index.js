const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const bookingsRouter = require('./routes/bookings');
const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB', err);
});



app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use('/api/bookings', bookingsRouter);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});