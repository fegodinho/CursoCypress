/// <reference types="cypress"/>

describe('Should test at functional level...', () => {
    //Runs once before all tests
    before(() => {
        //cy.login('fegodinho@godinho', '123456')
        //cy.resetApp()
    })

    beforeEach(() => {
        //cy.get(loc.MENU.HOME).click()
    })

    it('Login...', () => {
        cy.request({
            method: 'POST',
            url: 'https://barrigarest.wcaquino.me/signin',
            body: {
                email: "fegodinho@godinho",
                senha: "123456",
                redirecionar: false
            }
        }).its('body.token').should('not.be.empty')
    })

    it('Should create an account...', () => {
        
    })

    it('Should update an account...', () => {
        
    })

    it('Should not create and account with same name...', () => {
        
    })

    it('Should create a transaction...', () => {
          
    })

    it('Should get balance...', () => {
        
    })

    it('Should remove a transaction...', () => {
        
    })

})