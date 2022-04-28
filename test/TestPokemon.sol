// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Pokemon.sol";

contract TestPokemon {
    uint256 public initialBalance = 10 ether;

    // The address of the adoption contract to be tested
    Pokemon pokemon = Pokemon(DeployedAddresses.Pokemon());

    // The id of the pokemon that will be used for testing
    // ## PIKACHU
    uint256 expectedPokemonId = 25;

    //The expected owner of adopted pet is this contract
    address expectedOwner = address(this);

    // Testing the adopt() function
    /// #value: 100
    function testUserCanCatchPokemon() public payable {
        uint256 returnedId = pokemon.catchPokemon(expectedPokemonId, 100);
        Assert.equal(
            returnedId,
            expectedPokemonId,
            "Pokemon should get catched."
        );
    }

    // Testing retrieval of a single pet's owner
    function testGetOwnerAddressByPokemonId() public {
        address owner = pokemon.owners(expectedPokemonId);

        Assert.equal(
            owner,
            expectedOwner,
            "Owner of the expected pokemon should be this contract"
        );
    }

    // Testing retrieval of all pet owners
    function testGetAdopterAddressByPetIdInArray() public {
        // Store adopters in memory rather than contract's storage
        address[809] memory owners = pokemon.getOwners();

        Assert.equal(
            owners[expectedPokemonId],
            expectedOwner,
            "Owner of the expected pokemon should be this contract"
        );
    }

    function testUserAddDefender() public {
        uint256 returnedId = pokemon.addDefender(
            expectedOwner,
            0,
            expectedPokemonId
        );
        Assert.equal(
            returnedId,
            expectedPokemonId,
            "Pokemon should go to owner defender site"
        );
    }

    // Testing retrieval of a single pet's owner
    function testDefenderByOwnerAddress() public {
        uint256 defenders = pokemon.defenders(expectedOwner, 0);

        Assert.equal(
            defenders,
            expectedPokemonId,
            "This contract defender should have this pokemon ID"
        );
    }

    // Testing retrieval of all pet owners
    function testGetDefenderByOwnerAddress() public {
        // Store adopters in memory rather than contract's storage
        uint256[3] memory defenders = pokemon.getDefender(expectedOwner);

        Assert.equal(
            defenders[0],
            expectedPokemonId,
            "This contract defender should have this pokemon ID"
        );
    }

    function testRemoveDefenderByOwnerAddress() public {
        // Store adopters in memory rather than contract's storage
        pokemon.removeDefender(expectedOwner, 0);

        uint256[3] memory defenders = pokemon.getDefender(expectedOwner);

        Assert.equal(
            defenders[0],
            0,
            "This contract defender should have this pokemon ID"
        );
    }
}
