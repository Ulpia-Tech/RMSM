/// <reference types="cypress" />
import { ROLES_COUNT, COLUMNS_COUNT } from "../../support/utils/getPermissionsInfo";


describe('table view UI elements', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('[data-testid=test-app-btn]').click();
    })

    it('should contain filters', () => {
        cy.get('[data-testid=filter-by-role-select]');
        cy.get('[data-testid=filter-by-right-select]');
        cy.get('[data-testid=filter-by-attribute]');
        cy.get('[data-testid=filter-by-derived-rows]');
    })

    it('should contain table table elements', () => { 
        cy.get('[data-testid=tbody]');
        cy.get('[data-testid=tbody-tr]');
        cy.get('[data-testid=tbody-tr-td]');
    })

    it.only('should contain role actions', () => { 
        cy.get('[data-testid=add-role]');
        cy.get('[data-testid=role-settings-icon]').should('have.length', ROLES_COUNT);
    })
})