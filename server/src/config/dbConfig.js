const mongoose = require("mongoose");

module.exports = {
  // database connection logic
  dbConnect: async () => {
    try {
      const connectionInstance = await mongoose.connect(
        `${process.env.MONGO_URI}`
      );
      console.log(connectionInstance.connection.host);
    } catch (err) {
      console.log(`Error connecting database ${err}`);
      process.exit(1);
    }
  },
};
