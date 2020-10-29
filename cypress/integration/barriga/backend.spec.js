/// <reference types="cypress"/>

describe('Should test at functional level...', () => {
    let token

    //Runs once before all tests
    before(() => {
        cy.getToken('fegodinho@godinho', '123456')
            .then(tkn => {
                token = tkn
            })
    })

    beforeEach(() => {
        cy.resetRest()
    })

    it('Should create an account...', () => {
        cy.request({
            method: 'POST',
            headers: {Authorization: `JWT ${token}`},
            url: '/contas',
            body: {
                    nome: 'Conta via rest'
                }
            }).as('response')       
        
        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
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