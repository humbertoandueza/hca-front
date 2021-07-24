export function addProduct (state,product) {
    state.products.push({...product,_id:state.products.length+1})
}

export function setProducts (state,products) {
    state.products = products
}

export function updateProduct (state,product) {
    let index = state.products.findIndex(item=>item.code == product.code)
    state.products.splice(index,1,product)
}

export function removeProduct (state,code) {
    let index = state.products.findIndex(item=>item.code == code)
    state.products.splice(index,1)
}

export function addShelve (state,shelve) {
    let _id = state.shelves.length+1
    state.shelves.push({label:shelve,value:_id,_id})
}

export function setShelves (state,shelves) {
    state.shelves = shelves
}

export function removeShelve (state,_id) {
    let index = state.shelves.findIndex(item=>item._id == _id)
    state.shelves.splice(index,1)
}

export function addSaleProduct (state,products) {
    products.forEach(product => {
        let pro = state.products.find(item=>item.code == product.code)
        pro.quantity_stock -= product.quantity
        pro.quantity_output += product.quantity
    })
}

export function addBuyProduct (state,products) {
    products.forEach(product => {
        let pro = state.products.find(item=>item.code == product.code)
        pro.quantity_stock += product.quantity
        pro.quantity_entry += product.quantity
        pro.price_cost = product.price_sale
        let cal = product.price_sale * (40/100)
        pro.price_sale = product.price_sale + cal
    })
}

