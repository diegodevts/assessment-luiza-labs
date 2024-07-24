# Orders loader

Esse projeto foi desenvolvido para a avaliação da empresa Luiza labs

## Tecnologias e metodologias utilizadas

**Back-end:** Node, Node Streams, Typescript, Vitest/jest

**Engenharia de software:** TDD (Test driven development), SOLID, Clean architecture

## Como executar o projeto

**Instalar as dependências:**

```console
npm install
```

(Certifique-se de ter colocado todas as credenciais no arquivo .env)

## Rodar as aplicações

**Produção**

```console
npm build
npm start
```

**Local**

```console
npm run dev
```

## Sobre a arquitetura do projeto

**Backend**

No backend eu optei pelo desenvolvimento utilizando a metodologia TDD - que é o desenvolvimento orientado a testes - o qual eu julgo
muito boa para projetos que tem propensão a escalabilidade, manutebilidade e disponibilidade, pelo fato de tenderem a ser aplicações críticas, cujas regras de negócio precisam possuir uma tolerância a falhas baixíssima em ambiente de produção. Fiz apenas testes de integração simples nos casos de uso. Como design pattern, eu optei pelo SOLID, o qual nos permite ter um controle e manutebilidade maior sobre uma aplicação totalmente desacoplada. Utilizei princípios de clean code como DRY, utilizando a estratégia de generic layers, pra não precisarmos repetir código, e o KISS, para mantermos a aplicação mais enxuta possível. Para a arquitetura, optei pela clean arquitecture, conhecida também como onion, separando regras de negócio por casos de uso. A aplicação tá bastante enxuta, ainda colocaria mais coisas, mas quis deixá-la o mais simples possível. Utilizei o armazenamento em disco mesmo, criando um json, pois a API de I/O do node é mais rápida do que chamando um banco de dados, e como estamos lidando com dados massivos, acredito que tenha sido uma boa escolha.

---

## Sobre a API

Sobre a API, ela possui duas rotas, uma de findAll com filtros, e a outra é pra processar o arquivo de texto e converter em JSON.

**[GET] /orders**

### Filtros possíveis:

**skip:** Quantidade de usuários a serem ignorados

**take:** Quantidade de usuários a serem carregados

**order_id:** Id de um pedido

**startDate:** Data mínima de quando os pedidos dos usuários ou de um usuário específico foram feitos. (formato de data: YYYY-MM-DD)

**finishDate:** Data máxima de quando os pedidos dos usuários ou de um usuário específico foram feitos. (formato de data: YYYY-MM-DD)

## Exemplo de retorno de API:

```javascript
{
    "message": "Ok.",
	"orders": [
		{
			"user_id": 88,
			"name": "Terra Daniel DDS",
			"orders": [
				{
					"date": "2021-09-09",
					"total": 3655.24,
					"order_id": 836,
					"products": [
						{
							"product_id": 3,
							"value": 1899.02
						},
						{
							"product_id": 1,
							"value": 1756.22
						}
					]
				}
            ]
        }
    ],
    "statusCode": 200
}

```

**[POST] orders/load**

Nessa rota, você precisará um arquivo no body como multipart/data.
O nome do arquivo é file mesmo.

## Exemplo de retorno de API:

```javascript
    {
	    "message": "The file was uploaded successfully.",
	    "statusCode": 201
    }
```
