describe("template spec", () => {
  it("visit splash screen and login then logout", () => {
    cy.visit("/");

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
