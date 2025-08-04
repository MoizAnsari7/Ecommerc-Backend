const express = require("express");
const cors = require("cors");
const route = require("./routes/routes");
const morgan = require("morgan");
const dbconnect = require("./config/databse");
const fileUpload = require("express-fileupload");
const cloudinaryConnect = require("./config/cloudinary");

require("dotenv").config();

const app = express();
app.use(morgan('combined'));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/temp'
}));

app.use(express.json());
app.use(cors());
app.use("/api", route); 
app.use(morgan('combined'));

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

dbconnect();
cloudinaryConnect();

app.listen(process.env.PORT_NO, ()=>{
    console.log(`server started at ${process.env.PORT_NO}`);
})