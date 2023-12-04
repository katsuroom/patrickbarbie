describe("template spec", () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    it("log in and save Asia map as PNG", () => {
        cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

        cy.wait(500);

        cy.contains("Log in").click();

        cy.url().should("include", "/login");

        cy.get('input[type="email"]').type("Yuwenqianchen1@gmail.com");
        cy.get('input[type="password"]').type("Yuwenqianchen1@gmail.com");

        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/main");

        cy.contains(".map-list-name", "Asia").click();

        cy.wait(500); 

        cy.get('button[id="saveImageButton"]').trigger("click"); 

        cy.wait(500); 

        cy.get('.modal-button').contains('JPEG').click();

    });
});
