export function addProvider ({commit},data) {
    commit('addProvider',data)
}

export function setProviders ({commit},data) {
    commit('setProviders',data)
}

export function updateProvider ({commit},data) {
    commit('updateProvider',data)
}

export function removeProvider ({commit},_id) {
    commit('removeProvider',_id)
}
