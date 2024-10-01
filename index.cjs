// const PORT = 3001;

const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const app = express();
app.use(express.json());
app.use(cors());

morgan.token("data", (req, res) => {
    return req.method === "POST" ? JSON.stringify(req.body) : "";
})

app.use(morgan(":method :url :port :response-time :data"))

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

const generateID = () => {
    const maxID = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0
    return String(maxID + 1)
}


app.get("/", (request, response) => {
    response.send("HELLO")
})

app.get("/api/notes", (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter((note) => note.id !== id)
    response.status(204).end()

})

app.post("/api/notes", (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json(
            {
                error: "content missing"
            }
        )
    }

    const note = {
        content: body.content,
        id: generateID(),
        important: Boolean(body.important) || false
    }

    notes = notes.concat(note)
    // console.log(typeof(request.body.important))
    response.json(note)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})