/// <reference types="cypress"/>

import loc from '../../support/locators'
import '../../support/commands.Contas'
import buildEnv from '../../support/buildEnv'

describe('Should test at frontend level...', () => {
    //Runs once before all tests
    after(() => {
        cy.clearLocalStorage()
    })

    beforeEach(() => {
        buildEnv()
        cy.login('fegodinho@godinho', 'XXXXXX')  
        cy.get(loc.MENU.HOME).click()
        // cy.resetApp()
    })

    it('Should test responsivess...', () => {
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]').should('exist')
            .and('not.be.visible')

        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]').should('exist')
            .and('not.be.visible')

        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')    
    })

    it('Should create an account...', () => {    
        cy.route({
            method: 'POST',
            url: '/contas',
            response: {
                id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1
            }                     
        }).as('inserirConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                {id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1}
            ]            
        }).as('contasSaved')

        cy.inserirConta('Conta de teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account...', () => {
        cy.route({
            method: 'PUT',
            url: '/contas/**', //** para aceitar qualquer ID
            response: [
                {id: 1, nome: 'Conta alterada', visivel: true, usuario_id: 1}
            ]            
        }).as('contaAlterada')

        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.FN_XP_BTN_ATERAR('Carteira')).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso')
    })

    it('Should not create and account with same name...', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: {"error": "Já existe uma conta com esse nome!"},
                status: 400                   
        }).as('inserirContaRepetida')

        cy.acessarMenuConta()
        cy.inserirConta('Conta mesmo nome')
        cy.get(loc.MESSAGE).should('contain', 'code 400')
    })

    it('Should create a transaction...', () => {
        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: {"id":289754,"descricao":"aasasa","envolvido":"sasa","observacao":null,"tipo":"REC","data_transacao":"2020-11-07T03:00:00.000Z","data_pagamento":"2020-11-07T03:00:00.000Z","valor":"1222.00","status":true,"conta_id":314079,"usuario_id":10719,"transferencia_id":null,"parcelamento_id":null}
        })

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movimentacaoSalva'
        })
        
        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Banco')
        cy.get(loc.MOVIMENTACAO.STATUS).click() 
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso')
        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')  
    })

    it('Should get balance...', () => {
        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 289757,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2020-11-07T03:00:00.000Z",
                "data_pagamento": "2020-11-07T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 319155,
                "usuario_id": 10719,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response: {
                "conta": "Conta para saldo",
                "id": 289757,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2020-11-07T03:00:00.000Z",
                "data_pagamento": "2020-11-07T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 319155,
                "usuario_id": 10719,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '100,00')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        //cy.wait(1000)
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value','Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação alterada com sucesso')

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [{
                conta_id: 999,
                conta: 'Carteira',
                saldo: '4034.00'
            },
            {
                conta_id: 9909,
                conta: 'Banco',
                saldo: '10000000.00'
            }]
        }).as('saldoFinal')

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '4.034,00')
    })

    it('Should remove a transaction...', () => {
        cy.route({
            method: 'DELETE',
            url: '/transacoes/**',
            response: {},
            status: 204
        }).as('del')
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso')
    })

    it('Should validate data to create an account...', () => {    
        cy.route({
            method: 'POST',
            url: '/contas',
            response: {
                id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1
            },
            onRequest: req => {
                expect(req.request.body.nome).to.be.empty
                expect(req.request.headers).to.have.property('Authorization')
            }
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                {id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1}
            ]            
        }).as('contasSaved')

        cy.inserirConta('{CONTROL}')
        //cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should validate data to create an account using stub...', () => {  
        const reqStub = cy.stub()  
        cy.route({
            method: 'POST',
            url: '/contas',
            response: {
                id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1
            },
            onRequest: reqStub
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                {id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1}
            ]            
        }).as('contasSaved')

        cy.inserirConta('{CONTROL}')
        cy.wait('@saveConta').then(() => {
            expect(reqStub.args[0][0].request.body.nome).to.be.empty
            expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
        })
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should test colors...', () => {
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                {"conta":"Conta para movimentacoes","id":289755,"descricao":"Receita paga","envolvido":"AAA","observacao":null,"tipo":"REC","data_transacao":"2020-11-07T03:00:00.000Z","data_pagamento":"2020-11-07T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":319153,"usuario_id":10719,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta com movimentacao","id":289756,"descricao":"Receita pendente","envolvido":"BBB","observacao":null,"tipo":"REC","data_transacao":"2020-11-07T03:00:00.000Z","data_pagamento":"2020-11-07T03:00:00.000Z","valor":"-1500.00","status":false,"conta_id":319154,"usuario_id":10719,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":289757,"descricao":"Despesa paga","envolvido":"CCC","observacao":null,"tipo":"DESP","data_transacao":"2020-11-07T03:00:00.000Z","data_pagamento":"2020-11-07T03:00:00.000Z","valor":"3500.00","status":true,"conta_id":319155,"usuario_id":10719,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":289758,"descricao":"Despesa pendente","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2020-11-07T03:00:00.000Z","data_pagamento":"2020-11-07T03:00:00.000Z","valor":"-1000.00","status":false,"conta_id":319155,"usuario_id":10719,"transferencia_id":null,"parcelamento_id":null}
            ]
        })
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita pendente')).should('have.class', 'receitaPendente')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa paga')).should('have.class', 'despesaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa pendente')).should('have.class', 'despesaPendente')
    })   

})