describe("template spec", () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    it("log in and download Africa map", () => {
        cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

        cy.wait(500);

        cy.contains("Log in").click();

        cy.url().should("include", "/login");

        cy.get('input[type="email"]').type("Admin123@admin.com");
        cy.get('input[type="password"]').type("Admin123@admin.com");

        cy.get('button[type="submit"]').click();

        cy.wait(500);

        cy.url().should("include", "/mapcards");

        cy.wait(10000);

cy.get("[id*='map-card']").first().click();

        cy.wait(1000); 

        cy.get('.downloadButton').click();

        cy.wait(500); 

        cy.get('.modal-button').contains('JSON').click();

    });
});
