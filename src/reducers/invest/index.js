import {ACTIONS} from '@/reducers/invest/action';
export default function(state = {}, action){
    switch(action.type){
        case ACTIONS.FETCH_PROJECTS:
            return {...state, projects: action.payload }
        case ACTIONS.FETCH_PROJECT_DETAIL:
            return {...state, project: action.payload }
        case ACTIONS.FETCH_TRADERS: 
            return {...state, traders: action.payload }
        case ACTIONS.SYNC_WALLET: {
            return {...state, syncWallet: action.payload }
        }
        case ACTIONS.SYNCED_INFO: {
            return { ...state, syncedInfo: action.payload }
        }
        default:
            return state
    }

}