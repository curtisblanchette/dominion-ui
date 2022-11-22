describe('Inbound Call Flow - Existing Lead - new Deal', () => {

  it('Start Inbound - Existing Lead New Deal Call Flow', () => {
    // Go to Flow Page
    cy.visit('/flow');

    // Select Inbound and proceed
    cy.callType('Inbound');
    cy.nextStep();

    // Search For a Lead
    // we can't search for this text here, it has to be something we know exists.
    cy.get('[data-qa="search_module"]').type('Raj kumar');
    // we want to intercept the search request
    cy.wait(2000);

    cy.get('[data-qa="table-row"]').first().click();
    cy.nextStep();

    // Review Lead Info
    cy.nextStep();

    // create New Deal
    cy.get('[data-qa="new-module"]').click();
    cy.get('[data-qa="new-module-form"]').within(($form) => {
      cy.get('input').type('Test Deal');
    });
    cy.nextStep();

    // Relationship building
    cy.get('[data-qa="new-module-form"]').within(($form) => {
      cy.get('label[for="practiceAreaId"]').next().click();
      cy.get('[data-qa="dropdown-items"]').first().click();
    });
    cy.nextStep();

    // Power question
    cy.nextStep();

    // Set Appointment
    cy.get('[data-qa="event-form"]').within(($form) => {
      cy.get('label[for="title"]').next().type('Test Event');

      cy.get('label[for="officeId"]').next().click();
      cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
        cy.wrap($buttons).each(($el, $index, $list) => {
          if ($el.find('button').text().trim() == 'Charleston') {
            cy.wrap($el).click();
          }
        });
      });

      cy.get('label[for="typeId"]').next().click();
      cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
        cy.wrap($buttons).each(($el, $index, $list) => {
          if ($el.find('button').text().trim() == 'Sales Consultation') {
            cy.wrap($el).click();
          }
        })
      })
      cy.get('label[for="description"]').next().type('Test Description for event', {force: true});
    })
    cy.get('[data-qa="regular-slots"]').find('[data-qa="slot-time"]').first().click();
    cy.nextStep();

    // Recap
    cy.nextStep();

    // Finish Call
    cy.finish();

  });

});
