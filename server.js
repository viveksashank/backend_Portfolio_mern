const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());

const investorroutes = require("./routes/investorRoute");
const fundroutes = require("./routes/fundRoute");
const siproutes = require("./routes/sipRoute");


app.use("/api/investors", investorroutes);
app.use("/api/funds", fundroutes);
app.use("/api/sips", siproutes);

app.listen(4000, () => {
 console.log("Server is running on port 4000");
})






