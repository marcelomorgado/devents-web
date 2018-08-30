pragma solidity ^0.4.24;

import "./Ownable.sol";

contract DEventRepository is Ownable {

  event DEventCreated(uint deventId);
  event DEventUpdated(uint deventId);
  event TicketCreated(uint ticketId);

  DEvent[] public devents;

  struct DEvent {
    address host;
    string title;
    string imageHash;
    string shortInfo;
    string url;
    uint32 start;
    uint32 end;
    uint price;
    uint balance;
  }

  modifier onlyHost(uint _deventId) {
    require(msg.sender == devents[_deventId].host);
    _;
  }

  modifier isUpcoming(uint _deventId) {
    require(now < devents[_deventId].start);
    _;
  }

  modifier inProgress(uint _deventId) {
    require(devents[_deventId].start <= now && now <= devents[_deventId].end);
    _;
  }

  modifier wasFinished(uint _deventId) {
    require(devents[_deventId].end < now);
    _;
  }

  modifier wasNotFinished(uint _deventId) {
    require(now <= devents[_deventId].end);
    _;
  }

  function createDEvent(
    string _title,
    string _imageHash,
    string _shortInfo,
    string _url,
    uint32 _start,
    uint32 _end,
    uint _price
  )
    public
    returns (uint)
  {
    devents.push(DEvent(
      msg.sender, _title, _imageHash, _shortInfo, _url, _start, _end, _price, 0
    ));
    emit DEventCreated(devents.length - 1);
    return devents.length - 1;
  }

  function getDEventsCount()
    public
    view
    returns (uint)
  {
    return devents.length;
  }

  function updateDEvent(
    uint _deventId,
    string _title,
    string _imageHash,
    string _shortInfo,
    string _url,
    uint32 _start,
    uint32 _end,
    uint _price
  )
    public
    onlyHost(_deventId)
  {
    devents[_deventId].title = _title;
    devents[_deventId].imageHash = _imageHash;
    devents[_deventId].shortInfo = _shortInfo;
    devents[_deventId].url = _url;
    devents[_deventId].start = _start;
    devents[_deventId].end = _end;
    devents[_deventId].price = _price;
    emit DEventUpdated(_deventId);
  }

}
