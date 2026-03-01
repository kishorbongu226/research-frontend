import { position, user, varia } from "./Types"

const initialState = {
    position : 20,
    angle: 'S',
    userDetails: {}
}

const Reducer = (state=initialState,action)=>{
    switch (action.type){
        // case position: return {
        //     ...state, position: state.initialState -1
        // }
        case position: return {
            ...state, position: state.position -1
        }
        case varia: return {
            ...state, angle: state.angle + action.value.name + action.value.dept
        }

        case user: return{
            ...state, userDetails: action.value
        }
        default : return state 
    }
}

export default Reducer;