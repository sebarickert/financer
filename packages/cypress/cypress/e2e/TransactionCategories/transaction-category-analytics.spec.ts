describe('Transaction category analytics', () => {
  beforeEach(() => {
    cy.applyFixture('large');
  });

  const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

  it('Should return correct amounts when category has incomes and expenses', () => {
    // 623b58ada3deba9879422fbf = Category for all types
    cy.request(
      '/api/transactions/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf'
    ).then((response) => {
      expect(response.status).to.eq(200);
      const [body] = response.body;

      expect(body.totalCount).to.eq(4);
      expect(body.incomesCount).to.eq(2);
      expect(body.expensesCount).to.eq(2);
      expect(body.transferCount).to.eq(0);

      expect(roundToTwoDecimals(body.totalAmount)).to.eq(872.95);
      expect(roundToTwoDecimals(body.incomeAmount)).to.eq(3367.11);
      expect(roundToTwoDecimals(body.expenseAmount)).to.eq(2494.16);
      expect(roundToTwoDecimals(body.transferAmount)).to.eq(0);
    });

    cy.request(
      '/api/incomes/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf'
    ).then((response) => {
      expect(response.status).to.eq(200);
      const [body] = response.body;

      expect(body.totalCount).to.eq(2);
      expect(body.incomesCount).to.eq(2);
      expect(body.expensesCount).to.eq(2);
      expect(body.transferCount).to.eq(0);

      expect(roundToTwoDecimals(body.totalAmount)).to.eq(3367.11);
      expect(roundToTwoDecimals(body.incomeAmount)).to.eq(3367.11);
      expect(roundToTwoDecimals(body.expenseAmount)).to.eq(2494.16);
      expect(roundToTwoDecimals(body.transferAmount)).to.eq(0);
    });

    cy.request(
      '/api/expenses/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf'
    ).then((response) => {
      expect(response.status).to.eq(200);
      const [body] = response.body;

      expect(body.totalCount).to.eq(2);
      expect(body.incomesCount).to.eq(2);
      expect(body.expensesCount).to.eq(2);
      expect(body.transferCount).to.eq(0);

      expect(roundToTwoDecimals(body.totalAmount)).to.eq(2494.16);
      expect(roundToTwoDecimals(body.incomeAmount)).to.eq(3367.11);
      expect(roundToTwoDecimals(body.expenseAmount)).to.eq(2494.16);
      expect(roundToTwoDecimals(body.transferAmount)).to.eq(0);
    });

    cy.request(
      '/api/transfers/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf'
    ).then((response) => {
      expect(response.status).to.eq(200);
      const [body] = response.body;

      expect(body.totalCount).to.eq(0);
      expect(body.incomesCount).to.eq(2);
      expect(body.expensesCount).to.eq(2);
      expect(body.transferCount).to.eq(0);

      expect(roundToTwoDecimals(body.totalAmount)).to.eq(0);
      expect(roundToTwoDecimals(body.incomeAmount)).to.eq(3367.11);
      expect(roundToTwoDecimals(body.expenseAmount)).to.eq(2494.16);
      expect(roundToTwoDecimals(body.transferAmount)).to.eq(0);
    });
  });
});
