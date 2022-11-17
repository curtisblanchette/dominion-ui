describe('Outbound Call Flow - Answered - Set Appt', () => {

    it('Login to Application', () => {
        cy.visit('/')
        cy.get('[data-qa="login-form"]').within(($form) => {
            cy.get('[data-qa="username"]').type('4iiz.system@4iiz.com')
            cy.get('[data-qa="password"]').type('$BeBetter911')
            cy.wrap($form).submit();
        })
        cy.wait(5000)
    })

    it('set Demo Account', () => {
        // Set Demo Account
        cy.get('[data-qa="accounts-form"]').within(($form) => {
            cy.get('fiiz-dropdown').click()
        })
        cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
            cy.wrap($buttons).each(($el, $index, $list) => {
                if( $el.find('button').text().trim() == 'demo' ){
                    cy.wrap($el).click()
                }
            })
        })
        cy.wait(5000)
        // Go to Flow Page
        cy.visit('/flow')
    })

    it('Start Outbound - Answered Set Appt Call Flow', () => {

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
                if( $el.children().eq(3).text() == 'No Set' ){
                    cy.wrap($el.children().eq(3)).click()
                    return false;
                }
            })
        })
        cy.get('[data-qa="next"]').click()

        // Opp Follow up
        cy.get('[data-qa="call-status"]').within(($form) => {
            cy.get('fiiz-dropdown').first().click()
            cy.get('[data-qa="dropdown-items"] button').contains('Answered').click()

            cy.get('fiiz-dropdown').eq(1).click()
            cy.get('[data-qa="dropdown-items"] button').contains('Set Appointment').click()
        })        
        cy.get('[data-qa="next"]').click()

        // Power Question
        cy.get('[data-qa="next"]').click()

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
        cy.get('[data-qa="next"]').click()

        // Recap
        cy.get('[data-qa="next"]').click()

        // Finish Call
        cy.get('[data-qa="finish-call"]').click()

    })

})