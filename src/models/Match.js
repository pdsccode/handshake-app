import Outcome from './Outcome';
import Contract from './Contract';


const handleOutcomeListPayload = payload => payload.map(item => Outcome.outcome(item));
const handleContractPayload = item => Contract.contract(item);

class Match {
  static match(data) {
    return {
      id: data.id || '',
      awayTeamCode: data.awayTeamCode || '',
      awayTeamFlag: data.awayTeamFlag || '',
      awayTeamName: data.awayTeamName || '',
      date: data.date || '',
      homeTeamCode: data.homeTeamCode || '',
      homeTeamFlag: data.homeTeamFlag || '',
      homeTeamName: data.homeTeamName || '',
      name: data.name || '',
      marketFee: data.market_fee || '',
      contract: handleContractPayload(data.contract) || {},
      outcomes: handleOutcomeListPayload(data.outcomes) || '',
    };
  }
}
export default Match;
