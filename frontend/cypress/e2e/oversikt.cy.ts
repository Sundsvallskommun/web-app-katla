/// <reference types="cypress" />
import { FTCaseLabel } from '@interfaces/case-type';
import { emptyMockErrands, mockErrands_base } from './fixtures/mockErrands';
import { mockMe } from './fixtures/mockMe';
import { mockNotifications } from './fixtures/mockNotifications';
import { ErrandStatus } from '@interfaces/errand-status';

describe('Overview page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/me', mockMe);
    cy.intercept('GET', '**/errands*', mockErrands_base).as('getErrands');
    cy.intercept('GET', '**/casedatanotifications/2281', mockNotifications).as('getNotifications');
    cy.visit('/');
    cy.wait('@getErrands');
    cy.get('.sk-cookie-consent-btn-wrapper').contains('Godkänn alla').click();
  });

  it('displays table data', () => {
    cy.get('[data-cy="main-table"] .sk-table-tbody-tr').should('have.length', mockErrands_base.data.content.length);
  });

  it('sidebar toggle button is clickable', () => {
    cy.get('button[aria-label*="sidomeny"]').should('exist').click({ force: true });
  });

  it('shows the correct sidebar main buttons', () => {
    const expectedStatusLabels = [
      ErrandStatus.ArendeInkommit,
      ErrandStatus.UnderGranskning,
      ErrandStatus.Utkast,
      ErrandStatus.ArendeAvslutat,
    ];

    expectedStatusLabels.forEach((status) => {
      cy.get(`[aria-label="status-button-${status}"]`).should('exist');
    });
    cy.get('[data-cy="logout-button"]').should('exist');
  });

  it('navigates to /logout when clicking the logout button', () => {
    cy.get('[data-cy="logout-button"]').should('exist').click();
    cy.url().should('include', '/login');
  });

  it('should open and close the notifications panel and show two items', () => {
    cy.intercept('GET', '**/notifications*', mockNotifications).as('getNotifications');

    cy.visit('/oversikt');
    cy.wait('@getNotifications');

    cy.get('[data-cy="notifications-toggle"]').click();

    cy.contains('h2', 'Nya').should('exist');
    cy.contains('Inga nya notifieringar').should('not.exist');

    cy.get('[data-cy="notifications-list"] li').should('have.length', 2);
    cy.contains('Beskrivning av notifieringen här').should('exist');

    cy.get('[aria-label="Stäng notiser"]').click();

    cy.get('[aria-label="Stäng notiser"]').should('not.exist');
  });

  it('displays the correct table header', () => {
    const headerRow = cy.get('[data-cy="main-table"] .sk-table-thead-tr').first();
    headerRow.get('th').eq(0).find('span').first().should('have.text', 'Status');
    headerRow.get('th').eq(1).find('span').first().should('have.text', 'Ärendetyp');
    headerRow.get('th').eq(2).find('span').first().should('have.text', 'Registrerat');
    headerRow.get('th').eq(3).find('span').first().should('have.text', 'Prioritet');
    headerRow.get('th').eq(4).find('span').first().should('have.text', 'Inkom via');
  });

  it('displays the filters', () => {
    cy.get('[aria-label="status-button-Under granskning"]').click();
    cy.get('[data-cy="Show-filters-button"]').should('exist');
    cy.get('[data-cy="Status-filter"]').should('exist');
    cy.get('[data-cy="Ärendetyp-filter"]').should('exist');
    cy.get('[data-cy="Prioritet-filter"]').should('exist');
    cy.get('[data-cy="Tidsperiod-filter"]').should('exist');
    cy.get('[data-cy="Tidsperiod-filter"]').click();
    cy.get('[data-cy="casedata-validFrom-input"]').should('exist');
    cy.get('[data-cy="casedata-validTo-input"]').should('exist');
  });

  it('allows filtering by a single caseType', () => {
    cy.get('[data-cy="Show-filters-button"]').should('exist');
    const entries = Object.entries(FTCaseLabel);
    cy.get('[data-cy="Ärendetyp-filter"]').click();
    cy.intercept('GET', '**/errands*').as(`${entries[0][0]}-filterSearch`);
    cy.get(`[data-cy="Ärendetyp-filter-${entries[0][0]}"]`).click({ force: true });
    cy.wait(`@${entries[0][0]}-filterSearch`).should(({ request, response }) => {
      expect([200, 304]).to.include(response && response.statusCode);
    });
    cy.get('[data-cy="Ärendetyp-filter"]').click();
    cy.get('[data-cy="tag-caseType"]').should('exist').click();
  });

  it('allows filtering by multiple caseTypes', () => {
    const entries = Object.entries(FTCaseLabel);
    const selected = [];
    cy.get('[data-cy="Show-filters-button"]').should('exist');
    cy.get(`[data-cy="Ärendetyp-filter"]`).click();
    entries.forEach((entry, idx) => {
      cy.intercept('GET', '**/errands*').as(`multiple-filterSearch-${idx}`);
      cy.get(`[data-cy="Ärendetyp-filter-${entry[0]}"]`).click({ force: true });
      cy.wait(`@multiple-filterSearch-${idx}`).should(({ response }) => {
        selected.push(entry[0]);
        expect([200, 304]).to.include(response && response.statusCode);
      });
    });
    cy.get('[data-cy="Ärendetyp-filter"]').click();
    cy.get('[data-cy="tag-clearAll"]').should('exist').contains('Rensa alla').click();
  });

  it('allows filtering by priority', () => {
    cy.get('[data-cy="Show-filters-button"]').should('exist');
    const labels = ['HIGH', 'MEDIUM', 'LOW'];
    cy.get('[data-cy="Prioritet-filter"]').click();
    cy.intercept('GET', '**/errands*').as(`${labels[0]}-filterSearch`);
    cy.get(`[data-cy="Prioritet-filter-${labels[0]}"]`).click();
    cy.wait(`@${labels[0]}-filterSearch`).should(({ response }) => {
      expect([200, 304]).to.include(response && response.statusCode);
    });
    cy.get('[data-cy="Prioritet-filter"]').click();
    cy.get('[data-cy="tag-prio"]').click();
  });

  it('allows filtering by date', () => {
    cy.get('[data-cy="Show-filters-button"]').should('exist');
    cy.get('[data-cy="Tidsperiod-filter"]').click();
    cy.get(`[data-cy="casedata-validFrom-input"]`).should('exist').type('2024-05-22');
    cy.get(`[data-cy="casedata-validTo-input"]`).should('exist').type('2024-05-27');
    cy.get(`[data-cy="casedata-validTo-input"]`).siblings('button').should('have.text', 'Visa tidsperiod').click();
    cy.intercept('GET', '**/errands*').as(`date-filterSearch`);
    cy.wait(`@date-filterSearch`).should(({ response }) => {
      expect([200, 304]).to.include(response && response.statusCode);
    });
    cy.get(`[data-cy="tag-date"]`).should('exist').click();
  });

  it('allows filtering by single status', () => {
    const labels = Object.entries(ErrandStatus);
    cy.get('[aria-label="status-button-Under granskning"]').click();
    cy.get('[data-cy="Show-filters-button"]').should('exist');
    cy.get('[data-cy="Status-filter"]').click();
    if (labels[0][0] !== 'ArendeInkommit') {
      cy.get(`[data-cy="Status-filter-${labels[0][0]}"]`).should('exist').click();
      cy.intercept('GET', '**/errands*').as(`${labels[0][0]}-filterSearch`);
      cy.wait(`@${labels[0][0]}-filterSearch`).should(({ request, response }) => {
        expect([200, 304]).to.include(response && response.statusCode);
      });
      cy.get('[data-cy="Status-filter"]').click();
      cy.get(`[data-cy="tag-status-${labels[0][0]}"]`).should('exist').contains(labels[0][1]).click();
    }
  });

  it('allows filtering by multiple statuses', () => {
    const labels = Object.entries(ErrandStatus);
    cy.get('[aria-label="status-button-Under granskning"]').click();
    cy.get('[data-cy="Show-filters-button"]').should('exist');
    cy.get('[data-cy="Status-filter"]').click();
    labels.forEach((label) => {
      if (label[0] !== 'ArendeInkommit' && label[0] !== 'ArendeAvslutat' && label[0] !== 'Tilldelat') {
        cy.get(`[data-cy="Status-filter-${label[0]}"]`).should('exist').click();
        cy.intercept('GET', '**/errands*').as(`${label[0]}-filterSearch`);
        cy.wait(`@${label[0]}-filterSearch`).should(({ request, response }) => {
          expect([200, 304]).to.include(response && response.statusCode);
        });
      }
    });
    cy.get('[data-cy="Status-filter"]').click();
  });

  it('allows filtering only my errands', () => {
    cy.intercept('GET', '**/errands*').as('myErrands-filterSearch');
    cy.visit('/oversikt');
    cy.wait('@myErrands-filterSearch');

    cy.get('[data-cy="myErrands-filter"]').should('exist').uncheck({ force: true });

    cy.intercept('GET', '**/errands*').as('noMyErrands-filterSearch');
    cy.wait('@noMyErrands-filterSearch');
  });

  it('can use searchfield', () => {
    cy.get('[data-cy="query-filter"]').should('exist').type('Text goes here');
    cy.intercept('GET', '**/errands*', emptyMockErrands).as(`emptyQuery-filterSearch`);
    cy.wait(`@emptyQuery-filterSearch`);

    cy.get('[data-cy="query-filter"]').should('exist').clear().type('MEX-2024-000266');
    cy.intercept('GET', '**/errands*', mockErrands_base).as(`listedQuery-filterSearch`);
    cy.wait(`@listedQuery-filterSearch`);
    cy.get('[data-cy="main-table"] .sk-table-tbody-tr').should('have.length', mockErrands_base.data.content.length);
  });
});
