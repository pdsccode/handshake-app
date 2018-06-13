export default {
  HELLO: 'hello {name}',
  buy: 'Buy',
  sell: 'Sell',
  amount: 'amount',
  askUsingCreditCard: 'for {total} {fiatCurrency} using card?',
  change: 'Change',
  ccNumber: 'Number',
  ccExpire: 'Expiry',
  ccCVC: 'CVC',
  overCCLimit: 'Your limit is {currency}{limit}. You have already used {currency}{amount} ',

  required: 'Required',
  ccExpireTemplate: 'MM/YY',
  securityCode: '325',
  shakeNow: 'Shake',
  offerHandShakeContent: '{offerType} {amount} {currency} for {total} {currency_symbol} in {payment_method}?',
  offerHandShakeContentMe: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  offerHandShakeContentMeDone: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  instantOfferHandShakeContent: 'You{just}{offerType} {amount} {currency} for {total} {currency_symbol} on your card - fee {fee}%',
  offerDistanceContent: '{distanceKm} km ({distanceMiles} miles) away',
  transactonOfferInfo: 'Successful ({success}) / Failed ({failed})',
  createOfferConfirm: 'You are about to {type} {amount} {currency} for {total} {currency_symbol}',
  handshakeOfferConfirm: 'You are about to {type} {amount} {currency} for {total} {currency_symbol}',
  rejectOfferConfirm: 'Do you want to Reject this handshake? You will not be able to make transactions for 4 hours.',
  completeOfferConfirm: 'Do you want to Complete this handshake?',
  withdrawOfferConfirm: 'Do you want to Withdraw this handshake?',
  cancelOfferConfirm: 'Do you want to Cancel this handshake?',
  closeOfferConfirm: 'Do you want to Close this handshake?',
  acceptOfferConfirm: 'Do you want to Accept this handshake?',
  createOfferSuccessMessage: 'Create offer success',
  shakeOfferSuccessMessage: 'Shake offer success',
  closeOfferSuccessMessage: 'Close offer success',
  completeShakedfferSuccessMessage: 'Complete shaked offer success',
  cancelShakedfferSuccessMessage: 'Cancel shaked offer success',
  withdrawShakedfferSuccessMessage: 'Withdraw shaked offer success',
  buyUsingCreditCardSuccessMessge: 'Buy using Card success',
  notEnoughCoinInWallet: 'You only have {amount}({currency}) in default wallet {currency}. Fee ~ {fee}({currency}). Please add more',

  createOfferStoreConfirm: 'Do you want to create offer Buy {amountBuy} {currency} - Sell {amountSell} {currency}?',
  notEnoughCoinInWalletStores: 'You only have {amount}({currency}) in default wallet {currency}. Fee ~ {fee}({currency}). Please add more',
  addOfferItemSuccessMassage: 'Add offer item success',
  deleteOfferItemSuccessMassage: 'Delete offer item success',
  shakeOfferItemSuccessMassage: 'Shake offer item success',
  acceptOfferItemSuccessMassage: 'Accept offer item success',
  cancelOfferItemSuccessMassage: 'Cancel offer item success',
  rejectOfferItemSuccessMassage: 'Reject offer item success',
  completeOfferItemSuccessMassage: 'Complete offer item success',
  offerStoresAlreadyCreated: 'You have already create offer',
  offerStoreHandShakeContent: '{offerTypeBuy} {amountBuy} {currency} at {fiatAmountBuy} {fiatAmountCurrency}. {offerTypeSell} {amountSell} {currency} at {fiatAmountSell} {fiatAmountCurrency}',

  // FAQ
  FAQ_TITLE: 'FAQ',
  FAQ_HEADER_YELLOW: '',
  FAQ_HEADER: 'Décentralisé de prédiction change ',
  FAQ_DATA: [
    {
      question: 'quel est le Ninja PEX ?',
      answer: 'Ninja est un échange anonyme-to-peer décentralisé prédiction en cours d’exécution sur le dessus de l’Ethereum blockchain.',
    },
    {
      question: '',
      answer: '',
    },
    {
      question: '',
      answer: '',
    },
    {
      question: '',
      isList: true,
      answer: [
        {
          title: '',
          content: '',
        },
        {
          title: '',
          content: '',
        },
        {
          title: '',
          content: 'pain), the outcomes (i.e. Brazil wins) and the site (i.e. support or bet against the outcome)\n' +
          'Enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 1/ 2.25)\n' +
          'The PEX Matching Engine will then find another order that bets against the odds you set.',
        },
        {
          title: '',
          content: '',
        },
      ],
    },
    {
      question: '',
      answer: '',
    },
    {
      question: '',
      answer: '',
    },
    {
      question: '',
      answer: '',
    },
    {
      question: 'Where is the coin held?',
      answer: 'No one holds the funds. All the funds are kept safe in escrow until a resolution is reached.',
    },
    {
      question: 'Why should I bet on blockchain instead of using traditional methods?',
      answer: 'A decentralized prediction exchange will provide you the freedom to create your own odds and bet directly with anyone, offer you 100% ninja anonymity and guaranteed payouts.',
    },
    {
      question: 'How about privacy and anonymity?',
      answer: 'Ninja requires no downloads, and no sign ups. That means no passwords, no phone numbers and no emails. 100% anonymity.',
    },
    {
      question: 'Do I need to pay any fees?',
      answer: 'There are two main types of fees: creator fees (for the ninja that creates the bet) and the network fee (a percentage of the creator fee, that goes towards maintaining the platform).',
    },
    {
      question: 'What do I need to do when the outcome is finalized?',
      answer: 'Nothing. If you win, your winnings will be automatically transferred to your account. If you lose, it will be someone else’s account.',
    },
    {
      question: 'Where can I find a match to bet on?',
      answer: 'On the homepage, you’ll be able to browse ongoing bets and markets. If you can’t find any you like, create your own!',
    },
    {
      question: 'Other than sports, can I bet on anything else? How does it work?',
      answer: 'Very soon, Ninja will apply to everything under the sun. The only limitation will be your creativity. You can easily create any market on any future event, be it sports, politics, science, markets, climate… you name it.',
    },
    {
      question: 'What’s gonna happen to the Handshake mobile app?',
      answer: 'We will be integrating Handshake (and your favourite features like promises, IOUs, contract upload, etc.) into the Ninja mobile website.',
    },
  ],
};
