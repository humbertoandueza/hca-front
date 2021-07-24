export function addClient ({commit},data) {
    commit('addClient',data)
}

export function setClients ({commit},data) {
    commit('setClients',data)
}

export function updateClient ({commit},data) {
    commit('updateClient',data)
}

export function removeClient ({commit},_id) {
    commit('removeClient',_id)
}
