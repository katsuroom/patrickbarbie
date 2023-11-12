const dotenv = require('dotenv')
dotenv.config()
console.log(process.env.MONGO_URI);

describe('template spec', () => {
  it('visit splash screen and login', () => {
    cy.visit(process.env.URL);

    cy.wait(500);

    cy.contains('Login in').click()

    cy.url().should('include', '/login')

    cy.get('input[type="email"]').type('yuwenqian.chen@stonybrook.edu')
    cy.get('input[type="password"]').type('1234567890')

    cy.contains('Login').click()

    // cy.contains('Welcome to Patrick Barbie, lenzlaww.')
    cy.url().should('include', '/');
  })
})