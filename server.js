const app = require('./app');
const mongoose = require('mongoose');


// STATIC VARIABLE
const PORT = process.env.PORT;
const MONGO_URL = process.env.DATABASE_URI;
const MONGO_PASSWORD = process.env.DATABASE_PASSWORD;

// Connect to db
const DB = MONGO_URL.replace("<password>", MONGO_PASSWORD);
mongoose.connect(DB)
  .then(() => {
    console.log('Connected successfully.');
  })
  .catch((err) => {
    console.log('Something went wrong in connection.', err.code, '\n', err.message);
  });

// Server listening ....
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});