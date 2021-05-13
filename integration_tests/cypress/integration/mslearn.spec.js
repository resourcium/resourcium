describe('Microsoft Learn', () => {
  before(() => {
    cy.login('StudentHelp', 'Student Help');

    cy.contains('Microsoft Learn').click();
  });

  it('gives search results for (java)', () => {
    cy.get('input[type=text]')
      .click()
      .type('java');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.courses-container');
  });

  it('gives search results for mixed input (Java)', () => {
    cy.get('input[type=text]')
      .click()
      .type('JaVa');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.courses-container');
  });

  it('gives search results for space ( java)', () => {
    cy.get('input[type=text]')
      .click()
      .type(' java');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.courses-container');
  });

  it('gives search results (all capital JAVA)', () => {
    cy.get('input[type=text]')
      .click()
      .type('JAVA');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.courses-container');
  });

  it('gives no result (mixedinput 1java)', () => {//this is a bug that needs to be fixed
    cy.get('input[type=text]')
      .click()
      .type('1java');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.courses-container').should('not.exist');
  });

  it('does not give search result for random input', () => {
    cy.get('input[type=text]')
      .click()
      .type('asdasdasad');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.courses-container').should('not.exist');
  });

  it('should render appropriate content (python)', () => {
    cy.get('input[type=text]')
      .click()
      .type('python');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.course').contains('Python');
  });

  it('should render appropriate content (azure)', () => {
    cy.get('input[type=text]')
      .click()
      .type('azure');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.course').contains('Azure');
  });

  it('should render appropriate content (github)', () => {
    cy.get('input[type=text]')
      .click()
      .type('github');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.course').contains('GitHub');
  });

  afterEach(()=> {
    cy.get('[type="text"]').clear();
  });
});
//bug1: first alphabet cannot be capital otherwise no search results