import moment from 'moment'
export function addBuy (state,buy) {
    buy.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
    state.buys.push({...buy,_id:state.buys.length+1})
}

export function setBuys (state,buys) {
    state.buys = buys
}

export function updateBuy (state,buy) {
    let index = state.buys.findIndex(item=>item._id == buy._id)
    state.buys.splice(index,1,buy)
}

export function removeBuy (state,_id) {
    let index = state.buys.findIndex(item=>item._id == _id)
    state.buys.splice(index,1)
}
