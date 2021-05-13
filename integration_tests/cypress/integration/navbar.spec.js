function testRoute(path, name) {
  cy.get('.NavBar a[href="/' + path + '"]').click();

  cy.location('pathname').should('eq', '/' + path + '');

  cy.get('h2').contains(name);
}

describe('Navbar', () => {
  it('goes to register page', () => {
    cy.login();
    testRoute('RegisterPage', 'Register');
  });

  it('goes to forms page', () => {
    cy.login();
    testRoute('FormPage', 'Student Wellbeing');
  });

  it('goes to student help page', () => {
    cy.login();
    testRoute('StudentHelp', 'Student Help');
  });

  it('goes to settings page', () => {
    cy.login();
    testRoute('SettingsPage', 'Settings');
  });
});
