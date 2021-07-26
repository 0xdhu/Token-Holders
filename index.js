const dotenv = require("dotenv");
dotenv.config();

const {
    TokenInfo,
    GetEvents
} = require('./src/tokenHolders.js')

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(async (conn) => {
    try {
      console.log(`Connected to ${conn.connection.db.databaseName}`);
      cronJob();
    } catch (error) {
        console.log(error.message)
    //   logger.errorLog(error);
    }
  })
  .catch((e) => {
    console.log(e.message)
  });




const cronJob = () => {
    // TokenInfo();
    GetEvents();
}