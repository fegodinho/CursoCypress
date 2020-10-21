/// <reference types="cypress"/>

describe('Esperas...', () => {

    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })
    
    //Runs befire each test
    beforeEach(() => {
        cy.reload()
    })

    it('Deve aguardar elemento estar disponivel...', () => {
        cy.get('#novoCampo').should('not.exist')
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo').should('not.exist')
        cy.get('#novoCampo').should('exist')
        cy.get('#novoCampo').type('funciona')
    })
    
})