/* ce contrat bloque des fonds pour jusqu'à une date ("experiation") donnée exprimée en seconde
il est nécessaire d'envoyer les fonds au déploiement. Au delà de la date la fonction "unlock"
entraine la destruction du contrat et retourne les fonds à l'envoyeur initial
On peut se servir de http://www.ethereum-alarm-clock.com/ pour faire l'appel à "unlock" automatiquement*/
pragma solidity ^0.4.6;

contract saving {
  uint public expiration; // timestamp en secondes.
  uint public balance;
  address myAddress = this;
  address owner;


  function saving(uint _expiration) {
    owner = msg.sender;
    expiration = _expiration;
    balance = 1000000;
  }

  function getSavingsDeadline() constant returns (uint) {
      return expiration - block.timestamp;
  }

  function getSavingsAmount() constant returns (uint) {
      return balance;
  }

  function setBalance() returns (uint) {
        balance = 1000000;
        return balance;
    }

  modifier islocked() {
    if (expiration < block.timestamp) _;
    }

  function unlock() islocked(){
      selfdestruct(owner);
  }
}