describe("template spec", () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})
  it("open EU map and click delete then cancel", () => {
      cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");
    // cy.visit("http://localhost:3000");

    cy.wait(500);

    cy.contains("Log in").click();

    cy.url().should("include", "/login");

    cy.get('input[type="email"]').type("Yuwenqianchen1@gmail.com");
    cy.get('input[type="password"]').type("Yuwenqianchen1@gmail.com");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/main");

    cy.wait(500);

    cy.contains(".map-list-name", "EU").click();

    cy.wait(500);

    cy.get('.forkButton').click();

    cy.wait(500);

    cy.get('.projectName').type("EUPublish");

    cy.wait(500);

    cy.get(".modal-button-fork-confirm").click();

    cy.wait(500);

    cy.contains(".map-list-name", "EUPublish").click();

    cy.wait(500);

    cy.get('.publishButton').click();

    cy.wait(500);

    cy.contains(".modal-button-publish-cancel", "Cancel").click();

    cy.wait(500);

    cy.contains(".map-list-name", "EUPublish").click();

    cy.wait(500);

    cy.get('.deleteButton').click();

    cy.wait(500);

    cy.contains(".modal-button-confirm", "Confirm").click();

    cy.wait(500);


  });
});