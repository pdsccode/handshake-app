import { createAPI } from '@/reducers/action'

export const ACTIONS = {
  FETCH_PROJECTS: 'FETCH_PROJECTS'
}

// export const fetch_projects = createAPI(ACTIONS.FETCH_PROJECTS)
export const fetch_projects = function () {
  return {
    type: ACTIONS.FETCH_PROJECTS,
    payload: exampleProjects
  }
}

var exampleProjects = [
  {
    name: 'Project A1',
    owner: ' ',
    target: '100',
    exchange: 'binance',
    max: '100',
    commission: 0,
    fundingAmount: '30',
    updatedAmount: '0',
    releasedAmount: '0',
    pendingAmount: '0',
    refundAmount: '0',
    startTime: '1970-01-18T19:10:08.400Z',
    deadline: '1970-01-18T19:10:08.400Z',
    lifeTime: 604800,
    currency: 'ETH',
    stages: [10, 25, 30, 35],
    createdDate: '2018-09-25T07:15:11.937Z',
    updatedDate: '2018-09-25T07:15:11.937Z',
    depositAddress: null,
    currentStage: null,
    smartContractVersion: 'v1',
    state: 'WITHDRAW',
    id: '5ba9e0e58d2af926767a1e61',
    userId: '5b8e55f3a572c4004ffaa973',
    User: {
      firstName: 'Andy',
      lastName: 'Vo',
      userType: 'trader',
      username: 'amit11',
      email: 'amit007kolambikar@gmail.com',
      emailVerified: false,
      id: '5b8e55f3a572c4004ffaa973'
    }
  },
  {
    name: 'Project A2',
    owner: ' ',
    target: '10',
    exchange: 'binance',
    max: '10',
    commission: 0,
    fundingAmount: '0',
    updatedAmount: '0',
    releasedAmount: '0',
    pendingAmount: '0',
    refundAmount: '0',
    startTime: '1970-01-18T19:10:08.400Z',
    deadline: '1970-01-18T19:10:08.400Z',
    lifeTime: 1537808400,
    currency: 'ETH',
    stages: [10, 25, 30, 35],
    createdDate: '2018-09-25T07:15:11.937Z',
    updatedDate: '2018-09-25T07:15:11.937Z',
    depositAddress: null,
    currentStage: null,
    smartContractVersion: 'v1',
    state: 'WITHDRAW',
    id: '5ba9e0e58deaf926767a1e61',
    userId: '5b8e55f3a572c4004ffaa973',
    User: {
      firstName: 'amit',
      lastName: 'wwww',
      userType: 'trader',
      username: 'amit11',
      email: 'amit007kolambikar@gmail.com',
      emailVerified: false,
      id: '5b8e55f3a572c4004ffaa973'
    }
  },
  {
    name: 'Project A3',
    owner: ' ',
    target: '10',
    exchange: 'binance',
    max: '10',
    commission: 0,
    fundingAmount: '0',
    updatedAmount: '0',
    releasedAmount: '0',
    pendingAmount: '0',
    refundAmount: '0',
    startTime: '1970-01-18T19:10:08.400Z',
    deadline: '1970-01-18T19:10:08.400Z',
    lifeTime: 1537808400,
    currency: 'ETH',
    stages: [10, 25, 30, 35],
    createdDate: '2018-09-25T07:15:11.937Z',
    updatedDate: '2018-09-25T07:15:11.937Z',
    depositAddress: null,
    currentStage: null,
    smartContractVersion: 'v1',
    state: 'WITHDRAW',
    id: '5ba9e0e58deaf92367a1e61',
    userId: '5b8e55f3a572c4004ffaa973',
    User: {
      firstName: 'amit',
      lastName: 'wwww',
      userType: 'trader',
      username: 'amit11',
      email: 'amit007kolambikar@gmail.com',
      emailVerified: false,
      id: '5b8e55f3a572c4004ffaa973'
    }
  }
]
