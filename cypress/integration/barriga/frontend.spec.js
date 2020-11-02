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

    it.only('Should not create and account with same name...', () => {
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
        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Conta para movimentacoes')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso') 
        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')  
    })

    it('Should get balance...', () => {
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        //cy.wait(1000)
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value','Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação alterada com sucesso') 

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')
    })

    it('Should remove a transaction...', () => {
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso')
    })

})