export default (state = [], { type, payload }) => {
    switch (type) {
        case "FETCH-AGENDAS_FULFILLED": {
            return payload.data
        }
        case "UPDATE-CURRENT-AGENDA": {
            const { agenda_id } = payload
            if (agenda_id) {
                let foundCurrent = false
                const agendas = state.map((agenda) => {
                    if (agenda.id !== agenda_id && !foundCurrent) {
                        return { ...agenda, status: 'previous' }
                    }
                    if (agenda.id === agenda_id && !foundCurrent) {
                        foundCurrent = true
                        return { ...agenda, status: 'current' }
                    }
                    return { ...agenda, status: 'next' }
                })
                return [...agendas]
            } else {
                state[0] = { ...state[0], status: 'current' }
                return [...state]
            }
        }
        default: {
            return state
        }
    }
}