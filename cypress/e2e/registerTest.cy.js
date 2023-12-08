describe('template spec', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})
  it('visit splash screen, and click register, and registe one account', () => {
    cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

    // cy.wait(500);

    cy.contains('Create Account').click()

    cy.url().should('include', '/register')

    cy.get('input[id="username"]').type('admin');
    cy.get('input[type="email"]').type("Admin123@admin.com");
    cy.get('input[type="password"]').eq(0).type("Admin123@admin.com");
    cy.get('input[type="password"]').eq(1).type("Admin123@admin.com");

    cy.get('button[type="submit"]').click();

  })
})