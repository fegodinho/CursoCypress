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

    it.only('uso to timeout...', () => {

        // cy.get('#buttonDelay').click()
        // //timeout de 1s, o default do cypress é de 4s
        // cy.get('#novoCampo', {timeout: 1000}).should('exist')

        // cy.get('#buttonListDOM').click()
        // //segura o fluxo por 5s, sempre
        // cy.wait(5000)
        // cy.get('#lista li span')
        //     .should('contain', 'Item 2')

        cy.get('#buttonListDOM').click()
        cy.get('#lista li span',)
            .should('have.length', 1)
        cy.get('#lista li span',)
            .should('have.length', 2)
    })

    it.only('Click retry...', () => {
        cy.get('#buttonCount')
            .click()
            .click()
            //o comando anterior CLick nao é re-executado quando uma assertiva falha
            .should('have.value', '111')
    })

    it.only('Should vs Then...', () => {
        cy.get('#buttonListDOM').click()
        //o then espera e depois executa
        cy.get('#lista li span',).then($el => {
            console.log($el)
            expect($el).to.have.length(1)
        })

        //o should é executado várias vezes até ser satisfeito
        cy.get('#lista li span',).then($el => {
            console.log($el)
            expect($el).to.have.length(1)
        })
            
    })
    
})