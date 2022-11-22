describe('Inbound Call Flow - Existing Lead - Resc Appt', () => {
  it('Start Inbound - Existing Lead Reschedule Appointment Call Flow', () => {
    // Go to Flow Page
    cy.visit('/flow');

    // Select Inbound and proceed
    cy.callType('Inbound');
    cy.nextStep();

    // Search For a Lead
    cy.get('[data-qa="search_module"]').type('new lead 1');
    cy.wait(2000);
    cy.get('[data-qa="table-row"]').first().click();
    cy.nextStep();

    // Review Lead Info
    cy.nextStep();

    // Select Deal
    cy.get('[data-qa="table-row"]').first().click();
    cy.nextStep();

    // Review Opportunity
    cy.nextStep();

    // Reason For Call
    cy.get('[data-qa="reason-for-call"]').within(($form) => {
      cy.get('label').contains('Reschedule Appointment').click();
    });
    cy.nextStep();

    // Select Appointment
    cy.get('.flex-table__row').first().click();
    cy.nextStep();

    // Set Appointment
    cy.get('#title').type('New Event - Resc');

    cy.get('section.flow-layout__content fiiz-dropdown').eq(0).click();
    cy.get('section.flow-layout__content .dropdown-menu__items').first().click();

    cy.get('section.flow-layout__content fiiz-dropdown').eq(1).click();
    cy.get('section.flow-layout__content .dropdown-menu__items').eq(0).click();

    cy.get('fiiz-textarea textarea').type('Test Description for event');

    cy.get('div.slots__times').first().click();

    cy.nextStep();

    // Recap
    cy.nextStep();

    // Finish Call
    cy.finish();

  });
});
