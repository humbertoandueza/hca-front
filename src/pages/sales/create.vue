<template>
    <q-page class="q-pa-sm">
      <div class="row q-pa-md">
        <div class="col-12">
          <p class="text-h5">Ventas</p>
        </div>
        <div class="col-6 q-pa-xs">
          <q-table
            :data="products_clone"
            :columns="columns"
            :filter="filter"
            :loading="loading"
            :pagination.sync="pagination"
            @request="onRequest"
            row-key="code"
            no-data-label="No hay resultados"
            no-results-label="No hay resultados"
            rows-per-page-label="registros por página"
            :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
            style="height: 75vh;"
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
        <div class="col-6 q-pa-xs">
          <q-card>
            <q-card-section>
              <div class="row">
                <div class="col-2">
                  <q-select
                    borderless
                    dense outlined
                    v-model="porcent_selected"
                    use-input
                    label="Porcentaje" stack-label
                    hide-selected
                    fill-input
                    input-debounce="0"
                    :options="options_porcent"
                  />
                </div>
                <div class="col-9">
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
                      label="Cliente" stack-label
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
                    <q-btn round size="sm" class="q-ma-sm" @click="$router.push(`/client/create`)" color="primary" icon="add" />
                  </q-form>
                </div>
              </div>
            </q-card-section>
          </q-card>
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
            style="height: 45vh;"
          >
            <template v-slot:top-right>
              <q-input  borderless dense outlined debounce="300" v-model="filter_cloned" placeholder="Buscar">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
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
            <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <span class="truncate">{{props.value}} </span>
              <q-tooltip >{{props.value}}</q-tooltip>
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
                  Total de productos: {{totalQuantity}}
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
                  <q-btn @click="selectSubmit(2)" color="primary" :disable="products_selected.length>0?false:true" label="Confirmar" />
                  <q-btn @click="selectSubmit(1)" color="primary" :disable="products_selected.length>0?false:true" label="Pendiente" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="shopping_cart" color="primary" text-color="white" />
            <span class="q-ml-sm">¿Esta seguro?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="red" v-close-popup />
            <q-btn flat label="Confirmar" color="primary" @click="$refs.client_form.submit()" />
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
      confirm:false,
      selected_submit:null,
      moneyFormatForComponent: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        precision: 2,
        masked: false
      },
      filter:'',
      filter_cloned:'',
      client_selected:'',
      porcent_selected:20,
      clients_clone:[],
      products_clone:[],
      options_clients:[],
      options_porcent:[20,30,40,50],
      products_selected:[],
      loading:false,
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
            name:'quantity',
            label:'Cantidad Disponible',
            field:'quantity_stock',
            align:'left'
          },
          {
            name: 'price_sale_20',
            required: true,
            label: 'Precio de Venta(20%)',
            align: 'left',
            field:'price_sale_20',
            format: val => this.$formatMoney(val)
          },
          {
            name: 'price_sale_30',
            required: true,
            label: 'Precio de Venta(30%)',
            align: 'left',
            field:'price_sale_30',
            format: val => this.$formatMoney(val)
          },
          {
            name: 'price_sale_40',
            required: true,
            label: 'Precio de Venta(40%)',
            align: 'left',
            field:'price_sale_40',
            format: val => this.$formatMoney(val)
          },
          {
            name: 'price_sale_50',
            required: true,
            label: 'Precio de Venta(50%)',
            align: 'left',
            field:'price_sale_50',
            format: val => this.$formatMoney(val)
          },
          
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
    ...mapState('clients',['clients']),
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
    
  },
  methods:{
    ...mapActions('sales',['addSale']),
    ...mapActions('products',['addSaleProduct','setProducts']),
    ...mapActions('clients',['setClients']),
    ...mapActions('notifications',['getNotifications']),
    onRequest(props){
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.getProducts(page,rowsPerPage,filter)
    },
    getClients() {
      this.$axios.get('/persons?role=cliente')
      .then(res=>{
        this.setClients(res.data)
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
    selectSubmit(val){
      this.selected_submit = val
      this.confirm = true
    },
    getProducts(page,per_page,filter) {
      let query = filter ? filter : '';
      this.loading = true
      this.$axios.get('/products?stock=true&page='+page+'&per_page='+per_page+'&filter='+query)
      .then(res=>{
        this.pagination.rowsNumber = res.data.total
        this.loading = false
        res.data = res.data.data.map(item=>{
          const cal = (val,porcent) => {
            let cal = parseFloat(val) * (porcent/100)
            return cal + parseFloat(val)
          }
          return {
            ...item,
            price_sale_20:cal(item.price_cost,20),
            price_sale_30:cal(item.price_cost,30),
            price_sale_40:cal(item.price_cost,40),
            price_sale_50:cal(item.price_cost,50),
          }
        })
        this.products_clone = JSON.parse(JSON.stringify(res.data))
        this.setProducts(res.data)
      })
    },
    select_product(product){
      //add product to products_selected
      product.row.quantity = 1
      let cal = parseFloat(product.row.price_cost) * (this.porcent_selected/100)
      product.row.price_sale = cal + parseFloat(product.row.price_cost)
      this.products_selected.push(product.row)
      //remove product for product_clone
      let index_clone = this.products_clone.findIndex(item=>item.code == product.row.code)
      this.products_clone.splice(index_clone,1)
    },
    selected(e,product){
      // validate when the quantity not > what quantity stock
      let quantity = parseInt(e.target.value)
      if(product.quantity_stock >= quantity){
        product.quantity = quantity 
      }else{
        product.quantity = product.quantity_stock 
      }
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
      let client = this.clients.find(item=>item.id == this.client_selected.value)
      let data = {
        porcent:this.porcent_selected,
        total:this.totalPrice,
        client,
        products:this.products_selected,
        status:this.selected_submit
      }
      this.$axios.post('sales',data)
      .then(()=>{
        this.addSale(data)
        this.addSaleProduct(data.products)
        this.$q.notify({
          message: 'Venta realizada con éxito.',
          caption: 'Felicitaciones',
          color: 'green'
        })
        this.confirm = false
        this.selected_submit = null
        this.onRequest({
          pagination:this.pagination,
          filter:undefined
        })
        this.getNotifications()
        this.cancel()
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