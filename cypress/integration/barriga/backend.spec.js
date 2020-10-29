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
        .then(token => {
            cy.request({
                method: 'POST',
                headers: {Authorization: `JWT ${token}`},
                url: 'https://barrigarest.wcaquino.me/contas',
                body: {
                    nome: 'Conta via rest'
                }
            }).as('response')
        })
        
        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
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