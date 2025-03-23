const users = [];

// This comment outlines the functions that will be implemented in this file:
// - addUser: to add a new user to the chat
// - removeUser: to remove a user from the chat
// - getUser: to retrieve a specific user's information
// - getUsersInRoom: to get all users in a specific chat room

const addUser = ({ id, username, room }) => {
  const cleanUsername = username?.trim().toLowerCase();
  const cleanRoom = room?.trim().toLowerCase();

  if (!cleanUsername || !cleanRoom) {
    return { error: "Username and room are required" };
  }

  if (
    users.find(
      (user) => user.room === cleanRoom && user.username === cleanUsername
    )
  ) {
    return { error: "Username is in use" };
  }

  const user = { id, username: cleanUsername, room: cleanRoom };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const user = users.find((user) => user.id === id);
  users = users.filter((user) => user.id !== id);
  return user;
};
