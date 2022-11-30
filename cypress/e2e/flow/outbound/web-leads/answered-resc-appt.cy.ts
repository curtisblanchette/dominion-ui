describe('Outbound Web Leads Call Flow Test - Answered Reschedule Appt', () => {
	it('Outbound Web Leads Call Flow Test - Answered Reschedule Appt', () => {
		cy.visit('/flow');
				
		// Select Outbound and proceed
		cy.get('[data-qa="step:call-direction"]').should('exist').should('be.visible').within(() => {
			cy.get('[data-qa="radio:call_direction"]').contains('Outbound', {matchCase : false}).click();
		});
		cy.nextStep();

		// Select Web Leads
		cy.get('[data-qa="step:outbound-type"]').should('exist').should('be.visible').within(() => {
			cy.get('[data-qa="radio:outbound_type"]').contains('web leads', {matchCase : false}).click()
		});
		cy.nextStep();

		// Select lead from List
		cy.get('[data-qa="step:search-web-leads"]').should('be.visible').find('[data-qa="table-row"]').should('be.visible').should('have.length.at.least',1).within((row) => {
			cy.wrap(row).first().click();
		});
		cy.nextStep();

		// Select Deal
		cy.get('[data-qa="step:select-an-opportunity"]').should('be.visible').find('[data-qa="table-row"]').should('be.visible').should('have.length.at.least',1).within((row) => {
			cy.wrap(row).first().click();
		});
		cy.nextStep();

		// Review Deal
		cy.nextStep();

		// Reason For Call
		cy.get('[data-qa="step:reason-for-call"]').within((row) => {
			cy.get('[data-qa="radio:call_statusId"]').contains('Answered').click();
			cy.get('[data-qa="radio:call_reason"]').contains('Reschedule Appointment').click();
		});
		cy.nextStep();

		// Select the appt to Reschedule
		cy.get('[data-qa="step:select-an-appointment"]').should('exist').within(() => {
			cy.get('[data-qa="table-row"]').should('exist').should('be.visible').should('have.length.at.least',1).first().click();
		}) 
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