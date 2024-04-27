import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const users = [
  {
    user_id: 1,
    user_name: "John@gmail.com",
    phone: 1236726472,
    city: "London",
  },
  {
    user_id: 2,
    user_name: "Jasmine@gmail.com",
    phone: 1382782932323,
    city: "London",
  },
];

//get all users
app.get("/api/users", (req, res) => {
  if (users.length <= 0) {
    res.status(404).send("No users found");
  } else {
    res.json(users);
  }
});

//Posting a user
app.post("/api/users", (req, res) => {
  const { user_name, phone, city } = req.body;
  console.log(user_name);
  if (!user_name || !phone || !city) {
    res.sendStatus(400);
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

//get a UserByID
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const found = users.find((user) => user.user_id === id);
  if (!found) {
    res.status(404).send("No user found for id", id);
  } else {
    res.json(found);
  }
});

//Update user
app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { user_name, phone, city } = req.body;

  if (!user_name || !phone || !city) {
    res.status(400).send("Please provide all details to UPDATE user");
  } else {
    const foundIndex = users.findIndex((user) => user.user_id === id);

    if (foundIndex <= 0) {
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

// Delete User
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = users.findIndex((user) => user.user_id === id);
  if (searchIndex <= 0) {
    res.status(404).json({ error: `User with id: ${id} not found` });
  } else {
    users.splice(searchIndex, 1);
    res.sendStatus(200);
  }
});

//delete All Users
app.delete("/api/users", (req, res) => {
  const userKey = req.query.key;
  if (userKey === masterKey) {
    users = [];
    res.sendStatus(200);
  } else {
    res
      .status(404)
      .json({ error: `You are not authorized to perform this action.` });
  }
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
