import express from "express";
import weatherRouter from "./weather.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/weather", weatherRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/info", (req, res) => {
    res.status(200).json({
        name: "This is a weather service api",
        version: "1.0.0",
        endpoints: ["/api/weather/:city", "/api/greet/:name", "/api/data"],
    });
});

app.get("/api/status", (req, res) => {
    res.status(200).json({status: "Working"});
});

app.get("/docs", (req, res) => {
    res.redirect("/api/info");
});

app.get("/api/greet/:name", (req, res) => {
    res.status(200).json(req.params.name);
});

app.route("/api/data").get((req, res) => {
    res.status(200).json({route: "one path, multiple methods"});
}).post((req, res) => {
    res.status(201).json({route: "here's a post method under the same path"});
});

app.listen(PORT, () => {
    console.log("Server is listening on port 3000")
});