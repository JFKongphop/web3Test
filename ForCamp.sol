/**
 *Submitted for verification at kovan-optimistic.etherscan.io on 2022-07-16
*/

// https://kovan-optimistic.etherscan.io/address/0x6079460CC55909fBbd538aB97D54a03390a405f5#code

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForCamp{
    // is can use only owner    
    address public owner;
    uint totalBalance;
    mapping(address => uint) balances; // get of address with balance in this address

    // event can show data in terminal when use 
    event Deposit(address from, address to, uint amount);
    event SendTo(address from, address receiver, uint amount);
    event ReceiveEther(address from, address receiver, uint amount);

    constructor(){
        owner = msg.sender;
    }

    receive() external payable{
        emit ReceiveEther(msg.sender, address(this), msg.value);
    }

    // get ether to this function in uint mapping
    function deposit() external payable {
        emit Deposit(msg.sender, address(this), msg.value);
    }

    // get back after deposit
    // only owner
    function withdraw(uint _amount) public{
        // require(owner == msg.sender, "Unauthorized, only owner");
        payable(msg.sender).transfer(_amount);
    }

    // send to address receive
    // only owner
    function sendToReceive(address payable _receive, uint _amount) external{
        // require(owner == msg.sender, "Unauthorized, only owner");
        _receive.transfer(_amount);
        emit SendTo(address(this), _receive, totalBalance);
    }

    // get balance when deposit
    function getBalance() public view returns(uint){
        return address(this).balance;
    }
}