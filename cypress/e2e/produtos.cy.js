/// <reference types="cypress"/>
import contrato from '../contratos/produtos.contratos'

describe('Teste de API em Produtos', () => {

    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {
            token = tkn
        })
    });

    it('Deve validar contrato de produtos com sucesso', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar produtos com sucesso - GET', () => {
        cy.request({
            method: 'GET',
            url: 'produtos',
        }).should((response) => {
            expect(response.status).equal(200);
            expect(response.body).to.have.property('produtos')
        })
    });

    it('Deve cadastrar produto com sucesso - POST', () => {
        let produto = 'Produto EBAC ' + Math.floor(Math.random() * 100000000)
        cy.cadastrarProduto(token, produto, 369, 'Produto EBAC', 238).should((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de produto cadastrado repetidamente - POST', () => {
        cy.cadastrarProduto(token, 'Samsung 60 polegadas', 2000, 'TV', 189).should((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });

    it('Deve editar um produto com sucesso - PUT', () => {
        let produto = 'Produto EBAC Editado ' + Math.floor(Math.random() * 100000000)
        cy.cadastrarProduto(token, produto, 369, 'Produto EBAC Editado', 238).then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": produto,
                    "preco": 1001,
                    "descricao": "Produto Editado",
                    "quantidade": 471
                  }
            }).should(response => {
                expect(response.body.message).to.equal("Registro alterado com sucesso")
                expect(response.status).to.equal(200)
            })
        })
    });

    it('Deve excluir um produto com sucesso', () => {
        cy.cadastrarProduto(token, 'Produto EBAC a ser excluido', 708, 'Produto EBAC Excluido', 101).then( response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {authorization: token},
            }).should((response) => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });
});