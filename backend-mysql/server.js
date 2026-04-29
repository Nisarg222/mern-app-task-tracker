require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/dbInit.js");

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MySQL", err);
    process.exit(1);
  });
