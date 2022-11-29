describe('Opp Follow Up - Answered - Schedule Callback', () => {
	it(`Opp Follow up, Answered - Schedule Callback Call Flow`, () => {
		cy.fixture('opp-follow-up-answered').then(data => {
			const status = data.statuses[0];
			const outcome = 'Scheduled Callback';
      data.stages.forEach((stage:string) => {
				cy.visit('/flow');

				// Select Outbound and proceed
				cy.get('[data-qa="step:call-direction"]').should('exist').should('be.visible').within(() => {
					cy.get('[data-qa="radio:call_direction"]').contains('Outbound', {matchCase : false}).click();
				});
				cy.nextStep();

				// Select Opp Follow up
				cy.get('[data-qa="step:outbound-type"]').should('exist').should('be.visible').within(() => {
					cy.get('[data-qa="radio:outbound_type"]').contains('Opportunity Follow Up', {matchCase : false}).click()
				});
				cy.nextStep();

				// Select Deal from List
				cy.get('[data-qa="step:opportunity-follow-up-list"]').should('be.visible').find('[data-qa="table-row"]').should('be.visible').should('have.length.at.least',1).within((row) => {
					cy.wrap(row).each(($el, $index, $list) => {
						if ($el.children().eq(3).text() == stage) {
							cy.wrap($el.children().eq(3)).click();
							return false;
						}
					});
				});
				cy.nextStep();

				// Opp Follow up
				cy.get('[data-qa="dropdown:call_status"]').within(($form) => {
					cy.root().click();
					cy.get('[data-qa="dropdown-item"] button').contains(status).click()
				});
				cy.get('[data-qa="dropdown:call_outcome"]').within(($form) => {
					cy.root().click();
					cy.get('[data-qa="dropdown-item"] button').contains(outcome).click()
				});
				
				// Set Callback date
				cy.get('[data-qa="date-picker:call_scheduledCallBack"]').click();
				cy.wait(1000);
				cy.get('.owl-dt-calendar-table').find('tbody tr').eq(3).find('td').eq(3).click();
    		cy.get('.owl-dt-container-buttons button').eq(1).click();
				cy.nextStep();

				// Takes Notes
				cy.getIframe('[data-template="take-notes"]').type('Tester');
				cy.nextStep();
				
				// Finish Call
				cy.finish();

				// Let all call flow processing finish first
				cy.intercept({
					method: "GET",
					url: "**/api/v1/**",
				}).as("processing")
				cy.wait("@processing")

			});
		});
	});
})