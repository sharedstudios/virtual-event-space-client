import { combineReducers } from "redux"

import messages from './message-reducer'
import agendas from './agendas-reducer'
import students from './students-reducer'
import current_student from './current-student-reducer'
import user from './user-reducer'
import socket from './socket-reducer'

export default combineReducers({
    user,
    socket,
    students,
    agendas,
    messages,
    current_student
})
