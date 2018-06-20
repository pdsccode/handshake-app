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
  overCCLimit: 'You have reached your credit card limit! You have already used {currency}{amount} in the dojo today. ',

  required: 'Required',
  ccExpireTemplate: 'MM/YY',
  securityCode: '325',
  shakeNow: 'Shake',
  offerHandShakeContent: '{offerType} {amount} {currency} for {total} {currency_symbol} in {payment_method}?',
  offerHandShakeContentMe: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  offerHandShakeExchangeContentMe: '{offerType} {something} for {amount} {currency}',
  offerHandShakeContentMeDone: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  offerHandShakeExchangeContentMeDone: '{offerType} {something} for {amount} {currency}',
  instantOfferHandShakeContent: 'You{just}{offerType} {amount} {currency} for {total} {currency_symbol} on your card - fee {fee}%',
  offerDistanceContent: '{distance} away',
  transactonOfferInfo: 'Successful ({success}) / Failed ({failed})',
  createOfferConfirm: 'You are about to {type} {amount} {currency} for {total} {currency_symbol}',
  handshakeOfferConfirm: 'You are about to {type} {amount} {currency} for {total} {currency_symbol}',
  rejectOfferConfirm: 'Do you want to Reject this handshake? You will not be able to make transactions for 4 hours.',
  completeOfferConfirm: 'Finish shaking?',
  withdrawOfferConfirm: 'Are you sure you want to withdraw?',
  cancelOfferConfirm: 'Cancel this order?',
  closeOfferConfirm: 'Finish your order?',
  acceptOfferConfirm: 'Accept the order?',
  createOfferSuccessMessage: 'Success! You have created an offer on Ninja.',
  shakeOfferSuccessMessage: 'Success! A ninja has shaked on your order.',
  closeOfferSuccessMessage: 'Success! Your order is now closed.',
  completeShakedfferSuccessMessage: 'You have successfully shaked on Ninja',
  cancelShakedfferSuccessMessage: 'You have cancelled your order ',
  withdrawShakedfferSuccessMessage: 'Your offer has been withdrawn.',
  buyUsingCreditCardSuccessMessge: 'Your order using your credit card has gone through.',
  notEnoughCoinInWallet: 'You don\'t have enough coin right now. Please top up your wallet.',

  createOfferStoreConfirm: 'Do you want to set up an offer to {intentMsg}?',
  notEnoughCoinInWalletStores: 'You don\'t have enough coin right now. Please top up your wallet.',
  addOfferItemSuccessMassage: 'Success! Your order is now listed on Ninja',
  deleteOfferItemSuccessMassage: 'You have successfully deleted your order.',
  shakeOfferItemSuccessMassage: 'You have successfully shaked on Ninja',
  acceptOfferItemSuccessMassage: 'Good news! Your order has been accepted.',
  cancelOfferItemSuccessMassage: 'Your order has been cancelled!',
  rejectOfferItemSuccessMassage: 'You rejected a fellow ninja\'s order.',
  completeOfferItemSuccessMassage: 'Good news! Your order has been completed.',
  offerStoresAlreadyCreated: 'Oops! You already created an order on Ninja.',
  offerStoreHandShakeContent: '{offerTypeBuy} {amountBuy} {currency} at {fiatAmountBuy} {fiatAmountCurrency}. {offerTypeSell} {amountSell} {currency} at {fiatAmountSell} {fiatAmountCurrency}',
  requireDefaultWalletOnMainNet: 'You must set your wallet on Mainnet',
  movingCoinToEscrow: 'Moving your coin to escrow. This may take a few minutes.',
  movingCoinFromEscrow: 'Moving your coin from escrow. This may take a few minutes.',
  'ex.create.label.amountBuy': 'I want to buy',
  'ex.create.label.amountSell': 'I want to sell',
  'ex.create.label.marketPrice': 'Current market price',
  'ex.create.label.premiumBuy': 'My price',
  'ex.create.label.premiumSell': 'My price',
  'ex.create.label.premiumSellExplanation': 'Market price ± percentage',
  'ex.create.label.nameStation': 'Station name',
  'ex.create.label.phone': 'Phone',
  'ex.create.label.address': 'Meet-up place',
  'ex.create.label.beASeller': 'Be a seller',
  'ex.create.label.beABuyer': 'You can also be a buyer',
  'ex.create.label.stationInfo': 'Station information',

  'ex.createLocal.label.iWantTo': 'I want to',
  'ex.createLocal.placeholder.anyItem': 'any item or service',
  'ex.createLocal.label.coin': 'Coin',
  'ex.createLocal.label.amount': 'Amount',
  'ex.createLocal.label.phone': 'Phone',
  'ex.createLocal.label.address': 'Meet-up place',

  'ex.discover.label.priceBuy': 'BUY',
  'ex.discover.label.priceSell': 'SELL',
  'ex.discover.label.reviews': '({reviewCount})',
  'ex.discover.banner.text': 'Got coins? Turn them into a money-making machine.',
  'ex.discover.banner.btnText': 'BECOME A LOCAL EXCHANGE',
  'ex.discover.shakeDetail.label.amount': 'Amount',
  'ex.discover.shakeDetail.label.total': 'Total',
  'ex.discover.shakeDetail.label.maximum': 'Maximum:',
  'ex.me.label.with': 'With',
  'ex.me.label.from': 'From',
  'ex.me.label.about': 'About',
  'ex.btn.confirm': 'Confirm',
  'ex.btn.OK': 'OK',
  'ex.btn.notNow': 'Not now',

  'ex.label.buy': 'Buy',
  'ex.label.sell': 'Sell',
  'ex.label.bought': 'Bought',
  'ex.label.sold': 'Sold',
  'ex.label.buying': 'Buying',
  'ex.label.selling': 'Selling',
  'ex.label.buyer': 'buyer',
  'ex.label.seller': 'seller',

  'ex.exchange.status.created': 'created',
  'ex.exchange.status.active': 'active',
  'ex.exchange.status.closing': 'closing',
  'ex.exchange.status.closed': 'closed',
  'ex.exchange.status.shaking': 'shaking',
  'ex.exchange.status.shake': 'shake',
  'ex.exchange.status.completing': 'completing',
  'ex.exchange.status.completed': 'completed',
  'ex.exchange.status.withdrawing': 'withdrawing',
  'ex.exchange.status.withdraw': 'withdraw',
  'ex.exchange.status.rejecting': 'rejecting',
  'ex.exchange.status.rejected': 'rejected',

  'ex.cc.status.processing': 'Processing',
  'ex.cc.status.success': 'Done',
  'ex.cc.status.cancelled': 'Failed',

  'ex.shop.status.created': 'Verifying...',
  'ex.shop.status.active': 'Active',
  'ex.shop.status.closing': 'Pending...',
  'ex.shop.status.closed': 'Closed',

  'ex.shop.shake.status.pre_shaking': 'Shake pending',
  'ex.shop.shake.status.pre_shake': 'Shook',
  'ex.shop.shake.status.shaking': 'Shake pending...',
  'ex.shop.shake.status.shake': 'Shook',
  'ex.shop.shake.status.rejecting': 'Rejecting',
  'ex.shop.shake.status.rejected': 'Rejected',
  'ex.shop.shake.status.completing': 'Completing...',
  'ex.shop.shake.status.completed': 'Done',
  'ex.shop.shake.status.cancelling': 'Cancelling',
  'ex.shop.shake.status.cancelled': 'Cancelled',

  'ex.error.systemError': 'Sorry Ninja. Something went wrong. Come back soon.',
  'ex.error.312': 'Oh no! You cancelled your offer. You will not be able to make orders for 4 hours. Sorry',
  'ex.error.313': 'You already have a listing! To change your rates, please cancel your current listing.',
  'ex.error.314': 'Looks like that listing has been deleted.',
  'ex.error.315': 'Sorry ninja, someone else got there first.',
  'ex.error.1': 'Oops! Something went wrong. Come back soon.',
  'ex.error.3': 'It looks like that token is invalid.',
  'ex.error.301': 'You are already a ninja.',
  'ex.error.302': 'Sorry, that ninja does not exist.',
  'ex.error.303': 'It looks like you have reached your credit card limit.',
  'ex.error.309': 'You already have a listing! To change your rates, please cancel your current listing.',
  'ex.error.default': 'Oops! Something went wrong.',

  'error.required': 'Required',
  'error.requiredOne': 'You need to fill in one of these!',
  'error.greaterThan': 'Must be greater than {min}',
  'error.lessThan': 'Must be less than {max}',

  'btn.initiate': 'Initiate',
  'btn.shake': 'Shake',
  'btn.reject': 'Reject',
  'btn.complete': 'Complete',
  'btn.withdraw': 'Withdraw',
  'btn.cancel': 'Cancel',
  'btn.close': 'Close',
  'btn.accept': 'Accept',

  // FAQ
  FAQ_TITLE: '자주 묻는 질문(FAQ)',
  FAQ_HEADER_YELLOW: '',
  FAQ_HEADER: '예측 Exchange 분산',
  FAQ_DATA: [
    {
      question: '닌자 PEX는 무엇입니까? ',
      answer: '닌자는 테리 blockchain 위에 실행 하는 익명 피어-투-피어 분산된 예측 교환. ',
    },
    {
      question: 'PEX에 대 한 특별 한 무엇입니까? 왜 내가 하나 내기를 한다?',
      answer: '당사자를 중앙 기관 또는 도박을 거치지 않고 직접 서로 대 한 내기 수 있습니다. 이것은 100% 익명, 필요 없는 다운로드를 흔적. 베팅의 관리 및 위 닝의 정착은 총칭 의해 수행 실패의 모든 단일 지점에서 사용자를 보호 하는 blockchain 네트워크. 또한 자신의 예측 시장 만들 수 있습니다. ',
    },
    {
      question: '에테르 필요 합니까? 그것은 다른 cryptocurrencies를 지원 합니까?',
      answer: '네입니다. 닌자만 지금, ETH를 수락 하지만 지원 다른 통화에 대 한 곧 추가 될 것 이다.',
    },
    {
      question: '닌자 어떻게 시작 합니까?',
      isList: true,
      answer: [
        {
          title: '에테르를 얻을:',
          content: '귀하의 신용 카드 또는 Coinbase 또는 Binance 같은 인기 있는 동전 교환에 직접 PEX에에서 ETH를 구입할 수 있습니다.',
        },
        {
          title: 'PEX 지갑 가기:',
          content: 'PEX 지갑에는 ETH를 전송 합니다. PEX 지갑은 완전히 분산, 귀하의 휴대 전화에 개인 키를 개최만 전송할 수 있고 ETH를 받을.',
        },
        {
          title: '배 팅:',
          content: '선택 하 고 내기 (즉 브라질-스페인), 결과 (즉, 브라질 승) 사이트 (예: 지원 또는 결과 대 한 내기) 시장\n' +
          '내기 (즉 1 ETH)와 확률을 원하는 스테이크를 입력 (예: 1 / 2.25)\n' +
          'BEX 일치 엔진 다음 베팅 확률 설정에 대 한 다른 순서를 찾을 것입니다.',
        },
        {
          title: '보고서에 대 한 대기:',
          content: '귀하의 계정에 귀하의 위 닝 에스크로 스마트 계약에서 자동으로 전송 됩니다 만약 당신이 이기 면.',
        },
      ],
    },
    {
      question: '내 자신의 선호 확률 설정 합니까? 어떻게?',
      answer: '예! 당신의 자신의 내기를 만들 때 당신은 당신이에 흥미 있는 이벤트와 결과에 내기를 입력 합니다. 다음, 단순히 귀하의 지분 및 원하는 확률 입력 합니다. 다음 PEX 엔진 자동으로 발견 하 고 누구는 동일한 이벤트에 관심을가지고 누가 수락 확률이와 일치.',
    },
    {
      question: '어떻게 불미스러운/불법 베팅을 경찰 당신은?',
      answer: '우리는 현재 견제와 균형 도조에 부적절 한 행동을 플래그의 시스템 구축.',
    },
    {
      question: '어떻게 시스템은 사람들 사이 내기의 결과 알고 있습니까? 누가 중재자 역할을 하며 다른 계약의 결론에 대 한 결과 확인 합니까?',
      answer: '닌자 곧 결과 확인 하 고 진실을 말하고 (DAO 기자!)를 incentivizing에 대 한 완전히 분산된 솔루션이 있을 것 이다. 로 우리가 FIFA 월드컵 시간에 맞춰 실행 됩니다, 반면에, 우리 팀 공개 소스 (livescore.com)를 사용 하 여 고 기자 역할.',
    },
    {
      question: '어디 동전에 개최?',
      answer: '아무도 자금을 보유 하고있다. 해상도이 때까지 모든 자금 에스크로에 안전 하 게 보관 됩니다.',
    },
    {
      question: '왜 내가 전통적인 방법을 사용 하 여 대신 blockchain 내기를 한다?',
      answer: '분산된 예측 exchange는 직접 사람과, 자신의 확율 및 내기를 만들 자유 100% 닌자 익명을 제공 하 고 지급을 보장을 제공할 것입니다. ',
    },
    {
      question: '방법에 대 한 개인 정보 보호 및 익명?',
      answer: '닌자는 다운로드, 그리고 아무 사인 ups 필요합니다. 아니 암호, 아니 전화 번호 및 아무 이메일 의미합니다. 100%의 익명',
    },
    {
      question: '모든 비용을 지불 해야 합니까?',
      answer: '수수료의 두 가지 주요 유형이 있다: (대 한 내기를 만드는 닌자) 작성자 비용과 네트워크 수수료 (플랫폼을 유지 하는 쪽으로는 창조 자 수수료의 비율).',
    },
    {
      question: '무엇을 할 때 결과 확정 해야 합니까?',
      answer: '아무것도입니다. 당신이 이길 경우 귀하의 계정에 귀하의 위 닝을 자동으로 전송 됩니다. 당신이 진다면, 그것은 다른 사람의 계정 것입니다.',
    },
    {
      question: '어디에 내기 하는 일치를 찾을 수 있습니까?',
      answer: '홈페이지에서 진행 중인 베팅 및 시장 수 있습니다. 어떤 당신이 좋아하는 찾을 수 없는 경우 직접 만들!',
    },
    {
      question: '스포츠, 이외 다른 것에 내기 수 있습니다? 그것은 어떻게 작동 합니까?',
      answer: '아주 빨리, 닌자는 태양 아래 모든 것에 적용 됩니다. 유일한 제한은 당신의 창의력을 될 것입니다. 쉽게 모든 미래의 이벤트에 어떤 시장 든 지를 만들고, 그것에 게 스포츠를 수, 정치, 과학, 시장, 기후... 당신은 그것을 이름. ',
    },
    {
      question: '일어나 악수 모바일 애플 리 케이 션에 게 무슨 일이?',
      answer: '우리 것 이다 수 통합 악수 (와 같은 약속, 계약 업로드, 등 평소 좋아하는 기능) 닌자 모바일 웹사이트에. ',
    },
  ],

  // MobileOrTablet components
  MOT_TITLE: '아무것도의 익명 교환"입니다',
  MOT_CONTENT_0: '닌자 네트워크는 액세스할 수 모바일을 통해',
  MOT_CONTENT_1: '익명 항목을 얻을 귀하의 모바일 브라우저에서',
  MOT_CONTENT_2: '를 엽니다.',
  MOT_CONTENT_3: '필요 없습니다 다운로드 합니다. 흔적이 필요합니다.',
  MOT_LIST_CONTENT: [
    {
      mainContent: '기술',
      placeHolderLink: '백서',
      link: 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8',
      isBlankTarget: true,
      mainContent1: '보기',
    },
    {
      mainContent: '우리는 당신의',
      placeHolderLink: '질문',
      mainContent1: '에 대답',
      link: '/faq',
    },
    {
      mainContent: '',
      placeHolderLink: '전보',
      mainContent1: '에 미꾸라지를 가입',
      link: 'https://t.me/ninja_org',
      isBlankTarget: true,
    },
  ],

  /*
  *
  * White Paper
  *
  * ******************************************************************************************* */
  WHITE_PAPER_H1: 'Anonymous Peer-to-Peer Prediction Exchange on Ethereum',
  WHITE_PAPER_SUBTITLE_1: 'Hello! We are Roc, Bakunawa, Hakawai and Grootslang from the Ninja team. We are building an electronic prediction exchange on the blockchain. Here’s why we did it, and how it works!',
  WHITE_PAPER_SUBTITLE_2: 'Join the conversation at',
  WHITE_PAPER_INTRO: 'Introduction',
  WHITE_PAPER_INTRO_1: 'Online betting is run almost exclusively by bookmakers that serve as trusted third parties. As is typically the case, the users suffer from this “centralized trusted thirty party problem”:',
  WHITE_PAPER_INTRO_2: [
    'Bookmakers set the odds that always favor them (they always win)',
    'Bookmakers enjoy a hefty 5% — 30% margin on every bet',
    'Bets are reversible, and winnings are uncertain',
    'Completely anonymity is not possible',
    'Fraud is unavoidable, and accepted for being so',
    'Single point of failure — what if the bookmaker disappears?',
    'Betting is considered gambling — disproportionately risky, largely due to the centralized party’s lack of transparency',
  ],
  WHITE_PAPER_INTRO_3: 'These problems multiply by 10 when it comes to betting offline, so it is little wonder that users are increasingly taking the lesser of two evils.',
  WHITE_PAPER_INTRO_4_HIGH_LIGHT: 'The solution: an electronic prediction system that replaces reluctant trust with cryptographic proof, allowing any two anonymous parties from anywhere in the world to bet directly against each other without the need for a trusted third party.',
  WHITE_PAPER_INTRO_5: 'The Anonymous Peer-to-Peer Electronic Prediction Exchange (PEX) allows parties to directly bet against each other without going through a central authority or bookmaker. The management of bets and the settlement of winnings are carried out collectively by the blockchain network, protecting users from any single point of failure. PEX has unique properties that allow exciting use cases, previously impossible under any traditional betting mechanism.',
  WHITE_PAPER_INTRO_6: 'It is our hope that PEX will change today’s perception of betting — often needlessly portrayed as a shady gambling game, due mostly to reliance on centralized parties looking for unethical, cutthroat ways of making a profit.',
  WHITE_PAPER_INTRO_7_HIGH_LIGHT: 'PEX directly challenges the shadowy gambling industry with an open, transparent prediction market exchange.',
  WHITE_PAPER_INTRO_8: 'This exchange will be where people get together and predict like they have always done, on future events in sports, politics, science, markets, climate, and everything under the sun — as individuals who are invested in the world we are building naturally do.',
  WHITE_PAPER_PEX: 'What is PEX?',
  WHITE_PAPER_PEX_1: 'Running on top of the Ethereum blockchain, PEX is an anonymous peer-to-peer decentralized prediction exchange that provides a simple way for anyone to:',
  WHITE_PAPER_PEX_2: [
    'Place a Support Order (Ask) or an Against Order (Bid) on an outcome',
    'Be a Market Maker (Lay the odds) or a Market Taker (Back the odds)',
    'Be a Creator of their own Prediction Market',
    'Collect winnings instantly (guaranteed under a Smart Contract)',
  ],
  WHITE_PAPER_PEX_3: 'Place a bet.',
  WHITE_PAPER_OUTCOME: 'Outcomes as tradable assets. Odds as prices.',
  WHITE_PAPER_OUTCOME_1: 'In a stock exchange, the tradeable asset is share, and traders bet on share unit prices (e.g. sell 100 shares of Apple at $200 each).',
  WHITE_PAPER_OUTCOME_2: 'In a coin exchange, the tradeable asset is coin, and traders bet on coin unit prices (e.g. buy 2 Bitcoin at $7000 each).',
  WHITE_PAPER_OUTCOME_3: 'Similarly, in a decentralized prediction exchange like PEX, the tradeable asset is outcome of an event, and traders bet on the odds of that outcome. They can bet for the outcome (support it), or bet against it. For example: an outcome of the match Brazil vs. Spain could be that “Brazil wins”. John can bet on that outcome with odds of 2.0. Mary can bet on that outcome with odds of 2.25. Peter can bet against that outcome (“Brazil loses” or “Brazil draws”) with odds of 1.9.',
  WHITE_PAPER_OUTCOME_4: 'A different type of exchange.',
  WHITE_PAPER_COMPARE: 'PEX vs. Traditional betting',
  WHITE_PAPER_COMPARE_1: 'Importantly, PEX does not accept bets and hold stakes, but instead matches the users who support the outcome with the users who are against the outcome. The stakes are held in an Escrow smart contract.',
  WHITE_PAPER_COMPARE_2: 'The Escrow smart contract is unstoppable. It runs exactly as programmed — to forward its escrow balance to the winner at the end — without any possibility of downtime, fraud or third-party interference. Once both parties commit to a bet, it is irreversible. Payment is guaranteed and instant.',
  WHITE_PAPER_COMPARE_3: 'The entire process happens without any party revealing their identities. It’s 100% anonymous.',
  WHITE_PAPER_COMPARE_4: 'All this happens without a central authority or bookmaker. It’s carried out collectively by all the nodes of the blockchain.',
  WHITE_PAPER_COMPARE_5: 'This is why you should bet on the blockchain.',
  WHITE_PAPER_PEX_WORK: 'How does PEX work?',
  WHITE_PAPER_PEX_WORK_SUB_TITLE: 'PEX is different from what you know. It also provides more autonomy than what you know. Just as importantly, it is designed to be easy to create bet markets and place bet orders.',
  WHITE_PAPER_STEP_1: 'Step 1: Get Ether',
  WHITE_PAPER_STEP_1_1: 'If you don’t have ETH yet, you have a choice of buying ETH directly in PEX with your credit card. You can also buy ETH from popular coin exchanges like Coinbase or Binance.',
  WHITE_PAPER_STEP_1_2: 'PEX will support other cryptocurrencies soon.',
  WHITE_PAPER_STEP_1_3: 'Easily buy ETH in-app.',
  WHITE_PAPER_STEP_2: 'Step 2: Top up your PEX Wallet',
  WHITE_PAPER_STEP_2_1: 'Transfer the ETH you just bought into the PEX Wallet, so that you can start placing bets with your ETH. The PEX Wallet is completely decentralized. The private key is held on your phone and only you can access it. Only you can transfer and receive ETH.',
  WHITE_PAPER_STEP_2_2: 'The neatly organized PEX wallet.',
  WHITE_PAPER_STEP_3: 'Step 3: Place a bet',
  WHITE_PAPER_STEP_3_1: 'First, pick a prediction market that interests you (i.e. Brazil — Spain), the outcome (i.e. “Brazil wins”) and the side (i.e. support or bet against the outcome).',
  WHITE_PAPER_STEP_3_2: 'Then enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 1/2.25). The stake will be put into an escrow smart contract. The PEX Matching Engine will then find another order that bets against the odds you set.',
  WHITE_PAPER_STEP_3_3: 'That’s it.',
  WHITE_PAPER_STEP_3_4: 'Our ETH is on Argentina for this one.',
  WHITE_PAPER_STEP_4: 'Step 4: Wait for the report',
  WHITE_PAPER_STEP_4_1: 'Once the event ends, the reporter of the market will report the result within the reporting window (set by the market creator). Generally, you should expect to have the report within minutes. If you win, your winnings will be automatically transferred from the escrow smart contract to your account.',
  WHITE_PAPER_STEP_4_2: 'May the odds be ever in your favour.',
  WHITE_PAPER_CREATE: 'Create your own prediction markets',
  WHITE_PAPER_CREATE_1: 'While most users will place orders in existing markets, PEX allows anyone to create a prediction market about any future event — be it in sports, politics, science, or literally any other aspect of modern life. You, as the market creator, can set the market fee, the market closing time, the reporter of the outcome, and the reporting deadline.',
  WHITE_PAPER_ARCHITECTURE: 'PEX Architecture',
  WHITE_PAPER_ARCHITECTURE_1: 'The core components of the PEX architecture are:',
  WHITE_PAPER_ARCHITECTURE_2_HL: 'Prediction Market',
  WHITE_PAPER_ARCHITECTURE_2: 'PEX allows anyone to create a prediction market about any future event. This can be in any field — sports, politics, science, lifestyle, even weather and so on. The only limit here is your creativity. Each market is part of an on-chain smart contract. It has its own order book, makers and takers.',
  WHITE_PAPER_ARCHITECTURE_3_HL: 'Order Book',
  WHITE_PAPER_ARCHITECTURE_3: 'Each Prediction Market has its own order book. PEX Order Book manages all Support Outcome Orders (ask) and all Against Outcome Order (bid). It aggregates all orders with the same price (odds) into an entry on the order book.',
  WHITE_PAPER_ARCHITECTURE_3_1: 'The order book.',
  WHITE_PAPER_ARCHITECTURE_4_HL: 'Matching Engine',
  WHITE_PAPER_ARCHITECTURE_4_1: 'PEX uses a first-in, first-out (FIFO) order book. Orders are executed in price-time priority. This means that it will match by price first, and if there are two orders with the same price, then it will match by time.',
  WHITE_PAPER_ARCHITECTURE_4_2: 'In some cases, the amount placed on either side is uneven, and the order will be partially filled. The remaining order will be matched with the next best price-then-time in the order book until the order is completely filled.',
  WHITE_PAPER_ARCHITECTURE_4_3: 'Your perfect match.',
  WHITE_PAPER_ARCHITECTURE_4_4: [
    'A user places a Support Outcome Order into the Open Order Book',
    'Another user place an Against Outcome Order into the Open Order Book',
    'Matching Engine finds a match and moves both Orders from the Open Order Book to Matched Order Book',
  ],
  WHITE_PAPER_ARCHITECTURE_5_HL: 'REST API',
  WHITE_PAPER_ARCHITECTURE_5: 'PEX REST API has endpoints for order management, account management, and public market data.',
  WHITE_PAPER_ARCHITECTURE_6_HL: 'Web Socket',
  WHITE_PAPER_ARCHITECTURE_6: 'PEX Web Socket feed provides real-time market data updates for orders and trades.',
  WHITE_PAPER_PRIVACY: 'Privacy & Anonymity',
  WHITE_PAPER_PRIVACY_SUB: 'The privacy afforded to the user is a deliberate design.',
  WHITE_PAPER_PRIVACY_1_HL: 'No downloads',
  WHITE_PAPER_PRIVACY_1: 'PEX is not a mobile app. It’s freely accessible on the mobile web. While native mobile apps sometimes have better UI/UX, they must be hosted by centralized app stores like Android Play Store or Apple App store. In our view, a more attractive UI is not an acceptable tradeoff for compromised privacy.',
  WHITE_PAPER_PRIVACY_2_HL: 'No sign ups',
  WHITE_PAPER_PRIVACY_2_1: 'The need for a password, email or phone number is obsolete.',
  WHITE_PAPER_PRIVACY_2_2: 'PEX doesn’t collect your personal information. You can use PEX with complete privacy. When you first open PEX, a public/private keypair will be created silently in the background and stored locally on your phone. The public key acts as your anonymous username, and the private key is your password. PEX doesn’t have access to your private key — only you do.',
  WHITE_PAPER_PRIVACY_2_3: 'Note that in the Profile Settings, we provide an option for the user to enter their email address. The purpose is not to collect your email, but for a better experience, especially in use cases related to payments. It’s completely optional.',
  WHITE_PAPER_PRIVACY_2_4: 'Note also that there is an option to backup your private key in Settings. We highly recommend doing so.',
  WHITE_PAPER_PRIVACY_3_HL: 'Anonymous prediction',
  WHITE_PAPER_PRIVACY_3: 'PEX is built on top of Ethereum, which is a public blockchain, but privacy is maintained by keeping your public key anonymous. While the public can see that someone is predicting on something, it’s almost impossible to find out who that someone is.',
  WHITE_PAPER_PRIVACY_4_HL: 'Anonymous order matching',
  WHITE_PAPER_PRIVACY_4: 'Similar to stock and coin exchanges, the order book, sizes, odds, and time are public, but the order book doesn’t disclose who the order makers and takers are. The order book records the bet anonymous parties place against each other, based on their opposing predictions of an event. Once the event concludes and the report is available, the escrowed funds are transferred automatically to the winner.',
  WHITE_PAPER_FEE: 'Fees',
  WHITE_PAPER_FEE_1: 'There are two main types of fees: winning fee and network fee.',
  WHITE_PAPER_FEE_2: 'The winning fee is set by the market creator, as a percentage of the total winnings of that market. It’s entirely up to the market creator to set their own fees. Since PEX allows anyone to create a prediction market, we expect that the fees will be very competitive among markets. This is the best case scenario for users.',
  WHITE_PAPER_FEE_3: 'The network fee is 20% of the creator’s winning fee. This pays for engineering, infrastructure, and maintenance of the network. At the beginning, this will be undertaken by the Core Ninja Team. But we expect that over time we will decentralize the team and design a mechanism that opens it up to the entire community.',
  WHITE_PAPER_FEE_4: 'Optionally, we are considering a referral fee for the market creator. The referral pool could be 10% — 20% of the winning fee, which will help in adding a lot more users to the market.',
  WHITE_PAPER_SETTLEMENT: 'Settlement',
  WHITE_PAPER_SETTLEMENT_1: 'The deeper we dive into building PEX, the more it seems that we have to initially strike a compromise between speed and decentralization, while always retaining security. In relation to settlement, which requires the report of the outcome to be available immediately after each event (i.e. a sports event), we will opt for speed, for now.',
  WHITE_PAPER_SETTLEMENT_2: 'In the first release, the Core Ninja Team will assume the reporting role and report the outcome of all events. We’re researching and designing a decentralized mechanism that will allow the community to report the outcomes.',
  WHITE_PAPER_SUMMARY: 'Summary',
  WHITE_PAPER_SUMMARY_1: 'PEX is a purely peer-to-peer version of electronic prediction that allows parties to bet directly against each other without going through a central authority or bookmaker',
  WHITE_PAPER_SUMMARY_2: 'PEX is open-source; its design is public, nobody owns or controls PEX and everyone can take part.',
  WHITE_PAPER_SUMMARY_3: 'PEX is open source at',
  WHITE_PAPER_SUMMARY_4: 'Build PEX with us. Join the conversation at',
  WHITE_PAPER_END: 'And it actually works',
  WHITE_PAPER_END_1: 'Hey, thanks for reading. Ninja will go live on the testnet on 5 June! We’re excited to hear your thoughts.',
};
