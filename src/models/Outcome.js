
import Handshake from './Handshake';
import Contract from './Contract';

const handleOutcomeListPayload = payload => payload.map(item => Handshake.handshake(item));
const handleContractPayload = item => Contract.contract(item);

class Outcome {
  static outcome(data) {
    return {
      hid: data.hid || '',
      id: data.id || '',
      name: data.name || '',
      public: data.public || 0,
      handshakes: handleOutcomeListPayload(data.handshakes) || '',
      contract: handleContractPayload(data.contract) || {},
    };
  }
}
export default Outcome;
