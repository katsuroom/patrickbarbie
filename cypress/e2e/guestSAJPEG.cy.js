describe('template spec', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    it('guest download PNG', () => {
        cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

        cy.wait(500);

        cy.contains('Continue as Guest').click()

        cy.url().should("include", "/mapcards");

        cy.wait(500); 

        cy.contains(".map-list-name", "SA").click();

        cy.wait(500); 

        cy.get('button[id="saveImageButton"]').trigger("click"); 

        cy.wait(500); 

        cy.get('.modal-button').contains('JPEG').click();
    })
})