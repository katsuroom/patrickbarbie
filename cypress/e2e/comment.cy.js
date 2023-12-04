describe("template spec", () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})
  it("visit splash screen and login then logout", () => {
    cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

    cy.wait(500);

    cy.contains("Log in").click();

    cy.url().should("include", "/login");

    cy.get('input[type="email"]').type("Yuwenqianchen1@gmail.com");
    cy.get('input[type="password"]').type("Yuwenqianchen1@gmail.com");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/main");

    cy.contains(".map-list-name", "Asia").click();

    cy.contains("Post").click();

  });
});
