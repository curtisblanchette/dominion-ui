describe('Inbound Call Flow - Existing Lead - Set Appt', () => {

    it('Login to Application', () => {
        cy.visit('/')
        cy.login()
        cy.wait(5000)
    })

    it('set Demo Account', () => {
        // Set Demo Account
        cy.account()
        cy.wait(5000)
    })

    it('Start Inbound - Existing Lead Set Appt Call Flow', () => {

        // Go to Flow Page
        cy.visit('/flow')

        // Select Inbound and proceed
        cy.calltype('Inbound')
        cy.nextstep()

        // Search For a Lead
        cy.get('[data-qa="search_module"]').type('Raj kumar')
        cy.wait(2000)
        cy.get('[data-qa="table-row"]').first().click()
        cy.nextstep()

        // Review Lead Info
        cy.nextstep()

        // Select Deal
        cy.get('[data-qa="table-row"]').first().click()
        cy.nextstep()

        // Review Opportunity
        cy.nextstep()

        // Reason For Call
        cy.get('[data-qa="reason-for-call"]').within(($form) => {
            cy.get('label').contains('Set Appointment').click()
        })
        cy.nextstep()

        // Power question
        cy.nextstep()

        // Set Appointment
        cy.get('[data-qa="event-form"]').within(($form) => {
            cy.get('label[for="title"]').next().type('Test Event')

            cy.get('label[for="officeId"]').next().click()
            cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
                cy.wrap($buttons).each(($el, $index, $list) => {
                    if( $el.find('button').text().trim() == 'Charleston' ){
                        cy.wrap($el).click()
                    }
                })
            })

            cy.get('label[for="typeId"]').next().click()
            cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
                cy.wrap($buttons).each(($el, $index, $list) => {
                    if( $el.find('button').text().trim() == 'Sales Consultation' ){
                        cy.wrap($el).click()
                    }
                })
            })
            cy.get('label[for="description"]').next().type('Test Description for event')
        })

        cy.get('[data-qa="regular-slots"]').find('[data-qa="slot-time"]').first().click()
        cy.nextstep()

        // Recap
        cy.nextstep()

        // Finish Call
        cy.finish()

    })

})