<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Listado de ordenes
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
          <q-btn round size="sm" class="q-ma-sm" @click="$router.push(`/order/create`)" color="primary" icon="add" />

        </template>
          
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="flex justify-around ">
                <q-btn round size="sm" @click="$router.push(`/order/edit/${props.row.id}`)" color="info" icon="edit" />
                <q-btn round size="sm" @click="start_repair(props.row.id)" color="teal" icon="directions_car_filled" />
                <q-btn round size="sm" @click="confirm_delete(props.row.id)" color="red" icon="delete" />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="filter_alt" color="primary" text-color="white" />
          <span class="q-ml-sm">¿Esta seguro de eliminar el registro?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red" v-close-popup />
          <q-btn flat label="Confirmar" color="primary" @click="remove" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="repair_modal"  full-height full-width>
      <q-card>
        <q-card-section class="row items-center">
          <div class="col-12 text-center q-mb-lg">
            <q-avatar icon="directions_car_filled" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Reparaciones</span>
          </div>
          <div class="col-12">

          <div class="row q-pa-sm items-center q-col-gutter-sm flex" v-for="(repair,index) of repairs" :key="index">
              <div class="col-4">
                  <q-input
                  label="Titulo" stack-label
                  dense outlined
                  class="q-mr-sm"
                  v-model.number="repair.title" />
              </div>
              <div class="col-8">
                  <q-input
                  label="Descripcion" stack-label
                  dense outlined
                  class="q-mr-sm"
                  v-model.number="repair.description" />
              </div>
              <div class="col-4">
                <q-field
                  label="Precio" stack-label
                  dense outlined
                  class="q-mr-sm"
                  v-model="repair.price"
                  lazy-rules
                  >
                  <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                      <money :id="id" class="q-field__input text-right" :value="value" @input="emitValue" v-bind="moneyFormatForComponent" v-show="floatingLabel" />
                  </template>
                </q-field>
              </div>
              <div class="col-7">
                <q-select
                    borderless
                    dense outlined
                    v-model="repair.status"
                    use-input
                    label="Status" stack-label
                    hide-selected
                    fill-input
                    input-debounce="0"
                    :options="options_status"
                  />
              </div>
              <div class="col-1 justify-end flex">
                <q-btn color="red" v-if="index>0" @click="repairs.splice(index,1)" size="sm" round icon="delete"/>
                <q-btn color="primary" v-if="index==0" @click="add_new_repair" size="sm" round icon="add" />
              </div>
            </div>
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
          <q-btn flat label="Confirmar" color="primary" @click="confirm_repair" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import moment from 'moment'
var status = ['Iniciado','En proceso','Finalizado','Cancelado']
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
      this.$axios.get('orders')
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
    remove(){
      console.log('aqui',this._id)
      this.$axios.get('/order/'+this._id+'/delete')
      .then(()=>{
        this.$q.notify({
          message: 'Orden de servicio removida con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this._id = null
        this.confirm = false
        this.getOrders()
      })
      .catch(err=>{
        this.$q.notify({
          message: 'Ocurrio un error al eliminar la orden de servicio',
          caption: '!Error¡',
          color: 'red'
        })
      })
    },
    confirm_delete(id) {
      this._id = id
      this.confirm = true 
    },
    start_repair(id){
      this._id_repair = id
      this.repair_modal = true
      this.getRepairs(id)
    },
    add_new_repair(){
      this.repairs.push({
        status:null,
        title:'',
        description:'',
        price:'',
        image:'null'
      })
    },
    reset_repairs () {
      this.repairs = [
        {
          status:null,
          title:'',
          description:'',
          price:'',
          image:'null'
        }
      ]
    },
    confirm_repair(){
      console.log(this.repairs)
      let data = this.repairs.map(item => {
        return {
          ...item,
          status:item.status.value,
          order_id:this._id_repair,
          created_at: moment().format('YYYY-MM-DD hh:mm:ss'),
          updated_at: moment().format('YYYY-MM-DD hh:mm:ss')
        }
      })
      this.$store.commit('startLoading')
      this.$axios.post('order_details',data)
      .then(res=>{
        this.$store.commit('stopLoading')
        this.$q.notify({
          message: 'Reparaciones registradas con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this.repairs_data = [...this.repairs_data,...data]
        this.reset_repairs()
      })
      .catch(err=>{
        this.$store.commit('stopLoading')
        this.$q.notify({
          message: 'Ocurrio un error al registrar las reparaciones',
          caption: '!Error¡',
          color: 'red'
        })
        console.log(err)
      })
    }
  }
}
</script>