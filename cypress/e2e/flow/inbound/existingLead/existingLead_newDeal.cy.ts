describe('Inbound Call Flow - Existing Lead - new Deal', () => {

  it('Start Inbound - Existing Lead New Deal Call Flow', () => {
    // Go to Flow Page
    cy.visit('/flow');

    cy.request({
      url : `${Cypress.env('API_URL')}/leads`,
      method : 'get'
    }).then((response) => {

      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('count').to.be.greaterThan(0)
      expect(response.body).to.have.property('rows').length.greaterThan(0)

      const name:string = response.body.rows[0].fullName;

      // Select Inbound and proceed
      cy.callType('Inbound');
      cy.nextStep();

      // Search For a Lead
      // we can't search for this text here, it has to be something we know exists.
      cy.get('[data-qa="search_module"]').should('be.visible').type(name);
      cy.intercept({
        method: "GET",
        url: "**/api/v1/leads?**",
      }).as("search");
      cy.wait('@search');

      cy.get('[data-qa="table-row"]').should('be.visible').should('be.at.least', 1);
      // Get the lead Name
      cy.get('[data-qa="table-row"]').first().find('.fullName').find('div').invoke('text').as('leadName');
      cy.get('[data-qa="table-row"]').first().click();
      cy.nextStep();

      // Review Lead Info
      cy.nextStep();

      // create New Deal
      cy.get('[data-qa="new-module"]').should('be.visible').click();
      cy.get('[data-qa="new-module-form"]').within(($form) => {
        cy.get('input').type(`@leadName Deal`);
      });    
      cy.nextStep();

      // Relationship building
      cy.get('[data-qa="new-module-form"]').within(($form) => {
        cy.get('label[for="practiceAreaId"]').next().click();
        cy.get('[data-qa="dropdown-item"]').should('be.visible').should('be.at.least',1).first().click();
      });
      cy.nextStep();

      // Power question
      cy.nextStep();

      // Set Appointment
      cy.get('[data-qa="event-form"]').should('be.visible').within(($form) => {
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

});
