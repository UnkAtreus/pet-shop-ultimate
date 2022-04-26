// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Pokemon {
    address[809] public owners;

    mapping(address => uint256[3]) public defenders;
    uint256 pokemonAmount = 809;

    event Buying(address indexed byId, uint256 pokenId);

    function getOwners() public view returns (address[809] memory) {
        return owners;
    }

    function getDefender(address _owner)
        public
        view
        returns (uint256[3] memory)
    {
        return defenders[_owner];
    }

    // function catchPokemon(uint256 _pokemonId, uint256 _amount) public payable {
    function catchPokemon(uint256 _pokemonId, uint256 _amount) public payable {
        require(msg.value == _amount, "Need to send exact amount of wei");
        require(owners[_pokemonId] != msg.sender);
        require(owners[_pokemonId] == address(0x0));
        require(_pokemonId >= 0 && _pokemonId <= pokemonAmount);

        owners[_pokemonId] = msg.sender;
        emit Buying(msg.sender, _pokemonId);
    }

    function addDefender(
        address _owner,
        uint256 _index,
        uint256 _pokemonId
    ) public {
        require(_index >= 0 && _index <= 2);
        require(owners[_pokemonId] == msg.sender);
        require(owners[_pokemonId] == _owner);
        require(owners[_pokemonId] != address(0x0));
        require(_pokemonId >= 0 && _pokemonId <= pokemonAmount);

        defenders[_owner][_index] = _pokemonId;
    }

    function removeDefender(address _owner, uint256 _index) public {
        require(_index >= 0 && _index <= 2);
        defenders[_owner][_index] = 0;
    }
}
