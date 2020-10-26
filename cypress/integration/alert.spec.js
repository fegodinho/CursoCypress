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

    it.only('Alert...', () => {
        // cy.get('#alert').click()
        // cy.on('window:alert', msg => {
        //     console.log(msg)
        //     expect(msg).to.be.equal('Alert Simples')
        // })
        cy.clickAlert('#alert', 'Alert Simples')
    })

    it('Alert com Mock...', () => {
        const stub = cy.stub().as('alerta')
        cy.on('window:alert', stub)

        cy.get('#alert').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Alert Simples')
        })
        
    })

    it('Confirm...', () => {
        cy.get('#confirm').click()
        cy.on('window:confirm', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Confirm Simples')
        })
        cy.on('window:alert', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Confirmado')
        })
    })

    it('Confirm negado...', () => {
        cy.get('#confirm').click()
        cy.on('window:confirm', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Confirm Simples')
            return false //clica no cancelar
        })
        cy.on('window:alert', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Negado')
        })
    })

    it('Prompt...', () => {
        
        cy.window().then(win => {
            cy.stub(win, 'prompt').returns('42')
        })

        cy.on('window:confirm', msg => {
            console.log(msg)
            expect(msg).to.be.equal('Era 42?')
        })
        cy.on('window:alert', msg => {
            console.log(msg)
            expect(msg).to.be.equal(':D')
        })

        cy.get('#prompt').click()
    })

    it('Validando mensagens...', () => {

        const stub = cy.stub().as('alerta')
        cy.on('window:alert', stub)
        cy.get('#formCadastrar').click()
            .then(() => {
                expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio')
            })
        
        cy.get('#formNome').type('Felipe')
        cy.get('#formCadastrar').click()
            .then(() => {
                expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio')
            })
        
        cy.get('[data-cy=dataSobrenome]').type('Godinho')
        cy.get('#formCadastrar').click()
            .then(() => {
                expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio')
            })
        
        cy.get('#formSexoMasc').click()
        cy.get('#formCadastrar').click()

        cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!')

    })
})