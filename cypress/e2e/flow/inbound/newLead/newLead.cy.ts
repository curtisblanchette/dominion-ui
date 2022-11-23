import { faker } from '@faker-js/faker';

describe('Inbound Call Flow - New Lead', function()  {

  beforeEach(() => {

  });

  it('Start Inbound - Create New Lead', () => {

    cy.visit('/flow');

    // Select Inbound and proceed
    cy.get('[data-qa="step:call-direction"]').within(($step) => {
      cy.get('[data-qa="radio:call_direction"]').contains('Inbound').click();
    });

    cy.nextStep();

    cy.get('[data-qa="step:lead-search"]').within(($step) => {
      cy.get('[data-qa="new-module-button"]').click();
    });

    // nextStep is performed automatically

    cy.get('[data-qa="step:create-new-lead"]').within(($step) => {
      // Enter lead info and proceed
      cy.fixture('new-lead').then(newLead => {
        cy.get('[data-qa="input:firstName"]').type(newLead.firstName);
        cy.get('[data-qa="input:lastName"]').type(newLead.lastName);
        cy.get('[data-qa="input:phone"]').type(newLead.phone);
        cy.get('[data-qa="input:email"]').type(newLead.email);
      });

    });

    cy.nextStep();

    cy.get('[data-qa="step:select-lead-source"]').within(($step) => {
      // Select Campaign
      cy.get('[data-qa="dropdown:campaignId"]').next().click();
      cy.get('[data-qa="dropdown-item"]').first().click();
    });

    cy.nextStep();

    // relationship building
    cy.get('[data-qa="step:relationship-building"]').within(($step) => {
      cy.get('[data-qa="dropdown:practiceAreaId"]').click();
      cy.get('[data-qa="dropdown-item"]').first().click();
    });

    cy.nextStep();

    // Power question
    cy.nextStep();

    // Set Appt
    cy.get('[data-qa="step:set-appointment"]').within(($form) => {
      cy.fixture('initial-consultation').then(event => {
        cy.get('[data-qa="input:title"]').type(event.title);

        cy.get('[data-qa="dropdown:officeId"]').click();
        cy.get('[data-qa="dropdown-item"]').within(($buttons) => {
          cy.wrap($buttons).each(($el, $index, $list) => {
            if ($el.find('button').text().trim() == 'Charleston') {
              cy.wrap($el).click();
            }
          });
        });

        cy.get('[data-qa="dropdown:typeId"]').click();
        cy.get('[data-qa="dropdown-item"]').within(($buttons) => {
          cy.wrap($buttons).each(($el, $index, $list) => {
            if ($el.find('button').text().trim() == 'Sales Consultation') {
              cy.wrap($el).click();
            }
          });
        });
        cy.get('[data-qa="textarea:description"]').find('textarea').type(event.description, {force: true});

        cy.get('[data-qa="regular-slots"]').find('[data-qa="slot-time"]').first().click();
      });
    });


    cy.wait(100);

    cy.nextStep();

    // Recap
    cy.nextStep();

    // Finish Call
    cy.finish();
  });

});
