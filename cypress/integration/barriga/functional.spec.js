/// <reference types="cypress"/>

import loc from '../../support/locators'
import '../../support/commands.Contas'

describe('Should test at functional level...', () => {
    //Runs once before all tests
    before(() => {
        cy.login('fegodinho@godinho', '123456')
        cy.resetApp()
    })

    it('Should create an account...', () => {
        cy.acessarMenuConta()
        cy.inserirConta('Conta de teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account...', () => {
        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.XP_BTN_ATERAR).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso')
    })

})