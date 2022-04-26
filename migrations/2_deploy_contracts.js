/* eslint-disable no-undef */
var Pokemon = artifacts.require("Pokemon");

module.exports = function (deployer) {
  deployer.deploy(Pokemon);
};
