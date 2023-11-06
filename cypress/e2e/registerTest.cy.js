describe('template spec', () => {
  it('visit splash screen, and click register, and registe one account', () => {
    cy.visit('https://patrick-barbie-a2f18d08630b.herokuapp.com/')

    cy.wait(500);

    cy.contains('Create Account').click()

    cy.url().should('include', '/register')

    cy.get('input[type="email"]').type('yuwenqianchen9@gmail.com')
    cy.get('input[type="password"]').type('Az123456@')
    cy.get('input[type="text"]').type('yuwenqianchen9@gmail.com')

    cy.contains('Register').click()

    // cy.get('p').contains('taken')
    cy.url().should("include", "/login")
  })
})