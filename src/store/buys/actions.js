export function addBuy ({commit},data) {
    commit('addBuy',data)
}

export function setBuys ({commit},data) {
    commit('setBuys',data)
}

export function updateBuy ({commit},data) {
    commit('updateBuy',data)
}

export function removeBuy ({commit},_id) {
    commit('removeBuy',_id)
}
