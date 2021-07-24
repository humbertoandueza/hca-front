export function addProduct ({commit},data) {
    commit('addProduct',data)
}

export function setProducts ({commit},data) {
    commit('setProducts',data)
}

export function updateProduct ({commit},data) {
    commit('updateProduct',data)
}

export function removeProduct ({commit},code) {
    commit('removeProduct',code)
}

export function addShelve ({commit},shelve) {
    commit('addShelve',shelve)
}


export function setShelves ({commit},data) {
    commit('setShelves',data)
}

export function removeShelve ({commit},_id) {
    commit('removeShelve',_id)
}

export function addSaleProduct ({commit},data) {
    commit('addSaleProduct',data)
}

export function addBuyProduct ({commit},data) {
    commit('addBuyProduct',data)
}