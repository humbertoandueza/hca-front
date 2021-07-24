export function addClient (state,client) {
    state.clients.push({...client,id:state.clients.length+1})
}

export function setClients (state,clients) {
    state.clients = clients
}

export function updateClient (state,client) {
    let index = state.clients.findIndex(item=>item.id == client.id)
    state.clients.splice(index,1,client)
}

export function removeClient (state,id) {
    let index = state.clients.findIndex(item=>item.id == id)
    state.clients.splice(index,1)
}
