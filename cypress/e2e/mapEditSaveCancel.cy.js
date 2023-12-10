
describe("template spec", () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    it("open EU map and click delete then cancel", () => {


        cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");
        // cy.visit("http://localhost:3000");

        cy.wait(500);

        cy.contains("Log in").click();

        cy.url().should("include", "/login");

        cy.get('input[type="email"]').type("Admin123@admin.com");
        cy.get('input[type="password"]').type("Admin123@admin.com");

        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/mapcards");

        cy.contains(".map-list-name", "EU").click();

        cy.wait(1000); 

        cy.get('.editButton').click();

        cy.wait(1000); 

        cy.contains("SAVE").click();

        cy.wait(500);


    });
});
