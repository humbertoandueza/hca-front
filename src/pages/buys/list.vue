<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Reporte de Compras
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :data="buys"
          :columns="columns"
          row-key="_id"
          :filter="filter"
          :pagination="initialPagination"
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
          
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="flex justify-around ">
                <q-btn round size="sm" @click="show(props.row.products,props.row.new_products)" color="teal" icon="visibility" />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="show_products"
      full-width
      full-height
    >
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Listado de productos</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-my-lg">
            <div class="col-12 q-ma-sm">
              <q-table
                  title="Productos registrados"
                  :data="products"
                  :columns="columns_products"
                  row-key="_id"
                  :filter="filter_p"
                  :pagination="initialPagination"
                  no-data-label="No hay resultados"
                  no-results-label="No hay resultados"
                  rows-per-page-label="registros por página"
                  :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
                  >
                  <template v-slot:top-right>
                      <q-input borderless dense outlined debounce="300" v-model="filter_p" placeholder="Buscar">
                          <template v-slot:append>
                              <q-icon name="search"/>
                          </template>
                      </q-input>
                  </template>
              </q-table>
            </div>
            <div class="col-12 q-ma-sm" v-if="products_new.length">
              <q-table
                  title="Productos no registrados"
                  :data="products_new"
                  :columns="columns_new_products"
                  row-key="_id"
                  :filter="filter_p_n"
                  :pagination="initialPagination"
                  no-data-label="No hay resultados"
                  no-results-label="No hay resultados"
                  rows-per-page-label="registros por página"
                  :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
                  >
                  <template v-slot:top-right>
                      <q-input borderless dense outlined debounce="300" v-model="filter_p_n" placeholder="Buscar">
                          <template v-slot:append>
                              <q-icon name="search"/>
                          </template>
                      </q-input>
                  </template>
              </q-table>
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
import moment from 'moment'
export default {
  name: "list-sales",
  data() {
    return {
      _id:null,
      show_products:false,
      confirm:false,
      products:[],
      products_new:[],
      initialPagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      filter: '',
      filter_p: '',
      filter_p_n: '',
      show_filter: true,
      columns: [
        {
          name: '_id',
          required: true,
          label: 'Factura Nº',
          align: 'left',
          field:row => '#'+row.number_buy
        },
        {
          name: 'created_at',
          required: true,
          label: 'Fecha',
          align: 'left',
          field:row => moment(row.created_at).format('YYYY-MM-DD h:mm:ss a')
        },
        {
          name: 'client',
          required: true,
          label: 'Proveedor',
          align: 'left',
          field:row=>`(${row.provider.ci}) ${row.provider.name} ${row.provider.last_name}`
        },
        {
          name: 'products',
          required: true,
          label: 'Cantidad de productos',
          align: 'left',
          field:row=>row.products.length
        },
        {
          name: 'total',
          required: true,
          label: 'Total',
          align: 'left',
          field: row => `${this.$formatMoney(row.total)}` 
        },
        {
          name: 'id',
          required: true,
          label: 'Acciones',
          align: 'left',
          field:'_id'
        }
      ],
      columns_products: [
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
          name: 'type_unit',
          label: 'Kit/Unidades/Juegos/',
          align: 'center',
          field:'type_unit'
        },
        {
          name: 'location',
          required: true,
          label: 'Ubicación',
          align: 'center',
          field:val=>val.location.name
        },
        {
          name: 'brand',
          label: 'Marca',
          align: 'left',
          field:'brand'
        },
        {
          name: 'type_vehicle',
          label: 'Tipo de Carro',
          align: 'center',
          field:'type_vehicle'
        },
        {
          name: 'quantity',
          required: true,
          label: 'Cantidad',
          align: 'left',
          field:'quantity'
        },
        {
          name: 'price_sale',
          required: true,
          label: 'Precio de Compra',
          align: 'left',
          field:'price_sale',
          format: val => `${this.$formatMoney(val)}`
        },
        {
          name: 'total',
          required: true,
          label: 'Total',
          align: 'left',
          field:row=>`${this.$formatMoney(row.quantity*row.price_sale)}`
        }
      ],
       columns_new_products: [
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
          name: 'quantity',
          required: true,
          label: 'Cantidad',
          align: 'left',
          field:'quantity'
        },
        {
          name: 'price_sale',
          required: true,
          label: 'Precio de Compra',
          align: 'left',
          field:'price',
          format: val => `${this.$formatMoney(val)}`
        },
        {
          name: 'total',
          required: true,
          label: 'Total',
          align: 'left',
          field:row=>`${this.$formatMoney(row.quantity*row.price)}`
        }
      ]
    }
  },
  computed:{
    ...mapState('buys',['buys'])
  },
  created(){
    this.getBuys()
  },
  methods:{
    ...mapActions('buys',['setBuys']),
    getBuys() {
      this.$axios.get('/buys')
      .then(res=>{
        console.log(res.data)
        this.setBuys(res.data)
      })
    },
    show(products,new_products){
      this.products = products.map(item=>{
        return {
          ...item,
          ...item.product
        }
      })
      this.products_new = new_products  
      this.show_products = true
    }
  }
}
</script>