// const TicketService = import("../src/pairtest/TicketService");
const TicketService = require("../src/pairtest/TicketService");

describe("Ticket Service", () => {
  it("returns a price", () => {
    const ticketService = new TicketService();
    const actual = ticketService.getPrices(1, "ADULT");
    const expected = 20;

    expect(actual).toEqual(expected);
  });
});
