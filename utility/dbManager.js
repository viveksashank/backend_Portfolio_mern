const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:/WebileApps/sip', (error) => {
    if(error){
        console.error("Error connecting to datavase:")
    }else{
        console.log("Connected to SQLite");
    }
});
module.exports=db;