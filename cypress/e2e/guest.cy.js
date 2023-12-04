describe('template spec', () => {
    it('visit guest', () => {
        cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

        cy.wait(500);

        cy.contains('Continue as Guest').click()

        cy.url().should('include', '/main')

    })
})