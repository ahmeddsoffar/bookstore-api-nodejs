require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");
const bookRoutes = require("./routes/book-routes");

const app = express();
const PORT = process.env.PORT;

connectDB();

//When a client (like a frontend or API consumer) sends JSON data in the body of an HTTP request
//(like in POST or PUT requests), this line allows your server to read and access that data.
//It's a middleware that allows your server to read and access the JSON data sent by the client.
app.use(express.json());

app.use("/api/books", bookRoutes); //da el parent route /api/books/create-book

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
