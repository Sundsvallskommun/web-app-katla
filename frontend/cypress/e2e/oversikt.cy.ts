/// <reference types="cypress" />
// import { mockAdmins } from '../fixtures/mockAdmins';
import { mockErrands_base } from './fixtures/mockErrands';
import { mockMe } from './fixtures/mockMe';
import { mockNotifications } from './fixtures/mockNotifications';

describe('Overview page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/me', mockMe);
    cy.intercept('GET', '**/errands*', mockErrands_base).as('getErrands');
    cy.intercept('GET', '**/casedatanotifications/2281', mockNotifications).as('getNotifications');
    cy.visit('/');
    cy.wait('@getErrands');
    cy.get('.sk-cookie-consent-btn-wrapper').contains('Godkänn alla').click();
  });

  //   it('displays the logged in users initials', () => {
  //     const initials = 'MT';
  //     cy.get('[data-cy="avatar-aside"] span').contains(initials).should('exist');
  //   });

  it('displays table data', () => {
    cy.get('[data-cy="main-table"] .sk-table-tbody-tr').should('have.length', mockErrands_base.data.content.length);
  });

  it('displays the correct table header', () => {
    const headerRow = cy.get('[data-cy="main-table"] .sk-table-thead-tr').first();
    headerRow.get('th').eq(0).find('span').first().should('have.text', 'Status');
    headerRow.get('th').eq(1).find('span').first().should('have.text', 'Ärendetyp');
    headerRow.get('th').eq(2).find('span').first().should('have.text', 'Registrerat');
    headerRow.get('th').eq(3).find('span').first().should('have.text', 'Prioritet');
    headerRow.get('th').eq(4).find('span').first().should('have.text', 'Inkom via');
  });
});
