export function addTeam (state,team) {
    state.teams.push({...team,id:state.teams.length+1})
}

export function setTeams (state,teams) {
    state.teams = teams
}

export function updateTeam (state,team) {
    let index = state.teams.findIndex(item=>item.id == team.id)
    state.teams.splice(index,1,team)
}

export function removeTeam (state,id) {
    let index = state.teams.findIndex(item=>item.id == id)
    state.teams.splice(index,1)
}
