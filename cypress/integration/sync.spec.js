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

    it.only('Deve fazer retries...', () => {
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo').should('not.exist')
        cy.get('#novoCampo') //não encadear assertivas opostas, separe-as:  por isso o should not exist está acima
            .should('exist') //o cypress reexecuta todas as assertivas em caso de falha
            .type('funciona')
    })

    it.only('Uso do find...', () => {
        cy.get('#buttonList').click()
        cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 1')
        //se uma assertiva falha, o comando anterior é re-executado, porem neste caso, o find estava
        //atrelado ao escopo do get que não foi re-executado e portanto o item da lista nao foi encontrado
        //a solucao foi separar os comandos num novo escopo de modo que o get refaça a busca pelo elemento
        // cy.get('#lista li')
        //     .find('span')
        //     .should('contain', 'Item 2')
        cy.get('#lista li span')
            .should('contain', 'Item 2')
    })
    
})