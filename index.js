const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server Running On Port ${process.env.PORT}`);
});

module.exports = app;
