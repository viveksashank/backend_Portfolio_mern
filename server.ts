import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import investorroutes from "./routes/investorRoute";
import fundroutes from "./routes/fundRoute";
import siproutes from "./routes/sipRoute";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/investors", investorroutes);
app.use("/api/funds", fundroutes);
app.use("/api/sips", siproutes);


app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});