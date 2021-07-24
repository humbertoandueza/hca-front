export function addSale ({commit},data) {
    commit('addSale',data)
}

export function setSales ({commit},data) {
    commit('setSales',data)
}

export function updateSale ({commit},data) {
    commit('updateSale',data)
}

export function removeSale ({commit},_id) {
    commit('removeSale',_id)
}

export function addPay ({commit},data) {
    commit('addPay',data)
}

export function setPays ({commit},data) {
    commit('setPays',data)
}