import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";
app.use(bodyParser.urlencoded({ extended: true }));
let users = [
  {
    user_id: 1,
    user_name: "John@gmail.com",
    phone: 1236726472,
    city: "London",
  },
];

// Get all users
app.get("/api/users", (req, res) => {
  if (users.length <= 0) {
    res.status(404).send("No users found");
  } else {
    res.json(users);
  }
});

// Posting a user
app.post("/api/users", (req, res) => {
  const { user_name, phone, city } = req.body;

  if (!user_name || !phone || !city) {
    res.sendStatus(400); // Bad request if required fields are missing
  } else {
    const newUser = {
      user_id: users.length + 1,
      user_name,
      phone,
      city,
    };
    users.push(newUser);
    res.status(201).json(newUser);
  }
});

// Get a user by ID
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const found = users.find((user) => user.user_id === id);

  if (!found) {
    res.status(404).send(`No user found for id ${id}`);
  } else {
    res.json(found);
  }
});

// Update user
app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { user_name, phone, city } = req.body;

  if (!user_name || !phone || !city) {
    res.status(400).send("Please provide all details to update user");
  } else {
    const foundIndex = users.findIndex((user) => user.user_id === id);

    if (foundIndex === -1) {
      res.status(404).send(`No user found for id ${id}`);
    } else {
      users[foundIndex] = {
        user_id: id,
        user_name,
        phone,
        city,
      };
      res.json(users[foundIndex]);
    }
  }
});

// Patch User
app.patch("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundIndex = users.findIndex((user) => user.user_id === id);

  if (foundIndex === -1) {
    res.status(404).send(`No user found for id ${id}`);
  } else {
    const { user_name, phone, city } = req.body;
    const updatedUser = {
      user_id: id,
      user_name: user_name || users[foundIndex].user_name,
      phone: phone || users[foundIndex].phone,
      city: city || users[foundIndex].city,
    };

    users[foundIndex] = updatedUser;
    res.json(updatedUser);
  }
});

// Delete User
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundIndex = users.findIndex((user) => user.user_id === id);

  if (foundIndex === -1) {
    res.status(404).json({ error: `User with id ${id} not found` });
  } else {
    users.splice(foundIndex, 1);
    res.sendStatus(200);
  }
});

// Delete All Users (Protected with masterKey)
app.delete("/api/users", (req, res) => {
  const userKey = req.query.key;

  if (userKey === masterKey) {
    users = [];
    res.sendStatus(200);
  } else {
    res.status(403).json({ error: "Unauthorized. Invalid key." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
