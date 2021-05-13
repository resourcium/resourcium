describe('Login', () => {
  it('Accepts an access token', () => {
    cy.visit(
      Cypress.env('HOST') + '/?accessToken=' + Cypress.env('ACCESS_TOKEN')
    );

    cy.contains('Home Page');
  });

  it('Will stay if there is no access token', () => {
    cy.visit(Cypress.env('HOST'));

    cy.contains('Sign in with SSO');
  });
});
