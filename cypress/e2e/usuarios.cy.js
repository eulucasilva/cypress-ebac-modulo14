/// <reference types="cypress"/>
import contrato from '../contratos/usuarios.contratos.js'

describe('Teste de API em Usuários', () => {

    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {
            token = tkn
        })
    });

    it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios',
        }).should((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('usuarios');
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        let usuario = 'Usuario EBAC ' + Math.floor(Math.random() * 100000000);
        let email = 'teste' + Math.floor(Math.random() * 100000000) + '@ebac.com';
        cy.cadastrarUsuario(token, usuario, email, 'senha123', 'true').should((response) => {
            expect(response.status).to.equal(201);
            expect(response.body.message).to.equal('Cadastro realizado com sucesso');
        });
    });

    it('Deve validar um usuário com email inválido', () => {
        let usuario = 'Usuario Invalido ' + Math.floor(Math.random() * 100000000);
        cy.cadastrarUsuario(token, usuario, 'emailinvalido', 'senha123', 'true').should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.email).to.equal('email deve ser um email válido');
        })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let usuario = 'Usuario Editado ' + Math.floor(Math.random() * 100000000);
        let email = 'teste' + Math.floor(Math.random() * 100000000) + '@ebac.com';

        cy.cadastrarUsuario(token, usuario, email, 'senha123', 'true').then(response => {
            let id = response.body._id;
            let novoEmail = 'editado' + Math.floor(Math.random() * 100000000) + '@ebac.com'; // Novo email único

            cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                headers: { authorization: token },
                body: {
                    "nome": "Usuario Editado Novamente",
                    "email": novoEmail, // Usando o email único gerado
                    "password": "novaSenha123",
                    "administrador": "true"
                }
            }).should(response => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal("Registro alterado com sucesso");
            })
        })
    });


    it('Deve deletar um usuário previamente cadastrado', () => {
        let usuario = 'Usuario a ser Excluido ' + Math.floor(Math.random() * 100000000);
        cy.cadastrarUsuario(token, usuario, 'excluir@ebac.com', 'senha123', 'true').then(response => {
            let id = response.body._id;
            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
                headers: { authorization: token },
            }).should((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal('Registro excluído com sucesso');
            })
        })
    });

});
