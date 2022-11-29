describe('Opp Follow Up - Answered - Set Appt', () => {
	it(`Opp Follow up, Answered - Set Appt Call Flow`, () => {
		cy.fixture('opp-follow-up-answered').then(data => {
			const status = data.statuses[0];
			const outcome = 'Set Appointment';
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
				cy.nextStep();

				// Power Question
				cy.nextStep();

				// Set Appointment
				cy.fillFlowAppointmentStep();
				cy.nextStep();

				// Recap
				cy.nextStep();

				// Finish Call
				cy.finish();
			});
		});
	});
})