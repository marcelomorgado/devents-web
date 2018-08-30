// /*global contract, config, it, assert*/
const TicketStore = require('Embark/contracts/TicketStore');

config({
  contracts: {
    "TicketStore": {
      //args: [100]
    }
  }
});

contract("TicketStore", function () {

  this.timeout(0);


  before(async function() {
     // runs before all tests in this block
     //this.ticketStore = await TicketStore.new();
     //this.ticketStore = await TicketStore.at('0x4a57ee84a884846ce1db676e4726041168e1c4c8');

     let accounts = await web3.eth.getAccounts();
     this.ana = accounts[0];
     this.bob = accounts[1];
   });


  it("should create an new devent", async function () {

    let before = await TicketStore.methods.getDEventsCount().call();

    await TicketStore.methods.createDEvent(
      'Anarchapulco',
      'QmUwZjYy5JYaAVwF3WXSQmasPK4KhdiVpWLVXxa4ewk7EV',
      'Make Anarchy Great Again',
      'http://www.google.com',
      new Date('2018-06-01 10:00').getTime()/1000,
      new Date('2018-12-01 10:00').getTime()/1000,
      web3.utils.toWei('1', 'ether')
    ).send({from: this.ana});

    let after = await TicketStore.methods.getDEventsCount().call();

    assert(before < after);
  });

  it("should issue a ticket", async function () {

    let dEventId = 0;

    await TicketStore.methods.issueTicket(dEventId, this.ana).send({from: this.ana});

    let anaBalance = await TicketStore.methods.balanceOf(this.ana).call();
    let anaEventBalance = await TicketStore.methods.eventBalanceOf(this.ana, dEventId).call();

    assert(anaBalance == 1, 'anaBalance='+anaBalance);
    assert(anaEventBalance == 1, 'anaEventBalance='+anaEventBalance);

    let tokenIds = await TicketStore.methods.eventTicketsOf(this.ana, dEventId).call();

    assert(tokenIds.length == 1, tokenIds);
  });

  it("should transfer a ticket", async function () {

    let dEventId = 0;
    let ticketIds = await TicketStore.methods.eventTicketsOf(this.ana, dEventId).call();
    assert(ticketIds.length == 1, ticketIds);
    let ticketId = ticketIds[0];

    let ticketOwner = await TicketStore.methods.ticketToOwner(0).call();

    await TicketStore.methods.transfer(this.bob, ticketId).send({from: this.ana});

    let anaBalance = await TicketStore.methods.balanceOf(this.ana).call();
    let anaEventBalance = await TicketStore.methods.eventBalanceOf(this.ana, dEventId).call();

    let bobBalance = await TicketStore.methods.balanceOf(this.bob).call();
    let bobEventBalance = await TicketStore.methods.eventBalanceOf(this.bob, dEventId).call();

    assert(bobBalance == 1, 'bobBalance='+bobBalance);
    assert(bobEventBalance == 1, 'bobEventBalance='+bobEventBalance);
    
    assert(anaBalance == 0, 'anaBalance='+anaBalance);
    assert(anaEventBalance == 0, 'anaEventBalance='+anaEventBalance);


  });


});
