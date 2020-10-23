/// <reference types="cypress"/>

describe('Working with alerts...', () => {
    //Runs once before all tests
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })
    
    //Runs befire each test
    beforeEach(() => {
        cy.reload()
    })

    it('Alert...', () => {
        cy.get('#alert').click()
        cy.on('window:alert', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Alert Simples')
        })
    })
})