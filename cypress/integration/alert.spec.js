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

    it('Alert com Mock...', () => {
        const stub = cy.stub().as('alerta')
        cy.on('window:alert', stub)

        cy.get('#alert').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Alert Simples')
        })
        
    })
})