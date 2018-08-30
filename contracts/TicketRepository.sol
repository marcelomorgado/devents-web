pragma solidity ^0.4.24;

import "./ERC721.sol";
import "./DEventRepository.sol";
import "./SafeMath.sol";

contract TicketRepository is DEventRepository, ERC721 {

  using SafeMath for uint256;

  Ticket[] public tickets;

  mapping(uint => address) public ticketToOwner;
  mapping(address => uint) public ownerTicketsCount;
  mapping(uint => address) ticketApprovals;
  mapping(address => mapping(uint => uint[])) public ownerToTickets;

  function eventBalanceOf(address _owner, uint _deventId)
    public
    view
    returns (uint256 _balance)
  {
    return ownerToTickets[_owner][_deventId].length;
  }

  function eventTicketsOf(address _owner, uint _deventId)
    public
    view
    returns (uint[] _ticketIds)
  {
    return ownerToTickets[_owner][_deventId];
  }

  struct Ticket {
    uint dEventId;
  }

  modifier onlyOwnerOf(uint _ticketId) {
    require(msg.sender == ticketToOwner[_ticketId]);
    _;
  }

  function balanceOf(address _owner)
    public
    view
    returns (uint256 _balance)
  {
    return ownerTicketsCount[_owner];
  }

  function ownerOf(uint256 _tokenId)
    public
    view
    returns (address _owner)
  {
    return ticketToOwner[_tokenId];
  }

  function transfer(address _to, uint256 _tokenId)
    public
    onlyOwnerOf(_tokenId)
  {
    _transfer(msg.sender, _to, _tokenId);
  }

  function approve(address _to, uint256 _tokenId)
    public
    onlyOwnerOf(_tokenId)
  {
    ticketApprovals[_tokenId] = _to;
    emit Approval(msg.sender, _to, _tokenId);
  }

  function takeOwnership(uint256 _tokenId)
    public
  {
    require(ticketApprovals[_tokenId] == msg.sender);
    address owner = ownerOf(_tokenId);
    _transfer(owner, msg.sender, _tokenId);
  }

  function _transfer(address _from, address _to, uint256 _tokenId)
    private
  {
    uint dEventId = tickets[_tokenId].dEventId;
    
    ownerTicketsCount[_to] = ownerTicketsCount[_to].add(1);
    ownerTicketsCount[msg.sender] = ownerTicketsCount[msg.sender].sub(1);

    ownerToTickets[_to][dEventId].push(_tokenId);
    ownerToTickets[msg.sender][dEventId].length--;

    ticketToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

}
