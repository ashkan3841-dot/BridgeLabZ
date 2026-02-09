const http = require("http");

let todos = [];
let idx = 1;

const server = http.createServer((req, res) => {
  console.log(req.method);
  console.log(req.url);
  if (req.method === "GET" && req.url === "/todos") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(todos));
  } else if (req.method === "POST" && req.url === "/todos") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const data = JSON.parse(body);

      const newTodo = {
        id: idx++,
        title: data.title,
      };

      todos.push(newTodo);
      res.writeHead(201, { "content-type": "application/json" });
      res.end(JSON.stringify(newTodo));
    });
  } else if (req.method === "PUT" && req.url === "/todos") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const data = JSON.parse(body);
      const todo = todos.find((t) => t.id === Number(data.id));
      todo.title = data.title;
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(todo));
    });
  } else if (req.method === "DELETE" && req.url === "/todos") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const data = JSON.parse(body);
      const idx = todos.findIndex((t) => t.id === Number(data.id));
      const deleteTodo = todos.splice(idx, 1)[0];

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(deleteTodo));
    });
  } else {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Route not found");
  }
});

server.listen(3000, () => {
  console.log("Server is running");
});
