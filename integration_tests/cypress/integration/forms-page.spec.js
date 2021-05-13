describe('Forms Page', () => {
  beforeEach(() => {
    cy.login('FormPage', 'Student Wellbeing');
  });

  it('tests additional help form', () => {
    cy.contains('Additional Help Form');
  });

  it('tests stress level form', () => {
    cy.contains('Report Stress Level');
  });
});

