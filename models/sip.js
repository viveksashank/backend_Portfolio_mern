const db = require("../utility/dbManager");

const users = [
    {
        email: "ram@gmail.com",
        password: "password123",
        loggedIn: false
    }
];

const loginUser = (email, password) => {
   const userIndex = users.findIndex(
    (u) => u.email === email && u.password === password
   );
   console.log(`User Index: ${userIndex}`);
   if(userIndex != -1)
   {
      users[userIndex] = {...users[userIndex], loggedIn: true};
   }
   return users[userIndex];
}

const logoutUser = () => {
    const userIndex = users.findIndex(
        (u) => u.email === email && u.loggedIn == true,
    );
    if(userIndex != -1)
    {
        users[userIndex] = {...users[userIndex], loggedIn: false};

    }
}


module.exports = {loginUser, logoutUser};