import {db} from "../utility/dbManager";

interface User {
  email: string;
  password: string;
  loggedIn: boolean;
}

const users: User[] = [
  {
    email: "vivek@gmail.com",
    password: "vivek123",
    loggedIn: false,
  },
];

// LOGIN USER
const loginUser = (
  email: string,
  password: string
): User | undefined => {
  const userIndex = users.findIndex(
    (u) => u.email === email && u.password === password
  );

  console.log(`User Index: ${userIndex}`);

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      loggedIn: true,
    };
  }

  return users[userIndex];
};

// LOGOUT USER
const logoutUser = (email: string): User | undefined => {
  const userIndex = users.findIndex(
    (u) => u.email === email && u.loggedIn === true
  );

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      loggedIn: false,
    };

    return users[userIndex];
  }

  return undefined;
};

export { loginUser, logoutUser, User };