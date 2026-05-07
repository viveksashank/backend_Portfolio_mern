const express = require("express");
const app = express();
app.use(express.json());


const investorroutes = require("./routes/investorRoute");
const fundroutes = require("./routes/fundRoute");
const siproutes = require("./routes/sipRoute");


app.use("/api/investors", investorroutes);
app.use("/api/funds", fundroutes);
app.use("/api/sips", siproutes);

app.listen(3000, () => {
 console.log("Server is running on port 3000");
})