const http = require('http');
const parseUrl = require('url')
const port = process.env.PORT || 1234;

let todo = [];

const sample = [
    {
        "title": "GO to the gym 1",
        "message": "iFitness gym at yaba"
    },
    {
        "title": "GO to the gym 2",
        "message": "iFitness gym at yaba"
    },
    {
        "title": "GO to the gym 3",
        "message": "iFitness gym at yaba"
    }
]

const newSmaple = sample.filter((_, i) => (i !== 0))

console.log(newSmaple)


http.createServer((request, response) => {
    const url = request.url
    console.log(url)

    // if (url === '/') {
    //     res
    //     return
    // }

    if (url === "/get-todo") {
        if (request.method !== "GET") {
            response.writeHead(404, { "Content-Type": "application/json" })
            response.end()
            return
        }

        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ success: true, message: "Task has been fetched", payload: todo }))
        response.end()

        return
    }

    if (url.includes("/delete-task")) {
        const { id } = parseUrl.parse(request.url, true).query;

        if (request.method !== "DELETE") {
            response.writeHead(404, { "Content-Type": "application/json" })
            response.end()
            return
        }

        const newTodo = todo.filter((_, i) => (i.toString() != id.toString()))

        // console.log(newTodo, id)
        todo = newTodo

        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.write(JSON.stringify({ success: true, message: "Task has been fetched", payload: newTodo }))
        response.end()

        return
    }

    if (url === "/add-task") {
        if (request.method !== "POST") {
            response.writeHead(404, { "Content-Type": "application/json" })
            response.end()
            return
        }


        request.on('data', function (data) {
            const body = JSON.parse(data)
            // console.log(body)

            if (!body?.title) {
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.write(JSON.stringify({ success: false, message: "Kindly provide a title for your task" }))
                response.end()
                return
            }

            if (!body?.message) {
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.write(JSON.stringify({ success: false, message: "Kindly provide a message for your task" }))
                response.end()
                return
            }

            todo.push(body)

            request.on('end', function () {
                // console.log(body)
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.write(JSON.stringify({ success: true, message: "Task has been created", payload: todo }))
                response.end()

            })

        })
        return
    }
    response.end();
}).listen(port, () => {
    console.log(`listening on port:${port}`);
})