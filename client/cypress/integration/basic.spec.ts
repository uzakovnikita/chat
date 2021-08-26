import { cy } from "date-fns/locale"

describe('Auth page integration test', () => {
    it('Visit the Auth page', () => {
        cy.visit('localhost:3000/auth')
    });
})