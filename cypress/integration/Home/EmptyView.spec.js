/// <reference types="cypress" />

describe('home page empty view', () => { 
    beforeEach(() => { 
        cy.visit('http://localhost:3000');
    })
    
    it('should have correct initial screen', () => { 
        cy.get('[data-testid=empty-view-container]');
        cy.get('[data-testid=footer]');
        cy.get('[data-testid=header]');
        cy.get('[data-testid=upload-config-file]').click();
        cy.get('[data-testid=PERMISSION_FILE]')
        cy.get('[data-testid=L3_FILE]')
        cy.contains('Upload config file')
        cy.get('[data-testid=dialog-close-icon]').click();
    })
})