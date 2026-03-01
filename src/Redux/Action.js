import { position, user, varia } from "./Types"

export const User_position=()=>{
    return{
        type : position,
    }
}

export const User_varia=(payload)=>{
    return{
        type : varia,
        value: payload
    }
}

export const User = (payload)=>{
    return{
        type :user,
        value: payload
    }
}

// export default User_position;