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
    function catchPokemon(uint256 _pokemonId, uint256 _amount)
        public
        payable
        returns (uint256)
    {
        uint256 _pokeId = _pokemonId - 1;
        require(msg.value == _amount, "Need to send exact amount of wei");
        require(owners[_pokeId] != msg.sender);
        require(owners[_pokeId] == address(0x0));
        require(_pokemonId >= 1 && _pokemonId <= pokemonAmount);

        owners[_pokeId] = msg.sender;
        emit Buying(msg.sender, _pokeId);
        return _pokeId + 1;
    }

    function addDefender(
        address _owner,
        uint256 _index,
        uint256 _pokemonId
    ) public returns (uint256) {
        uint256 _pokeId = _pokemonId - 1;
        require(_index >= 0 && _index <= 2);
        require(owners[_pokeId] == msg.sender);
        require(owners[_pokeId] == _owner);
        require(owners[_pokeId] != address(0x0));
        require(_pokeId >= 0 && _pokeId <= pokemonAmount);
        // Need to +1 because of initial array value = 0
        defenders[_owner][_index] = _pokeId + 1;
        return _pokeId + 1;
    }

    function removeDefender(address _owner, uint256 _index) public {
        require(_index >= 0 && _index <= 2);
        defenders[_owner][_index] = 0;
    }
}
