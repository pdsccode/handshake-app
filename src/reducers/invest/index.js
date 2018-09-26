import {ACTIONS} from '@/reducers/invest/action';
export default function(state = {}, action){
    switch(action.type){
        case ACTIONS.FETCH_PROJECTS:
            return {...state, projects: action.payload }
        default:
            return state
        
    }

}