const express = require("express");
const app = express();
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
const askRouter = require("./routes/ai"); 


app.get("/", (req, res) => {
  res.render("index");
});


app.use("/ask", askRouter);


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
