describe('template spec', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    it('guest download JPEG', {retries: 3}, () => {
        cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

        cy.wait(500);

        cy.contains('Continue as Guest').click()

        cy.url().should("include", "/mapcards");

        cy.wait(10000);

        cy.get("[id*='map-card']").first().click();

        cy.wait(2000);

        cy.get('.downloadButton').click();

        cy.wait(500); 

        cy.get('.modal-button').contains('JPEG').click();
    })
})