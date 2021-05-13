describe('Linkedin Learning', () => {

  before(() => {
    cy.login('StudentHelp', 'Student Help');

    cy.contains('Linkedin Learning').click();
  });

  it('gives search results for standard input (java)', () => {
    cy.get('input[type=text]')
      .click()
      .type('java');
    cy.contains('SEARCH').click();
    cy.get('.courses-container',{ timeout: 10000 });
  });

  it('gives search results with mix case (JaVa)', () => {
    cy.get('input[type=text]')
      .click()
      .type('JaVa');
    cy.contains('SEARCH').click();
    cy.wait(1000);
    cy.get('.courses-container');
  });

  it('gives search results with space( java)', () => {
    cy.get('input[type=text]')
      .click()
      .type(' java');
    cy.contains('SEARCH').click();
    cy.wait(1000);
    cy.get('.courses-container');
  });

  it('gives search results all uppercase (JAVA)', () => {
    cy.get('input[type=text]')
      .click()
      .type('JAVA');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.courses-container');
  });

  it('gives search results for mixed input (1java)', () => {
    cy.get('input[type=text]')
      .click()
      .type('1java');
    cy.contains('SEARCH').click();
    cy.wait(500);
    cy.get('.courses-container');
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
    cy.contains('Microsoft Learn').click();
    cy.contains('Linkedin Learning').click();
    cy.get('input[type=text]')
      .click()
      .type('python');
    cy.contains('SEARCH').click();
    cy.wait(1000);
    cy.get('.course').contains('Python',{ matchCase: false });
  });

  it('should render appropriate content (azure)', () => {
    cy.contains('Microsoft Learn').click();
    cy.contains('Linkedin Learning').click();
    cy.get('input[type=text]')
      .click()
      .type('azure');
    cy.contains('SEARCH').click();
    cy.wait(1000);
    cy.get('.course-preview').contains('Azure',{ matchCase: false });
  });

  afterEach(()=> {
    cy.get('[type="text"]').clear();
  });

});