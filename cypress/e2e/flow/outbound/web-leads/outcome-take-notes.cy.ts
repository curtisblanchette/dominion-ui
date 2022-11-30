describe('Outbound Web Leads Call Flow Test', () => {
	it('Web Lead Test Cases', () => {
		cy.fixture('web-leads-take-notes').then(data => {
			const reason = data.reason[0];
			data.statuses.forEach((status:string) => {
				// Go to FLow
				cy.visit('/flow');
		
				// Select Outbound and proceed
				cy.get('[data-qa="step:call-direction"]').should('exist').should('be.visible').within(() => {
					cy.get('[data-qa="radio:call_direction"]').contains('Outbound', {matchCase : false}).click();
				});
				cy.nextStep();
		
				// Select Opp Follow up
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
					cy.get('[data-qa="radio:call_statusId"]').contains(status).click();
					cy.get('[data-qa="radio:call_reason"]').contains(reason).click();
				});
				cy.nextStep();
		
				// Take Notes
				cy.get('[data-qa="step:text-notes"]').find('iframe').then(($iframe) => {
					// cy.wrap($iframe).its('0.contentDocument.body.p').type('Test')
				});
				cy.nextStep();
		
				// Finish Call
				cy.finish();
				
			});
		});
	});
});