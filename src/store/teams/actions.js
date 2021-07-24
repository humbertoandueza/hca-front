export function addTeam ({commit},data) {
    commit('addTeam',data)
}

export function setTeams ({commit},data) {
    commit('setTeams',data)
}

export function updateTeam ({commit},data) {
    commit('updateTeam',data)
}

export function removeTeam ({commit},_id) {
    commit('removeTeam',_id)
}
