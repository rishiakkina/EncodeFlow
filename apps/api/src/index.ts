import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(routes);

app.get("/", (req, res) => {
  res.json({ name: "encodeflow-api", status: "ok" });
});

export default app;