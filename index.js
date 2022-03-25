const express = require("express");
const morgan = require('morgan')
const cors = require('cors')
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors())

app.use(express.static('build'))

app.use(express.json());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body", 
  )
);

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));

  if (person) {
    return res.json(person);
  }

  res.status(404).json({ message: "not found" });
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res
      .status(405)
      .json({ message: "both name and number have to be provided" });
  }

  if (persons.find((person) => person.name === body.name)) {
    console.log("test")
    return res.status(200).json({ message: "name must be unique" });
  }

  const id = Math.floor(Math.random() * 999);
  const newPerson = { id, name: body.name, number: body.number };
  persons = persons.concat(newPerson);
  res.json({ message: "person added" });
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log("Server is listening");
});
