<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Listado de ordenes de servicio
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :data="orders"
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
                <q-btn round size="sm" @click="start_repair(props.row.id)" color="teal" icon="directions_car_filled" />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="repair_modal"  full-height full-width>
      <q-card>
        <q-card-section class="row items-center">
          <div class="col-12 text-center q-mb-lg">
            <q-avatar icon="directions_car_filled" color="primary" text-color="white" />
            <span class="q-ml-sm">Reparaciones</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">Reparaciones</div>
          <q-table
            :data="repairs_data"
            :columns="columns_repairs"
            row-key="_id"
            :pagination="initialPagination"
            no-data-label="No hay resultados"
            no-results-label="No hay resultados"
            rows-per-page-label="registros por página"
            :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
          >
          </q-table>
          <div class="row">
            <div class="col-12 justify-end flex q-pt-lg">
              <p class="text-h5">Total:{{totalRepairs}} $</p>
            </div>
          </div>,
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
var status = ['Abierta','En proceso','Finalizado','Cancelado']
export default {
  name: "list-products",
  data() {
    return {
      _id:null,
      _id_repair:null,
      confirm:false,
      repair_modal:false,
      repairs_data: [],
      repairs:[
        {
          status:null,
          title:'',
          description:'',
          price:'',
          image:'null'
        }
      ],
      options_status:[
        {
          value:null,
          label:'Seleccione'
        },
        {
          value:0,
          label:'Iniciado'
        },
        {
          value:1,
          label:'En proceso'
        },
        {
          value:2,
          label:'Finalizado'
        },
        {
          value:3,
          label:'Cancelado'
        },
        
      ],
      moneyFormatForComponent: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        precision: 2,
        masked: false
      },
      orders:[],
      initialPagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      filter: '',
      show_filter: true,
      columns: [
        {
          name: 'invoice',
          required: true,
          label: 'Factura N°',
          align: 'left',
          field:'invoice'
        },
        {
          name: 'odr',
          required: true,
          label: 'Orden N°',
          align: 'left',
          field: 'odr' 
        },
        {
          name: 'client',
          required: true,
          label: 'Cliente',
          align: 'left',
          field:row=>row.vehicle.client.name
        },
        {
          name: 'estatus',
          required: true,
          label: 'Estatus',
          align: 'left',
          field:row=>status[row.status]
        },
        {
          name: 'vehicle',
          required: true,
          label: 'Vehiculo',
          align: 'left',
          field:row=> `${row.vehicle.name} ${row.vehicle.model}`
        },
        {
          name: 'id',
          label: 'Acciones',
          align: 'center',
          field:'id'
        }, 
      ],
      columns_repairs: [
        {
          name: 'title',
          required: true,
          label: 'Titulo',
          align: 'left',
          field:'title'
        },
        {
          name: 'description',
          required: true,
          label: 'Descripcion',
          align: 'left',
          field: 'description' 
        },
        {
          name: 'price',
          required: true,
          label: 'Precio',
          align: 'left',
          field:row=> this.$formatMoney(row.price)
        },
        {
          name: 'status',
          required: true,
          label: 'Estatus',
          align: 'left',
          field:row=> `${status[row.status]}`
        }
      ]
    }
  },
  created(){
    this.getOrders()
  },
  computed:{
    totalRepairs(){
      return this.repairs_data.reduce((acum,item)=> acum += parseFloat(item.price),0)
    }
  },
  methods:{
    getOrders() {
      let id = this.$store.state.user.cliente.id 
      console.log(id)
      this.$axios.get('orders?id='+id)
      .then(res=>{
        this.orders = res.data
      })
      .catch(err=>{
        console.log(err)
      })
    },
    getRepairs(id){
      this.$axios.get('order_details?id='+id)
      .then(res=>{
        this.repairs_data = res.data
      })
      .catch(()=>{
        this.$q.notify({
          message: 'Ocurrio un error al obtener las reparaciones',
          caption: '!Error¡',
          color: 'red'
        })
      })
    },
    start_repair(id){
      this._id_repair = id
      this.repair_modal = true
      this.getRepairs(id)
    }
  }
}
</script>