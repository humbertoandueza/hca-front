import moment from 'moment'
export function addSale (state,sale) {
    sale.created_at = moment()
    state.sales.push({...sale,id:state.sales.length+1})
}

export function setSales (state,sales) {
    state.sales = sales 
}

export function updateSale (state,sale) {
    let index = state.sales.findIndex(item=>item.id == sale.id)
    state.sales.splice(index,1,sale)
}

export function removeSale (state,id) {
    let index = state.sales.findIndex(item=>item.id == id)
    state.sales.splice(index,1)
}

export function addPay (state,pay) {
    pay.created_at = moment()
    state.pay.push({...pay,id:state.pays.length+1})
}

export function setPays (state,pays) {
    state.pays = pays
}