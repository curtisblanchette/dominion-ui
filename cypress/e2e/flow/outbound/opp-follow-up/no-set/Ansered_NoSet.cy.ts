describe('Outbound Call Flow - Answered - No Set', () => {
  it('Start Outbound - Answered No Set Call Flow', () => {
    cy.visit('/flow');

    // Select Outbound and proceed
    cy.get('[data-qa="call_direction"]').within(() => {
      cy.get('label').contains('Outbound').click();
    });
    cy.get('[data-qa="next"]').click();

    // Select Opp Follow up
    cy.get('fiiz-radio').within(() => {
      cy.get('label').contains('Opportunity Follow Up').click()
    });
    cy.get('[data-qa="next"]').click();

    // Select Deal with No Set from List
    cy.get('[data-qa="table-row"]').within((row) => {
      cy.wrap(row).each(($el, $index, $list) => {
        if ($el.children().eq(3).text() == 'No Set') {
          cy.wrap($el.children().eq(3)).click();
          return false;
        }
      });
    });

    cy.nextStep();

    // Opp Follow up
    cy.get('[data-qa="call-status"]').within(($form) => {
      cy.root().click();
      cy.get('[data-qa="dropdown-item"] button').contains('Answered').click()
    });
    cy.get('[data-qa="call-outcome"]').within(($form) => {
      cy.root().click();
      cy.get('[data-qa="dropdown-item"] button').contains('No Set').click()
    });

    cy.nextStep();

    // Takes Notes
    cy.get('iframe').its('0.contentDocument.body').then(cy.wrap).type('This is a test note');
    cy.get('[data-qa="next"]').click();

    // Finish Call
    cy.get('[data-qa="finish-call"]').click();

  });

});
