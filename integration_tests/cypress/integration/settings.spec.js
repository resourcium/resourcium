describe('Settings page', () => {
  before(() => {
    cy.login('SettingsPage', 'Settings');

    cy.contains('Settings');
  });

  it('renders the settings', () => {
    cy.get('.title').contains('Home page customisation');

    cy.get('.title').contains('Colour settings');
  });

  it('turn off twitter and updates home page', () => {
    cy.get('.Settings form').then($form => {
      if ($form.find('input[name="twitter"]:checked').length) {
        cy.get('input[name="twitter"]:checked').parent().click();
      }
    });
    cy.wait(1000);
    cy.get('a[href="/"]').click();
    cy.get('.tabs-label').contains('Twitter').should('not.exist');

  });

  it('turn on twitter and updates home page', () => {
    cy.get('.Settings form').then($form => {
      if ($form.find('input[name="twitter"]:not(:checked)').length) {
        cy.get('input[name="twitter"]:not(:checked)').parent().click();
      }
    });
    cy.wait(1500);
    cy.get('a[href="/"]').click();

    cy.get('.tabs-label').contains('Twitter');
  });

  it('turn on twitch streamer and updates home page', () => {

    cy.get('.Settings form').then($form => {
      cy.get('[type=text]').clear();
      cy.get('input[type=text]')
      .click()
      .type('tyler1');
      cy.wait(1500);
      cy.get('a[href="/"]').click();
      cy.get('.tabs-label').contains('Twitch');
    });
  })

    it('turn off twitch streamer and updates home page', () => {

    cy.get('.Settings form').then($form => {
      cy.get('input[type=text]')
      .click()
      .type('tyler1');
      cy.get('[type=text]').clear();
      cy.wait(1500);
      cy.get('a[href="/"]').click();
      cy.get('.tabs-label').contains('Twitch').should('not.exist');
    });
  })

  it('turn on dark mode check', () => {
    cy.get('.Settings form').then($form => {
      if ($form.find('input[name="darkmode"]:not(:checked)').length) {
        cy.get('#app').should('have.css','background-color','rgb(255, 255, 255)');
        cy.get('input[name="darkmode"]:not(:checked)').parent().click();
        cy.wait(1500);
      }
    });
    cy.get('#app').should('have.css','background-color','rgb(54, 54, 54)');
  })

  it('turn off dark mode check', () => {
    cy.get('.Settings form').then($form => {
      if ($form.find('input[name="darkmode"]:checked').length) {
        cy.get('#app').should('have.css','background-color','rgb(54, 54, 54)');
        cy.get('input[name="darkmode"]:checked').parent().click();
        cy.wait(1500);
      }
    });
    cy.get('#app').should('have.css','background-color','rgb(255, 255, 255)');
  })

  it('changes color of wiggle', () => {
        cy.get('input[type=color]').invoke('val','#000000').trigger('change');
    cy.get('input[type=color]').invoke('val','#FF0000').trigger('change');
    cy.wait(1500);
    cy.get('.wiggle').should('have.css','fill','rgb(255, 0, 0)');
  })
  
  afterEach(()=> {
    cy.get('a[href="/SettingsPage"]').click();
  });

});