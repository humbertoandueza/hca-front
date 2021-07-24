export function addProvider (state,provider) {
    state.providers.push({...provider,_id:state.providers.length+1})
}

export function setProviders (state,providers) {
    state.providers = providers
}

export function updateProvider (state,provider) {
    let index = state.providers.findIndex(item=>item._id == provider._id)
    state.providers.splice(index,1,provider)
}

export function removeProvider (state,_id) {
    let index = state.providers.findIndex(item=>item._id == _id)
    state.providers.splice(index,1)
}
