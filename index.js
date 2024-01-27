const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require("cors")
app.use(express.json());
app.use(cors())
morgan.token('postData', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
})

app.use(morgan(':method :url :status :response-time ms :postData'));
app.use(express.static('dist'))
// mongodb+srv://milosdrinjakovicc:<password>@cluster0.czn1uep.mongodb.net/
let phonebook = [
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


const requestLoggger = () => {
}


const requestLogger = (request,response,next) => {
  console.log('Method:',request.method)
  console.log('Path:',request.path)
  console.log('Body:',request.body)
  console.log('---')
  next()
}

morgan.token('postData',(req,res) => {
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
  return ''
})


const unknownEndPoint = (request,response) => {
  response.status(404).send({error: 'unknown endpoint'})
}




let date = new Date();

app.get("/", (request, response) => {
  response.send("<h2>Hello World</h2>");
});

app.get("/api/phonebook", (request, response) => {
  response.json(phonebook);
});

app.get("/api/phonebook/:id", (request, response) => {
  const id = Number(request.params.id);
  const contact = phonebook.find((contact) => contact.id === id);
  console.log(contact)
  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.post("/api/phonebook", (request, response) => {
  const body = request.body;
  if (!body || body.name === "" || body.number === "" || body.name === undefined) {
    return response
      .status(400)
      .json({ error: "Bad request empty request body" });
  } else if (phonebook.some((contact) => contact.name.toLowerCase().trim() === body.name.toLowerCase().trim())) {
    return response
      .status(409)
      .json({
        error: "Resource allready exists",
        message: `The contact with the given name of: ${body.name} - allready exists`,
      });
  }
  const contact = {
    name: body.name,
    number: body.number,
    id: Math.random() * 1000,
  };

  phonebook = phonebook.concat(contact);
  response.json(contact);
});

app.delete("/api/phonebook/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id)
  phonebook = phonebook.filter((contact) => contact.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;

app.get("/info", (request, response) => {
  response.send(
    `<p>${date}</p><p>Phonebook has info of ${phonebook.length} people</p>`
  );
});




app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
