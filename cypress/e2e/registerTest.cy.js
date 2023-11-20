describe('template spec', () => {
  it('visit splash screen, and click register, and registe one account', () => {
    cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/")

    // cy.wait(500);

    cy.contains('Create Account').click()

    cy.url().should('include', '/register')

    cy.get('input[type="text"]').eq(0).type('Yuwenqianchen3'); 
    cy.get('input[type="email"]').type('Yuwenqianchen3@gmail.com');
    cy.get('input[type="password"]').eq(0).type('Yuwenqianchen3@gmail.com');
    cy.get('input[type="password"]').eq(1).type('Yuwenqianchen3@gmail.com'); 

    cy.get('button[type="submit"]').click();

  })
})