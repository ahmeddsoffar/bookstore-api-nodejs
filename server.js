//Security: Keeps secrets out of your source code (never push .env to GitHub).
//Configurability: Easily switch settings for development, testing, and production.
//Convenience: Central place to manage environment-specific variables.
require("dotenv").config();

console.log("Loaded ENV variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGODB_URI);
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

const express = require("express");
const connectDB = require("./database/db");
const bookRoutes = require("./routes/book-routes");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const uploadImageRoutes = require("./routes/image-routes");
const categoryRoutes = require("./routes/category-routes");

const app = express();
const PORT = process.env.PORT;

connectDB(); // function to connect to the database

//When a client (like a frontend or API consumer) sends JSON data in the body of an HTTP request
//(like in POST or PUT requests), this line allows your server to read and access that data.
//It's a middleware that allows your server to read and access the JSON data sent by the client.
app.use(express.json());

app.use("/api/books", bookRoutes); //da el parent route /api/books/create-book
app.use("/api/auth", authRoutes); //da el parent route /api/auth/register
app.use("/api/home", homeRoutes); //da el parent route /api/home/home
app.use("/api/admin", adminRoutes); //da el parent route /api/admin/admin
app.use("/api/image", uploadImageRoutes); //da el parent route /api/image/upload
app.use("/api/categories", categoryRoutes); // categories endpoints

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
