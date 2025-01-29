/// <reference types="cypress" />
import { COLUMNS_COUNT, ROLES_COUNT } from "../../../support/utils/getPermissionsInfo";

describe('Filters', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('[data-testid=test-app-btn]').click();
    })

    describe('filter by attribute', () => {

        it('should apply filter', () => {
            // apply filter
            cy.get('[data-testid=object-type-dropdown]').click();
            cy.get('[data-testid=object-type-item]').should('have.length', 2);
            cy.get('[data-testid-specific=object-type-item-0]').click();
            cy.get('[data-testid=attribute-search-dropdown]').click();
            cy.get('[data-testid=attribute-dropdown-item]').should('have.length', 3);
            cy.get('[data-testid=attribute-dropdown-item]').first().click();
            cy.get('body').click(0, 0);
            cy.get('[data-testid=attributes-filter-apply]').click();

            //check parent rows
            cy.get('[data-testid=tbody]').children().should('have.length', 1);

            //check children
            cy.get('[data-testid=tbody-tr-td]').first().click();
            cy.get('[data-testid=tbody-tr]').should('have.length', 2);
        })
    })

    describe('filter by role', () => {
        let filterByRole;
        beforeEach(() => {
            filterByRole = cy.get('[data-testid=filter-by-role-select]');
        })

        it('should open filter', () => {
            filterByRole.click();
            cy.get('body').click(0, 0);
        })

        it('should clear all except first', () => {
            filterByRole.click();
            cy.get('[data-testid=filter-by-role-clear]').click();
            cy.get('[data-testid=tbody-tr]').first().children().should('have.length', COLUMNS_COUNT + 1); // only expander visible
        })

        it('should select all', () => {
            filterByRole.click();
            cy.get('[data-testid=filter-by-role-clear]').click();
            cy.get('[data-testid=filter-by-role-select-all]').click();
            cy.get('[data-testid=tbody-tr]').first().children().should('have.length', ROLES_COUNT * COLUMNS_COUNT + 1); 
            cy.get('body').click(0, 0);
        })

        it('should DESELECT first role and verify it is hidden', () => {
            filterByRole.click();
            cy.get('[data-testid=G_RELTIO_DEV_ALL]').click();
            cy.get('[data-testid=tbody-tr]').first().children().should('have.length', (ROLES_COUNT - 1) * COLUMNS_COUNT + 1); // +1 (expander column)
            cy.get('body').click(0, 0);
        })

        it('should SELECT first role and verify it is visible', () => {
            filterByRole.click();
            cy.get('[data-testid=G_RELTIO_DEV_ALL]').click();
            cy.get('[data-testid=G_RELTIO_DEV_ALL]').click();
            cy.get('[data-testid=tbody-tr]').first().children().should('have.length', ROLES_COUNT * COLUMNS_COUNT + 1); // +1 (expander column)
            cy.get('body').click(0, 0);
        })
    })

    describe('filter by role', () => {
        let filterByRight;
        beforeEach(() => {
            filterByRight = cy.get('[data-testid=filter-by-right-select]');
        })

        it('should open filter', () => {
            filterByRight.click();
            cy.get('body').click(0, 0);
        })

        it('should clear all', () => {
            filterByRight.click();
            cy.get('[data-testid=filter-by-right-clear]').click();
            cy.get('[data-testid=tbody-tr]').first().children().should('have.length', 1); // only expander visible
        })

        it('should select all', () => {
            filterByRight.click();
            cy.get('[data-testid=filter-by-right-clear]').click();
            cy.get('[data-testid=filter-by-right-select-all]').click();
            cy.get('[data-testid=tbody-tr]').first().children().should('have.length', ROLES_COUNT * COLUMNS_COUNT + 1);
            cy.get('body').click(0, 0);
        })

        it('should DESELECT first right and verify it is hidden', () => {
            filterByRight.click();
            cy.get('[data-testid=Create]').click();
            cy.get('[data-testid=tbody-tr]').first().children().should('have.length', ROLES_COUNT * (COLUMNS_COUNT - 1) + 1);
            cy.get('body').click(0, 0);
        })

        it('should SELECT first right and verify it is visible', () => {
            filterByRight.click();
            cy.get('[data-testid=Create]').click();
            cy.get('[data-testid=Create]').click();
            cy.get('[data-testid=tbody-tr]').first().children().should('have.length', ROLES_COUNT * COLUMNS_COUNT + 1); // +1 (expander column)
            cy.get('body').click(0, 0);
        })
    })
})
