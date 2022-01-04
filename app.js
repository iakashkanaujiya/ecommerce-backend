require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const fileUploadRoutes = require("./routes/fileUpload");
const paymentRoutes = require("./routes/payment");

// Database connection
mongoose.connect(process.env.DB_URL, {
    dbName: "justpantry",
    user: "admin-akash",
    pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(
    () => {
        console.log("Sucessfully coneected to Database");
    }
).catch(() => {
    console.log("Opps! DB connection error");
});


const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/public", express.static("public"));

// My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", fileUploadRoutes);
app.use("/api", paymentRoutes);

// // starting the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
