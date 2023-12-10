describe('template spec', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    it('guest download map', () => {
        cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

        cy.wait(500);

        cy.contains('Continue as Guest').click()

        cy.url().should('include', "/mapcards")

        cy.wait(1000); 


        cy.contains(".map-list-name", "SA").click();

        cy.wait(1000); 


        cy.get('.downloadButton').click();

        cy.wait(1000); 


        cy.get('.modal-button').contains('JSON').click();


    })
})