import React, { useEffect } from "react";
import getWeb3 from "../../services/getWeb3";
import PokemonContract from "../../contracts/Pokemon.json";
import { pokemon } from "../../data/pokemon2";
import { Link } from "react-router-dom";
function Profile() {
  // const [web3, setWeb3] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [contract, setContract] = React.useState(null);
  const [pokemonTaken, setPokemonTaken] = React.useState([]);
  const [pokemonDefend, setPokemonDefend] = React.useState([]);

  useEffect(() => {
    initial();
  }, []);

  useEffect(() => {
    fetchPokemonTaken();
    fetchPokemonDefend();
  }, [contract]);

  async function initial() {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PokemonContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PokemonContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // setWeb3(web3);
      setAccount(accounts[0]);
      setContract(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  async function fetchPokemonTaken() {
    if (contract) {
      let pokemonTaken = [];
      const response = await contract.methods.getOwners().call();
      response.forEach((owner, index) => {
        if (owner !== "0x0000000000000000000000000000000000000000") {
          pokemonTaken.push(index);
        }
      });
      console.log(pokemonTaken);
      setPokemonTaken(pokemonTaken);
    }
  }

  async function fetchPokemonDefend() {
    if (contract) {
      const response = await contract.methods.getDefender(account).call();
      const pokemons = response.map((val) => val - 1);
      setPokemonDefend(pokemons);
    }
  }

  async function addPokemonDefend(id) {
    if (contract) {
      const index = pokemonDefend.findIndex((pokemonId) => pokemonId === 0);
      if (index >= 0 && index < 3) {
        if (!pokemonDefend.includes(id)) {
          contract.methods
            .addDefender(account, index, id)
            .send({ from: account }, (error, transactionHash) => {
              console.log(error);
              if (error) {
                // error
              }
              if (transactionHash) {
                // Completed
              }
            });
        }
      }
    }
  }

  async function removePokemonDefend(index) {
    if (contract) {
      if (index >= 0 && index < 3) {
        contract.methods.removeDefender(account, index).send(
          { from: account },
          (error, transactionHash) => {
            console.log(error);
            console.log(transactionHash);
          }
          // { from: account, gas: 50000 },
        );
      }
    }
  }

  function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    if (s === "662") {
      return "662r";
    }
    if (s === "740") {
      return "740le";
    }
    return s;
  }
  const Pokeball =
    "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/Others/pokedex.png";

  return (
    <>
      <header className="h-16 shadow-lg fixed w-full bg-white">
        <div className="max-w-screen-xl m-auto flex justify-between items-center h-full">
          <div className="text-xl font-medium">
            <Link to={"/"}>Pokémon Shop</Link>
          </div>
          {!account ? (
            <button
              // onClick={() => {
              //   activate(Injected);
              // }}
              className="bg-blue-500 rounded-lg text-white px-4 py-2 hover:bg-blue-400 transition-all duration-200"
            >
              Connect Metamask
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span>🦊</span>
              <div className="text-base font-medium">
                {`${account.substring(0, 6)}...${account.substring(
                  account.length - 4,
                  account.length
                )}`}
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="pt-16"></div>
      <main className="bg-slate-50 min-h-screen">
        <section>
          <div className="max-w-screen-xl m-auto p-4">
            <div className="rounded-md border-black border-2 p-4">
              <div className="grid grid-cols-5">
                <div></div>
                {pokemonDefend.map((pokemonId, index) => {
                  if (pokemonId != -1) {
                    return (
                      <div
                        key={`pokecard__${index + 888}`}
                        className="shadow-md rounded-lg bg-white"
                      >
                        <div className="flex justify-between items-center px-4 pt-4 pb-2">
                          <div className="text-lg font-medium">
                            {pokemon[pokemonId].name.english}
                          </div>
                          <div className="flex items-center gap-1">
                            {pokemon[pokemonId].type.map((element, index) => (
                              <span key={`pokecard__${index}`} className="">
                                <img
                                  className=""
                                  src={`https://raw.githubusercontent.com/itsjavi/pokemon-assets/main/assets/img/symbols/type-${element.toLocaleLowerCase()}-badge-32px.png`}
                                  alt=""
                                />
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mx-4">
                          <img
                            src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${padLeadingZeros(
                              pokemon[pokemonId].id,
                              3
                            )}.png`}
                            alt={pokemon[pokemonId].name.english}
                          />
                        </div>
                        <div className="px-4 py-2">
                          <div className="mb-2 bg-green-400 text-white w-full text-center rounded-md border-2 border-green-500 text-sm">
                            {pokemon[pokemonId].base.hp}/
                            {pokemon[pokemonId].base.hp}
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between items-center text-sm">
                              <div>ATK</div>
                              <div className="">
                                {pokemon[pokemonId].base.attack}
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <div>DEF</div>
                              <div className="">
                                {pokemon[pokemonId].base.defense}
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <div>SPD</div>
                              <div className="">
                                {pokemon[pokemonId].base.speed}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-neutral-400">
                              # {pokemon[pokemonId].id}
                            </div>
                            <button
                              onClick={() => removePokemonDefend(index)}
                              className="hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center bg-pink-400 disabled:bg-gray-300 text-white px-4 py-2 gap-2 text-base rounded-lg"
                            >
                              <img
                                className="h-6"
                                src={Pokeball}
                                alt="Pokeball"
                              />
                              Remove!!
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="col-span-1">
                        <div className="flex justify-center items-center">
                          <img src={Pokeball} alt="" />
                        </div>
                      </div>
                    );
                  }
                })}
                <div></div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {pokemon
                .filter((data, index) => {
                  return pokemonTaken.includes(index);
                })
                .map((data, index) => (
                  <div
                    key={`pokecard__${index}`}
                    className="shadow-md rounded-lg bg-white"
                  >
                    <div className="flex justify-between items-center px-4 pt-4 pb-2">
                      <div className="text-lg font-medium">
                        {data.name.english}
                      </div>
                      <div className="flex items-center gap-1">
                        {data.type.map((element, index) => (
                          <span key={`pokecard__${index}`} className="">
                            <img
                              className=""
                              src={`https://raw.githubusercontent.com/itsjavi/pokemon-assets/main/assets/img/symbols/type-${element.toLocaleLowerCase()}-badge-32px.png`}
                              alt=""
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mx-4">
                      <img
                        src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${padLeadingZeros(
                          data.id,
                          3
                        )}.png`}
                        alt={data.name.english}
                      />
                    </div>
                    <div className="px-4 py-2">
                      <div className="mb-2 bg-green-400 text-white w-full text-center rounded-md border-2 border-green-500 text-sm">
                        {data.base.hp}/{data.base.hp}
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between items-center text-sm">
                          <div>ATK</div>
                          <div className="">{data.base.attack}</div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div>DEF</div>
                          <div className="">{data.base.defense}</div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div>SPD</div>
                          <div className="">{data.base.speed}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-neutral-400"># {data.id}</div>
                        <button
                          onClick={() => addPokemonDefend(data.id)}
                          className="hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center bg-pink-400 disabled:bg-gray-300 text-white px-4 py-2 gap-2 text-base rounded-lg"
                        >
                          <img className="h-6" src={Pokeball} alt="Pokeball" />
                          Defend!!
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Profile;
