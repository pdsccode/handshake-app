import ReferalItem from './ReferalItem';

class Referal {
  static referal(data) {
    const result = Object.entries(data).map(([key, value]) => {
      return ReferalItem.referalItem(value);
    });

    return result;
  }
}

export default Referal;
