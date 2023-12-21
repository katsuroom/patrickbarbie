describe("template spec", () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
    it("add a short reply", () => {
        cy.visit("https://patrick-barbie-f64046e3bb4b.herokuapp.com/");

        cy.wait(500);

        cy.contains("Log in").click();

        cy.url().should("include", "/login");

        cy.get('input[type="email"]').type("Admin123@admin.com");
        cy.get('input[type="password"]').type("Admin123@admin.com");

        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/mapcards");

        cy.wait(1000);

        cy.get("[id*='map-card']").first().click();

        cy.wait(2000);

        cy.get('.comment').first().find('.comment-reply-btn').click();

        cy.get('.comment').first().find('input[type="text"]').type("short reply");

        cy.get('.comment').first().find('button').contains('Submit Reply').click();

        cy.get('.comment').first().find('.comment-reply .comment-text').contains("short reply").should("exist");
    });
});
