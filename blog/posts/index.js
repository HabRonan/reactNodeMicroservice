const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
const port = 4000;


const posts = {};


app.get('/posts', (req, res) => {
   res.send(posts)
});

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex'); 
    const { title } = req.body;
    posts[id] = {
        id, title
    };

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: {
        id, title
      }
    })

    res.status(201).send(posts[id]);
});


app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type)

  res.send({});
})

app.listen(port, () => {
  // console.log('v0.5')
  console.log('Listening on ' + port);
});