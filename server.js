const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/Book');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/bookstore')
.then(() => {
  console.log('MongoDB connected');

  // Add initial data
  const initialData = [
    {
      name: "Harry Potter and the Order of the Phoenix",
      img: "https://bit.ly/2IcnSwz",
      summary: "Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry."
    },
    {
      name: "The Lord of the Rings: The Fellowship of the Ring",
      img: "https://bit.ly/2tC1Lcg",
      summary: "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed."
    },
    {
      name: "Avengers: Endgame",
      img: "https://bit.ly/2Pzczlb",
      summary: "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America, and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe."
    }
  ];

  initialData.forEach(async (data) => {
    const book = new Book(data);
    try {
      await book.save();
    } catch (error) {
      console.log('Error adding initial data:', error);
    }
  });

})
.catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// CREATE
app.post('/books', async (req, res) => {
    const book = new Book(req.body);
    try {
      await book.save();
      res.status(201).send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // READ all
  app.get('/books', async (req, res) => {
    try {
      const books = await Book.find({});
      res.status(200).send(books);
    } catch (error) {
      res.status(500).send();
    }
  });
  
  // READ one by ID
  app.get('/books/:id', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).send();
      }
      res.send(book);
    } catch (error) {
      res.status(500).send();
    }
  });
  
  // UPDATE
  app.patch('/books/:id', async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!book) {
        return res.status(404).send();
      }
      res.send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // DELETE
  app.delete('/books/:id', async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).send();
      }
      res.send(book);
    } catch (error) {
      res.status(500).send();
    }
  });