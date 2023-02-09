const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { User } = require('./db');
const e = require('express');

const saltNumber = 6;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
  const newUser = await User.create(
    {username: req.body.username, 
    password: await bcrypt.hash(req.body.password, saltNumber)})

    const found = await User.findAll({where: {
      username: req.body.username
    }})
    if(found) {
      res.send(`successfully created user ${req.body.username}`);
    }
})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req,res, next) => {
   const found = await User.findAll({where: {
    username: req.body.username
  }}); 
  console.log(found[0].password);
  const isCorrect = await bcrypt.compare(req.body.password, found[0].password);
  if (isCorrect) {
    res.send(`successfully logged in user ${req.body.username}`)
  }
  else {
    res.send(`incorrect username or password`)
  }
}) 

//   try {
//   const found = await User.findAll({where: {
//     username: req.body.username
//   }});
//   if(found) {
//     const isCorrect = await bcrypt.compare(found.password, req.body.password)
//     if(isCorrect) {
//       res.send("correct");
//     } else {
//       res.send('incorrect password')
//     }
//   } else {
//     res.send('error')
//   }
//   res.send(found)
// } 
// catch (error) {
//   console.error(error);
// }
//   // if (found) {
//   //   const isCorrect = await bcrypt.compare(password, found.password);
//   // }
//   // if (isCorrect) {
//   //   res.send(`successfully logged in user ${req.body.username}`);
//   // }
//   // else {
//   //   res.send('incorrect username or password');
//   // }
// })
// we export the app, not listening in here, so that we can run tests
module.exports = app;
