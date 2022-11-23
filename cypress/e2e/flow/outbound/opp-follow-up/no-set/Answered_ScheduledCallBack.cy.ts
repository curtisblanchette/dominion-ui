describe('Outbound Call Flow - Answered - Schedule Callback', () => {
  it('Start Outbound - Answered Scheduled Callback Call Flow', () => {
    cy.visit('/flow');
    // Select Outbound and proceed
    cy.get('[data-qa="call_direction"]').within(() => {
      cy.get('label').contains('Outbound').click()
    })
    cy.get('[data-qa="next"]').click()

    // Select Opp Follow up
    cy.get('fiiz-radio').within(() => {
      cy.get('label').contains('Opportunity Follow Up').click()
    })
    cy.get('[data-qa="next"]').click()

    // Select Deal with No Set from List
    cy.get('[data-qa="table-row"]').within((row) => {
      cy.wrap(row).each(($el, $index, $list) => {
        if ($el.children().eq(3).text() == 'No Set') {
          cy.wrap($el.children().eq(3)).click()
          return false;
        }
      })
    })
    cy.get('[data-qa="next"]').click()

    // Opp Follow up
    cy.get('[data-qa="call-status"]').within(($form) => {
      cy.get('fiiz-dropdown').first().click()
      cy.get('[data-qa="dropdown-item"] button').contains('Answered').click()

      cy.get('fiiz-dropdown').eq(1).click()
      cy.get('[data-qa="dropdown-item"] button').contains('Scheduled Callback').click()

      cy.get('fiiz-date-picker').click()
      cy.wait(2000)
    })

    cy.get('.owl-dt-calendar-table').find('tbody tr').eq(3).find('td').eq(3).click()
    cy.get('.owl-dt-container-buttons button').eq(1).click()
    cy.get('[data-qa="next"]').click()

    // Take Notes
    cy.get('iframe').its('0.contentDocument.body').then(cy.wrap).type('This is a test note')
    cy.get('[data-qa="next"]').click()

    // Finish Call
    cy.get('[data-qa="finish-call"]').click()

  })

})
