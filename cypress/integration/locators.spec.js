/// <reference types="cypress"/>

describe('Working with basic elements', () => {
    //Runs once before all tests
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })
    
    //Runs befire each test
    beforeEach(() => {
        cy.reload()
    })

    it('Usin jquery selctor...', () => {

        cy.get(':nth-child(1) > :nth-child(3) > [type="button"]')

        cy.get('table#tabelaUsuarios tbody > tr:eq(0) td:nth-child(3) > input')

        cy.get('[onclick*=\'Francisco\']') //adicionar escape \  or
        cy.get("[onclick*='Francisco']") //aspas duplas

        cy.get("#tabelaUsuarios td:contains('Doutorado'):eq(0) ~ td:eq(3) > input")
        cy.get("#tabelaUsuarios tr:contains('Doutorado'):eq(0) td:eq(6) input")
    })

    it('Using Xpath...', () => {
        cy.xpath("//input[contains(@onclick, 'Francisco')]")
        cy.xpath("//table[@id='tabelaUsuarios']//td[contains(., 'Francisco')]/..//input[@type='text']")
        cy.xpath("(//table[@id='tabelaUsuarios']//td[contains(., 'Doutorado')])[2]/..//input[@type='text']")
        cy.xpath("(//table[@id='tabelaUsuarios']//td[contains(., 'Doutorado')])[2]/..//input[@type='checkbox']")
        cy.xpath("//*[@data-test='data2']") 
        cy.xpath("//td[contains(., 'Usuario A')]/following-sibling::td[contains(., 'Mestrado')]/..//input[@type='text']").type('funciona')
    })

})