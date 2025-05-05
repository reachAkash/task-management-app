const { app } = require("./src/app");
const { dbConnect } = require("./src/config/dbConfig");
require("dotenv").config();

const port = process.env.PORT || 4000;

// database connection
dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening at port : ${port}`);
    });
  })
  .catch((err) => console.log(err));
