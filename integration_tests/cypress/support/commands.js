// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (page, pageTitle) => {
  cy.visit(
    Cypress.env('HOST') +
      '/' +
      (page || '') +
      '?accessToken=' +
      Cypress.env('ACCESS_TOKEN')
  );

  pageTitle = pageTitle || 'Home Page';

  cy.contains(pageTitle, { timeout: 10000 });
  cy.get('.page h2').contains(pageTitle);
});
