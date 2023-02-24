// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://karthik:tv4G3v0W5K7NnpL3@cluster0.ezaqp4z.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema for data model
const schema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

// Create model based on schema
const User = mongoose.model('User', schema);

// Define routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;
    await user.save();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    await user.delete();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Start server
app.listen(5000, () => console.log('Server listening on port 5000'));
