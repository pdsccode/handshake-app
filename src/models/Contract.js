
class Contract {
  static contract(data) {
    return {
      id: data.id || '',
      contractName: data.contract_name || '',
      contractAddress: data.contract_address || '',
      contractJson: data.json_name || '',
    };
  }
}
export default Contract;
