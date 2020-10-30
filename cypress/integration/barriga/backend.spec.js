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

        cy.request({
            url: '/contas',
            method: 'GET',
            headers: {Authorization: `JWT ${token}`},
            qs: {
                nome: 'Conta para alterar'
            }
        }).then(res => {
            cy.request({
                url: `/contas/${res.body[0].id}`,
                method: 'PUT',
                headers: {Authorization: `JWT ${token}`},
                body: {
                    nome: 'conta alterada via rest'
                }
            }).as('response')
        })    
        
        cy.get('@response').its('status').should('be.equal', 200)
    })

    it.only('Should not create and account with same name...', () => {
        cy.request({
            method: 'POST',
            headers: {Authorization: `JWT ${token}`},
            url: '/contas',
            body: {
                    nome: 'Conta mesmo nome'
                },
            failOnStatusCode: false
            }).as('response')
        
        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })       
    })

    it('Should create a transaction...', () => {
          
    })

    it('Should get balance...', () => {
        
    })

    it('Should remove a transaction...', () => {
        
    })

})