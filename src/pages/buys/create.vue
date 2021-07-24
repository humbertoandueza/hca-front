<template>
    <q-page class="q-pa-sm">
      <div class="row q-pa-md">
        <div class="col-12">
            <p class="text-h5">Compras</p>
        </div>
        <div class="col-5 q-pa-xs">
          <q-table
            :data="products_clone"
            :columns="columns"
            :filter="filter"
            row-key="code"
            :loading="loading"
            :pagination.sync="pagination"
            @request="onRequest"
            no-data-label="No hay resultados"
            no-results-label="No hay resultados"
            rows-per-page-label="registros por página"
            :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
            style="height: 80vh;"
          >
            <template v-slot:top-right>
              <q-input  borderless dense outlined debounce="300" v-model="filter" placeholder="Buscar">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </template>
            <template v-slot:body-cell="props">
              <q-td v-if="props.col.name == 'name'" :props="props" class="cursor-pointer" @click="select_product(props)">
                <span class="truncate">{{props.value}} </span>
                <q-tooltip >{{props.value}}</q-tooltip>
              </q-td>
              <q-td v-else :props="props" class="cursor-pointer" @click="select_product(props)">
                {{props.value}} 
              </q-td>
            </template>
          </q-table>
        </div>
        <div class="col-7 q-pa-xs">
          <q-table
            title="Productos"
            :data="products_selected"
            :columns="columns_cloned"
            :filter="filter_cloned"
            row-key="name"
            :pagination="initialPagination"
            no-data-label="No hay productos seleccionados"
            no-results-label="No hay resultados"
            rows-per-page-label="registros por página"
            :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
            style="height: 60vh;"
          >
            <template v-slot:top-left>

              <q-form
              ref="client_form"
              @submit="sale"
              class="q-gutter-md form-class"
              >
                <q-select
                  borderless
                  dense outlined
                  v-model="client_selected"
                  use-input
                  label="Proveedor" stack-label
                  hide-selected
                  fill-input
                  input-debounce="0"
                  :options="options_clients"
                  @filter="filterFn"
                  lazy-rules
                  :rules="[ val => val.value && val.label.length > 0 || 'Por favor seleccione una opción']"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-btn round size="sm" class="q-ma-sm" @click="$router.push(`/provider/create`)" color="primary" icon="add" />
              </q-form>
            </template>
            <template v-slot:top-right>
              <q-input  borderless dense outlined debounce="300" v-model="filter_cloned" placeholder="Buscar">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </template>
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <span class="truncate">{{props.value}} </span>
                <q-tooltip >{{props.value}}</q-tooltip>
              </q-td>
            </template>
            <template v-slot:body-cell-id="props">
              <q-td :props="props">
                <div class="flex justify-around ">
                  <q-btn round size="sm" @click="remove(props.row.code)" color="red" icon="delete" />
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-quantity="props">
              <q-td :props="props">
                <div class="flex justify-around ">
                  <q-input
                  dense outlined
                  class="q-mr-sm"
                  @change="selected($event,props.row)"
                  @keyup="selected($event,props.row)"
                  v-model.number="props.row.quantity" />
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-price_sale="props">
              <q-td :props="props">
                <div class="flex justify-around ">
                  <q-field
                    dense outlined
                    v-model="props.row.price_sale"
                    lazy-rules
                    >
                    <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                        <money :id="id" class="q-field__input text-right" :value="value" @input="emitValue" v-bind="moneyFormatForComponent" v-show="floatingLabel" />
                    </template>
                  </q-field>
                </div>
              </q-td>
            </template>
          </q-table>
          <q-card>
            <q-card-section>
              <div class="row">
                <div class="col-3">
                  <q-input label="Nº de factura" stack-label borderless mask="##########" dense outlined debounce="300" v-model.number="n_factura" />
                    
                </div>
                <div class="col-9 flex justify-end">
                  <p class="text-h5">
                    Total: {{$formatMoney(totalPrice)}}
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-12 flex justify-around">
                  <q-btn @click="cancel" color="red" outline label="Cancelar" />
                  <q-btn @click="show_new_products = true" color="primary" label="Nuevos Productos" />
                  <q-btn @click="$refs.client_form.submit()" color="primary" :disable="products_selected.length>0?false:true" label="Confirmar" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-dialog v-model="show_new_products" persistent>
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-12  text-center">
                <p class="text-h5">
                  Nuevos Productos
                </p>
              </div>
            </div>
            <div class="row q-pa-sm items-center flex" v-for="(new_product,index) of new_products" :key="index">
              <div class="col-3">
                <q-input
                  label="Código" stack-label
                  dense outlined
                  mask="X-####"
                  class="q-mr-sm"
                  v-model.number="new_product.code" />
                  
              </div>
              <div class="col-3">
                  <q-input
                  label="Nombre" stack-label
                  dense outlined
                  class="q-mr-sm"
                  v-model.number="new_product.name" />
              </div>
              <div class="col-2">
                <q-field
                  label="Precio" stack-label
                  dense outlined
                  class="q-mr-sm"
                  v-model="new_product.price_sale"
                  lazy-rules
                  >
                  <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                      <money :id="id" class="q-field__input text-right" :value="value" @input="emitValue" v-bind="moneyFormatForComponent" v-show="floatingLabel" />
                  </template>
                </q-field>
              </div>
              <div class="col-3">
                <q-input
                  label="Cantidad" stack-label
                  dense outlined
                  mask="####"
                  class="q-mr-sm"
                  v-model.number="new_product.quantity" />
              </div>
              <div class="col-1">
                <q-btn color="red" v-if="index>0" @click="new_products.splice(index,1)" size="sm" round icon="delete"/>
                <q-btn color="primary" v-if="index==0" @click="addNewProduct" size="sm" round icon="add"/>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="red" v-close-popup />
            <q-btn flat label="Confirmar" color="primary" @click="saveProducts"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  name:'sales',
  data () {
    return {
      show_new_products:false,
      new_products:[
        {
          code:'',
          name:'',
          price_sale:'',
          quantity:''
        }
      ],
      n_factura:'00000',
      filter:'',
      filter_cloned:'',
      client_selected:'',
      clients_clone:[],
      products_clone:[],
      options_clients:[],
      products_selected:[],
      loading:false,
      moneyFormatForComponent: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        precision: 2,
        masked: false
      },
      initialPagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 0
      },
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 10
      },
      columns:[
          {
            name:'name',
            label:'Producto',
            field:row=>`${row.code} ${row.name}`,
            align:'left'
          },
          {
            name:'price_sale',
            label:'Precio',
            field:row=>`${this.$formatMoney(row.price_sale)}`,
            align:'left'
          }
      ],
      columns_cloned:[
          {
            name:'name',
            label:'Producto',
            field:row=>`${row.code} ${row.name}`,
            align:'left'
          },
          {
            name:'price_sale',
            label:'Precio',
            field:row=>`${this.$formatMoney(row.price_sale)}`,
            align:'left'
          },
          {
            name:'quantity',
            label:'Cantidad',
            field:'quantity',
            align:'center'
          },
          {
            name:'total_sale',
            label:'Total',
            field:row=>`${this.$formatMoney(row.quantity*row.price_sale)}`,
            align:'left'
          },
          
          {
            name:'id',
            label:'Acciones',
            field:'_id',
            align:'right'
          }
      ]
    }
  },
  computed:{
    ...mapState('products',['products']),
    ...mapState('providers',['providers']),
    totalQuantity(){
      return this.products_selected.reduce((count,item) => {return count + item.quantity},0)
    },
    totalPrice(){
      return this.products_selected.reduce((count,item) => {return count + (item.quantity*item.price_sale)},0)
    }
  },
  created(){
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
    this.getClients()
    /* this.products_clone = JSON.parse(JSON.stringify(this.products)) */
    
    /* this.options_clients = this.providers.map(item=>{
      return {
        value:item._id,
        _id:item._id,
        label:`(${item.ci}) ${item.name} ${item.last_name}`
      }
    })
    this.clients_clone = this.options_clients  */
  },
  methods:{
    ...mapActions('buys',['addBuy']),
    ...mapActions('products',['addBuyProduct','setProducts']),
    ...mapActions('providers',['setProviders']),
    onRequest(props){
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.getProducts(page,rowsPerPage,filter)
    },
    saveProducts(){
      this.products_selected = [...this.products_selected,...this.new_products]
      this.show_new_products = false
    },
    addNewProduct(){
      this.new_products.push({
        code:'',
        name:'',
        price_sale:'',
        quantity:''
      })
    },
    getClients() {
      this.$axios.get('/persons?role=provider')
      .then(res=>{
        this.setProviders(res.data)
        this.options_clients = res.data.map(item=>{
          return {
            value:item.id,
            _id:item.id,
            label:`(${item.ci}) ${item.name} ${item.last_name}`
          }
        })
        this.clients_clone = this.options_clients 
      })
    },
    getProducts(page,per_page,filter){
      let query = filter ? filter : '';
      this.loading = true
      this.$axios.get('/products?page='+page+'&per_page='+per_page+'&filter='+query)
      .then(res=>{
        this.pagination.rowsNumber = res.data.total
        this.loading = false
        this.products_clone = JSON.parse(JSON.stringify(res.data.data))
        this.setProducts(res.data.data)
      })
    },
    select_product(product){
      //add product to products_selected
      product.row.quantity = 1
      this.products_selected.push(product.row)
      //remove product for product_clone
      let index_clone = this.products_clone.findIndex(item=>item.code == product.row.code)
      this.products_clone.splice(index_clone,1)
    },
    selected(e,product){
      // validate when the quantity not > what quantity stock
      let quantity = parseInt(e.target.value)
      product.quantity = quantity 
      
      if(isNaN(quantity)) {
        product.quantity = 1
      }

      //asing value input quantity
      let index = this.products_selected.findIndex(item=>item.code == product.code)
      this.products_selected.splice(index,1,product)
    },
    remove(code){
      //add product to products_clone
      let product = this.products_selected.find(item=>item.code == code)
      this.products_clone.push(product)
      //remove product of products_selected
      let index = this.products_selected.findIndex(item=>item.code == code)
      this.products_selected.splice(index,1)
    },
    cancel(){
      this.products_selected = []
      this.client_selected = ''
      this.$refs.client_form.reset()
    },
    sale(){
      let provider = this.providers.find(item=>item.id == this.client_selected.value)
      let data = {
        factura_n:this.n_factura,
        total:this.totalPrice,
        provider,
        products:this.products_selected
      }
      this.$axios.post('/buys',data)
      .then(res=>{
        console.log(res.data)
        /* this.addBuy(data)
        this.addBuyProduct(data.products) */
        this.$q.notify({
          message: 'Compra realizada con éxito.',
          caption: 'Felicitaciones',
          color: 'green'
        })
        this.cancel()
        this.getProducts()
       
      })
      
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options_clients = this.clients_clone.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
<style scoped>
.form-class{
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>