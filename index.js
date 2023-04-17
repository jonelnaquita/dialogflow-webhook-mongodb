const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Set up express app
const app = express();

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://jonelnaquita12:Jhownie122514@dialogflow-mongodb.32bhmrs.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.log(err));


// Define a schema for the data we want to save
const conversationSchema = new mongoose.Schema({
  queryText: String,
  fulfillmentText: String,
});

// Create a new model using the schema
const Conversation = mongoose.model('Conversation', conversationSchema, 'responses');

// Define a route for incoming webhook requests
app.post('/webhook', (req, res) => {
  const queryText = req.body.queryResult.queryText;
  const fulfillmentText = req.body.queryResult.fulfillmentText;

  // Create a new conversation document and save it to the database
  const conversation = new Conversation({ queryText, fulfillmentText });
  conversation.save()
    .then(() => console.log('Conversation saved to database'))
    .catch(err => console.log(err));

  res.status(200).json({ message: 'Webhook received' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));