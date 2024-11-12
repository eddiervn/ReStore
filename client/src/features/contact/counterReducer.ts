export const INCREAMENT_COUNTER = 'INCREAMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

export interface CounterState{
    data: number,
    title: string
}

const initialState: CounterState = {
    data: 42,
    title: 'Kurwa mać'
}

export function increment(amount = 1){
    return {
        type: INCREAMENT_COUNTER,
        payload: amount
    }
}

export function decrement(amount = 1){
    return {
        type: DECREMENT_COUNTER,
        payload: amount
    }
}

interface CounterAction{
    type: string,
    payload: number
}


export default function counterReducer(state = initialState, action: CounterAction){
    switch(action.type){
        case INCREAMENT_COUNTER:
            return {
                ...state,
                data: state.data + action.payload
            }
        case DECREMENT_COUNTER:
            return {
                ...state,
                data: state.data - action.payload
            }
        default:
            return state
    }
}
