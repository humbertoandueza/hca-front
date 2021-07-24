<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Stock de productos
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :data="products"
          :columns="columns"
          row-key="_id"
          :filter="filter"
          :loading="loading"
          :pagination.sync="pagination"
          @request="onRequest"
          :visible-columns="visibleColumns"
          no-data-label="No hay resultados"
          no-results-label="No hay resultados"
          rows-per-page-label="registros por página"
          :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
        >
        <template v-slot:top-right="props">

          <q-input v-if="show_filter"  borderless dense outlined debounce="300" v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          <q-btn
            flat round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />
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
                <q-btn round size="sm" @click="show(props.row._id)" color="teal" icon="visibility" />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-quantity_initial="props">
            <q-td :props="props">
              <q-badge color="green">
                {{ props.row.quantity_initial }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-quantity_output="props">
            <q-td :props="props">
              <q-badge color="red">
                {{ props.row.quantity_output }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-quantity_entry="props">
            <q-td :props="props">
              <q-badge color="info">
                {{ props.row.quantity_entry }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-quantity_stock="props">
            <q-td :props="props">
              <q-badge :color="props.row.quantity_stock <= 10 ? 'red':'green'">
                {{ props.row.quantity_stock }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="show_product"
      full-width
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Producto: {{product.name}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-lg flex justify-around">
            <div class="col-4">
              <p class="text-bold">Código:{{product.code}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Nombre:{{product.name}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Kit/Unidades/Juegos:{{product.type_unit}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Marca:{{product.brand}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Serial:{{product.serial}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Tipo de carro:{{product.type_vehicle}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Ubicación:{{product.location.label}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Precio de costo:{{$formatMoney(product.price_cost)}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Cantidad de productos iniciales:{{product.quantity_initial}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Precio de venta:{{$formatMoney(product.price_sale)}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Cantidad de productos entrantes:{{product.quantity_entry}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Cantidad de productos vendidos:{{product.quantity_output}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Cantidad de productos disponibles:{{product.quantity_stock}}</p>
            </div>
            <div class="col-12">
              <p class="text-bold">Descripción:{{product.description}}</p>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { mapState , mapActions } from 'vuex'
export default {
  name: "list-products",
  data() {
    return {
      visibleColumns:[],
      _id:null,
      show_product:false,
      confirm:false,
      product:{
        code:'',
        name:'',
        description:'',
        type_unit:'kit',
        brand:'',
        serial:'',
        type_vehicle:'',
        location:'',
        price_cost:0,
        price_sale:0,
        quantity_initial:0,
        quantity_entry:0,
        quantity_output:0,
        quantity_stock:0
      },
      loading:false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 10
      },
      filter: '',
      show_filter: true,
      columns: [
        {
          name: 'code',
          required: true,
          label: 'Código',
          align: 'left',
          field:'code'
        },
        {
          name: 'name',
          required: true,
          label: 'Producto',
          align: 'left',
          field:'name'
        },
        {
          name: 'serial',
          required: true,
          label: 'Serial',
          align: 'left',
          field:'serial'
        },
        {
          name: 'quantity_stock',
          required: true,
          label: 'Cantidad Disponible',
          align: 'center',
          field:'quantity_stock',
          sortable: true
        },
        {
          name: 'quantity_initial',
          required: true,
          label: 'Cantidad Inicial',
          align: 'center',
          field:'quantity_initial',
          sortable: true
        },
        {
          name: 'quantity_output',
          required: true,
          label: 'Cantidad Vendida',
          align: 'center',
          field:'quantity_output',
          sortable: true
        },
        {
          name: 'quantity_entry',
          required: true,
          label: 'Cantidad Entrante',
          align: 'center',
          field:'quantity_entry',
          sortable: true
        },
        
        {
          name: 'id',
          required: true,
          label: 'Acciones',
          align: 'left',
          field:'_id'
        }
      ]
    }
  },
  computed:{
    ...mapState('products',['products'])
  },
  created(){
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  methods:{
    ...mapActions('products',['setProducts']),
    onRequest(props){
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.getProducts(page,rowsPerPage,filter)
    },
    getProducts(page,per_page,filter){
      let query = filter ? filter : '';
      this.loading = true
      this.$axios.get('/products?page='+page+'&per_page='+per_page+'&filter='+query)
      .then(res=>{
        this.pagination.rowsNumber = res.data.total
        this.loading = false
        this.setProducts(res.data.data)
      })
      .catch(err=>{
        console.log(err)
        this.$q.notify({
          message: 'Ocurrio un error al obtener los productos',
          caption: '¡Error!',
          color: 'red'
        })
      })
    },
    show(_id){
      this.product = this.products.find(item=>item._id == _id)
      this.show_product = true
    }
  }
}
</script>