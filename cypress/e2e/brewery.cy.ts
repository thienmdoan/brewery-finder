const API_URL = "https://api.openbrewerydb.org/v1/breweries";

describe("Brewery Finder", () => {
  beforeEach(() => {
    cy.intercept("GET", new RegExp(`${API_URL}.*page=1`), {
      fixture: "breweries-page-1.json",
    }).as("getBreweriesPage1");

    cy.intercept("GET", new RegExp(`${API_URL}.*page=2`), {
      fixture: "breweries-page-2.json",
    }).as("getBreweriesPage2");
  });

  it("loads breweries and opens the details modal", () => {
    cy.visit("/");
    cy.wait("@getBreweriesPage1");

    cy.contains('[role="button"]', "Gamma Brewing").should("be.visible");
    cy.contains('[role="button"]', "Gamma Brewing").click();

    cy.get(".modal").should("be.visible").within(() => {
      cy.contains("Gamma Brewing").should("be.visible");
      cy.contains("Close").click();
    });

    cy.get(".modal").should("not.exist");
  });

  it("navigates to the next page of results", () => {
    cy.visit("/");
    cy.wait("@getBreweriesPage1");

    cy.contains("button", "Next ›").should("not.be.disabled").click();

    cy.wait("@getBreweriesPage2");
    cy.url().should("include", "page=2");
    cy.contains('[role="button"]', "Lima Lagers").should("be.visible");
    cy.contains("button", "‹ Prev").should("not.be.disabled");
  });
});
