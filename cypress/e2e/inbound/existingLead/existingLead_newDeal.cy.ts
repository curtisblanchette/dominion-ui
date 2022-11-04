describe('Inbound Call Flow - Existing Lead - new Deal', () => {

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

    it('Start Inbound - Existing Lead New Deal Call Flow', () => {

        // Select Inbound and proceed
        cy.get('[data-qa="call_direction"]').within(() => {
            cy.get('label').contains('Inbound').click()
        })
        cy.get('[data-qa="next"]').click()

        // Search For a Lead
        cy.get('[data-qa="search_module"]').type('Raj kumar')
        cy.wait(2000)
        cy.get('[data-qa="table-row"]').first().click()
        cy.get('[data-qa="next"]').click()

        // Review Lead Info
        cy.get('[data-qa="next"]').click()

        // create New Deal
        cy.get('[data-qa="new-module"]').click()
        cy.get('[data-qa="new-module-form"]').within(($form) => {
            cy.get('input').type('Test Deal')            
        })
        cy.get('[data-qa="next"]').click()
         
        // Relationship building
        cy.get('[data-qa="new-module-form"]').within(($form) => {
            cy.get('label[for="practiceAreaId"]').next().click()
            cy.get('[data-qa="dropdown-items"]').first().click()
        })
        cy.get('[data-qa="next"]').click()

        // Power question
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

        // // Finish Call
        cy.get('[data-qa="finish-call"]').click()

    })

})