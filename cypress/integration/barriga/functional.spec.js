/// <reference types="cypress"/>

describe('Should test at functional level...', () => {
    //Runs once before all tests
    before(() => {
        cy.visit('https://barrigareact.wcaquino.me/')
        cy.get('.input-group > .form-control').type('fegodinho@godinho')
        cy.get(':nth-child(2) > .form-control').type('123456')
        cy.get('.btn').click()
        cy.get('.toast-message').should('contain', 'Bem vindo')
    })

    it('...', () => {
        
    })

})