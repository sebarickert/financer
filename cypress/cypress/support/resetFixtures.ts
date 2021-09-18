beforeEach(() => {
    // cy.visit('http://localhost:3000')

    cy.fixture("my-financer-data-20210918.json").then(fixture => fetch("http://localhost:3000/api/profile/my-data", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fixture),
      }));
  })
  