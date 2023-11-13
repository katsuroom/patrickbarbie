describe('template spec', () => {
  it('visit splash screen and login', () => {
    cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

    cy.wait(500);

    cy.contains('Login in').click()

    cy.url().should('include', '/login')

    cy.get('input[type="email"]').type('yuwenqianchen@gmail.com')
    cy.get('input[type="password"]').type('Cywq1234567890!')

    cy.contains('Login').click()

    // cy.contains('Welcome to Patrick Barbie, lenzlaww.')
    cy.url().should('include', '/');
  })
})