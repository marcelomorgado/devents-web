pragma solidity ^0.4.24;

import "./TicketRepository.sol";

contract TicketStore is TicketRepository {

  function issueTicket(uint _deventId, address _to)
    public
    onlyHost(_deventId)
    returns (uint)
  {
    return _createTicket(_deventId, _to);
  }

  function buyTicket(uint _deventId)
    public
    payable
    wasNotFinished(_deventId)
  {
    require(msg.value == devents[_deventId].price);
    _createTicket(_deventId, msg.sender);
    devents[_deventId].balance = devents[_deventId].balance.add(msg.value);
  }

  function _createTicket(uint _deventId, address _to)
    private
    wasNotFinished(_deventId)
    returns (uint)
  {
    tickets.push(Ticket(_deventId));
    uint ticketId = tickets.length - 1;
    ticketToOwner[ticketId] = _to;
    ownerTicketsCount[_to] = ownerTicketsCount[_to].add(1);
    ownerToTickets[_to][_deventId].push(ticketId);
    emit TicketCreated(ticketId);
    return ticketId;
  }

  function withdrawal(uint _deventId)
    public
    onlyHost(_deventId)
  {
    uint withdraw_amount = devents[_deventId].balance;
    require(withdraw_amount > 0);
    devents[_deventId].balance = 0;
    msg.sender.transfer(withdraw_amount);
  }
}
