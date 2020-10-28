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

    it('Should creat an account...', () => {
        cy.get('[data-test=menu-settings]').click()
        cy.get('[href="/contas"]').click()
        cy.get('[data-test=nome]').type('Conta de teste')
        cy.get('.btn').click()
        cy.get('.toast-message').should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account...', () => {
        cy.get('[data-test=menu-settings]').click()
        cy.get('[href="/contas"]').click()
        cy.xpath("//table//td[contains(., 'Conta de teste')]/..//i[@class='far fa-edit']").click()
        cy.get('[data-test=nome]')
            .clear()
            .type('Conta alterada')
        cy.get('.btn').click()
        cy.get('.toast-message').should('contain', 'Conta atualizada com sucesso')
    })

})