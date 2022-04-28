import getWeb3 from "../services/getWeb3";

export default async function getAccount() {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();

  return {
    account: accounts[0],
  };
}
