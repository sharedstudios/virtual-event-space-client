import { axios } from '../custom-module'

export const newMessage = (message) => {
    return (dispatch) => dispatch({ type: 'NEW-MESSAGE', payload: message })
}
export const fetchMessages = () => {
    return (dispatch) => dispatch({ type: 'FETCH-MESSAGES', payload: axios.get('message') })
}

export const postMessage = (message) => {
    return (dispatch) => dispatch({ type: 'POST-MESSAGES', payload: axios.post('message', message, { headers: { "Content-Type": "text/plain" } }) })
}