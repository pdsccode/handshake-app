
import Handshake from './Handshake';

const handleOutcomeListPayload = payload => payload.map(item => Handshake.handshake(item));

class Outcome {
  static outcome(data) {
    return {
      hid: data.hid || '',
      id: data.id || '',
      name: data.name || '',
      isPrivate: data.is_private || 0,
      handshakes: handleOutcomeListPayload(data.handshakes) || '',
    };
  }
}
export default Outcome;
