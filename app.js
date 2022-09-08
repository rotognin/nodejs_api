/**
 * Segunido o tutorial do vídeo da Rocketseat
 * https://youtu.be/fm4_EuCsQwg?t=3164
 */

const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs"); // FileSystem
const funcoes = require("./funcoes");

const app = express();

// middleware para receber requisições json
app.use(express.json());

// Criar as rotas
/*
app.get('/primeira-rota', (request, response) => {
    return response.status(200).send({mensagem: "Acessou a primeira rota mesmo"});
});
*/

// Criação do array dos produtos que irão ser "gravados"
let produtos = [];
fs.readFile("produtos.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        produtos = JSON.parse(data);
    }
});

/**
 * Rota apenas para teste
 */
app.get("/autor", (request, response) => {
    var nome = funcoes.autor();
    console.log(nome);
    return response.json({
        resultado: nome,
        mensagem: funcoes.mensagem(),
        valor: funcoes.calcular(4, 6)
    });
});

/**
 * Body => informações a serem recebidas
 * Params => Parâmetros que vierem na URL (parâmetro de rota): /produto/5 (ID do produto)
 * Query => Fazem parte da rota mas não são obrigatórios. /produto?id=45&preco=45
 */

app.post("/produtos", (request, response) => {
    // Nome e preço
    //const body = request.body;

    // "desestruturação" das informações que vierem no body
    const { nome, preco, cor } = request.body;
    //console.log("Produto: " + nome + ", Preço: " + preco);
    //console.log(cor);

    (cor == undefined) ? console.log("A cor não foi informada.") : console.log("Cor: " + cor);
    if (cor == undefined){
        return response.json({mensagem: "É necessário informar a cor!"});
    }

    const produto = {
        id: randomUUID(),
        nome,
        preco,
        cor
    };

    produtos.push(produto);

    arquivoProdutos();

    return response.json(produto);
});


app.get("/produtos", (request, response) => {
    return response.json(produtos);
});

app.get("/produtos/:id", (request, response) => {
    const { id } = request.params;
    const produto = produtos.find((produto) => produto.id === id);
    return response.json(produto);
});

app.put("/produtos/:id", (request, response) => {
    const { id } = request.params;
    const { nome, preco, cor } = request.body;

    const indice = produtos.findIndex((produto) => produto.id === id);
    //console.log(indice);

    if (indice < 0){
        return response.json({mensagem: "Produto não encontrado"});
    }

    if (nome != undefined) {
        if (produtos[indice].nome != nome){
            produtos[indice].nome = nome;
        }
    }

    if (preco != undefined) {
        if (produtos[indice].preco != preco){
            produtos[indice].preco = preco;
        }
    }

    if (cor != undefined) {
        if (produtos[indice].cor != cor){
            produtos[indice].cor = cor;
        }
    }

    arquivoProdutos();

    return response.json({mensagem: "Produto alterado com sucesso!"});
});

app.delete("/produtos/:id", (request, response) => {
    const { id } = request.params;
    const indice = produtos.findIndex((produto) => produto.id === id);

    if (indice == -1){
        return response.json({mensagem: "Produto não encontrado!"});
    }

    //produtos[indice].delete;
    const apagado = produtos.splice(indice, 1);
    const retorno = "Produto " + apagado[0].nome + " removido com sucesso!";

    arquivoProdutos();

    return response.json({mensagem: retorno});
});

function arquivoProdutos() {
    fs.writeFile("produtos.json", JSON.stringify(produtos), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Produto inserido com sucesso");
        }
    });
}

app.listen(3001, () => console.log("Servidor executando na porta 3001"));