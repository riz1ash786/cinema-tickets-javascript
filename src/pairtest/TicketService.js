const TicketTypeRequest = require("./lib/TicketTypeRequest.js");
// import TicketTypeRequest from "./lib/TicketTypeRequest.js";
const InvalidPurchaseException = require("./lib/InvalidPurchaseException.js");
// import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
const TicketPaymentService = require("../thirdparty/paymentgateway/TicketPaymentService");
// import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService";
class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  priceList = {
    ADULT: 20,
    CHILD: 10,
    INFANT: 0,
  };

  // getTypes returns an object which shows how many of each type of ticket came in the requests
  getTypes = (ttrs) => {
    let types = {
      ADULT: 0,
      CHILD: 0,
      INFANT: 0,
    };

    ttrs.forEach((type) => types[type]++);
    return types;
  };

  // Returns the total cost of all tickets of different types
  getTotal = (tickets) => {
    const prices = tickets.map((ticket) => {
      this.priceList[ticket.type] * ticket.quantity;
    });

    return prices.reduce((a, b) => a + b, 0);
  };

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    const types = this.getTypes(ticketTypeRequests);

    const ticketTypes = ["ADULT", "INFANT", "CHILD"];
    // Returns an array of objects, each object will have a type and a quantity key:
    // {
    //  type: 'ADULT',
    //  quantity: 6
    // }
    const validTickets = ticketTypes.map((type) => {
      const t = type;
      const l = types[type];
      const ttr = new TicketTypeRequest(t, l);

      return {
        type: ttr.getTicketType(),
        quantity: ttr.getNoOfTickets(),
      };
      //  [
      //    {
      //      type: 'ADULT',
      //      quantity: 2
      //    },
      //    {
      //     type: 'CHILD',
      //     quantity: 1
      //   },
      //   {
      //     type: 'INFANT',
      //     quantity: 0
      //   }
      //  ]
    });

    const totalPrice = this.getTotal(validTickets);
    // totalPrice = 50

    const tps = new TicketPaymentService();

    // Makes the payment via ticketPaymentService
    tps.makePayment(accountId, totalPrice);
  }
}

module.exports = TicketService;
