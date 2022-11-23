describe('Outbound Call Flow - Answered - Referred Out', () => {
  it('Start Outbound - Answered Referred Out Call Flow', () => {
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
      cy.get('[data-qa="dropdown-item"] button').contains('Referred Out').click()
    })
    cy.get('[data-qa="next"]').click()

  })

})
