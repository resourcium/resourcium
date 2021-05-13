describe('Student Help', () => {

  before(() => {
    cy.login('StudentHelp', 'Student Help');

    cy.contains('Microsoft Learn');
  });

  it('renders MS Learn initially', () => {
    cy.login('StudentHelp','Student Help');
    cy.get('.tabs-label.selected').contains('Microsoft Learn');
  });

  it('has all the tabs', () => {
    cy.get('.tabs-label').contains('Microsoft Learn');
    cy.get('.tabs-label').contains('Linkedin Learning');
    cy.get('.tabs-label').contains('QnABot');
  });

  it('navigates to LinkedinLearning from initial page', () => {
    cy.get('.tabs-label').contains('Linkedin Learning').click();

    cy.get('.tabs-label.selected').contains('Linkedin Learning');
  });

  it('navigates to QnAbot from initial page', () => {
    cy.get('.tabs-label').contains('QnABot V1').click();

    cy.get('.tabs-label.selected').contains('QnABot V1');
  });

  it('navigates to MS Learn from LinkedinLearning', () => {
    cy.get('.tabs-label').contains('Linkedin Learning').click();
    cy.get('.tabs-label').contains('Microsoft Learn').click();
    cy.get('.tabs-label.selected').contains('Microsoft Learn');
  });

  it('navigates to QnABot from LinkedinLearning', () => {
    cy.get('.tabs-label').contains('Linkedin Learning').click();
    cy.get('.tabs-label').contains('QnABot V1').click();
    cy.get('.tabs-label.selected').contains('QnABot V1');
  });

  it('navigates to LinkedinLearning from QnABot', () => {
    cy.get('.tabs-label').contains('QnABot V1').click();
    cy.get('.tabs-label').contains('Linkedin Learning').click();
    cy.get('.tabs-label.selected').contains('Linkedin Learning');
  });

  it('navigates to MS Learn from QnABot', () => {
    cy.get('.tabs-label').contains('QnABot V1').click();
    cy.get('.tabs-label').contains('Microsoft Learn').click();
    cy.get('.tabs-label.selected').contains('Microsoft Learn');
  });

});