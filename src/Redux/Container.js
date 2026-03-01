import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {User_position, User_varia} from './Action'

function Container() {
    const selector = useSelector(state => state)

    const dispatch = useDispatch()

  return (
    <div>
        Container - {selector.position} 
        Angle - {selector.angle}
    <button onClick={() => dispatch(User_position())}> Click </button>
    <button onClick={() => dispatch(User_varia({name: "Nishar", dept: "CSE"}))}>Angle</button>
    <div>test</div>
    </div>
  )
}

export default Container