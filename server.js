const http = require("http");

http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'});
    //response.end("Meu primeiro servidor em NodeJS");
    
    if (request.url === '/produto'){
        response.end(JSON.stringify({
            nome: 'Sofá 4 lugares de canto',
            cor: 'Branco'
        }));
    }

    response.end(JSON.stringify({
        data: 'Olá mundão do NodeJS!!!',
        info: request.url
    }));

}).listen(3004, () => console.log("O servidor está rodando na porta 3004"));