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

})