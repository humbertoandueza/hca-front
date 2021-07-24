<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Listado de Clientes
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :data="clients"
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
          <q-btn round size="sm" class="q-ma-sm" @click="$router.push(`/client/create`)" color="primary" icon="add" />

        </template>
          
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="flex justify-around ">
                <q-btn round size="sm" @click="show_vehicle(props.row.id)" color="green" icon="directions_car_filled" />
                <q-btn round size="sm" @click="show(props.row.id)" color="teal" icon="visibility" />
                <q-btn round size="sm" @click="$router.push(`/client/edit/${props.row.id}`)" color="info" icon="edit" />
                <q-btn round size="sm" @click="confirm_delete(props.row.id)" color="red" icon="delete" />

              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="show_client"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Cliente: {{client.name}} {{client.last_name}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-lg flex justify-around">
            <div class="col-12 text-center">
              <p class="text-bold">Cédula:{{client.ci}}</p>
            </div>
            <div class="col-6">
              <p class="text-bold">Correo Electrónico: <br>{{client.email}}</p>
            </div>
            <div class="col-6">
              <p class="text-bold">Teléfono: <br>{{client.phone}}</p>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="show_vehicles"
      full-height
      full-width
    >
      <q-card>
        <q-card-section>
          <div class="text-center">
            <p class="text-h6">
              Registrar Vehiculo
            </p>
          </div>
            <q-form
              ref="formvehicles"
              @submit="submitVehicle"
              class="q-gutter-md q-pa-sm"
              >
              <div class="row q-col-gutter-lg">
                <div class="col-lg-3 col-md-4 col-sm-12">
                  <q-input
                      dense outlined
                      v-model="vehicle.name"
                      label="Marca *"
                      lazy-rules
                      :rules="[ val => val && val.length >= 2 || 'Por favor introduzca una marca']"
                  />
                </div>
                <div class="col-lg-2 col-md-4 col-sm-12">
                  <q-input
                      dense outlined
                      v-model="vehicle.model"
                      label="Modelo *"
                      lazy-rules
                      :rules="[ val => val && val.length > 2 || 'Por favor introduzca un modelo']"
                  />
                </div>
                <div class="col-lg-2 col-md-4 col-sm-12">
                  <q-input
                      dense outlined
                      v-model="vehicle.color"
                      label="Color *"
                      lazy-rules
                      :rules="[val => val && val.length > 2 || 'Por favor introduzca un color']"
                  />
                </div>
                <div class="col-lg-2 col-md-4 col-sm-12">
                  <q-input
                      dense outlined
                      v-model="vehicle.year"
                      label="Año *"
                      mask="####"
                      lazy-rules
                      :rules="[val => val && val.length > 3 || 'Por favor introduzca un año válido']"
                  />
                </div>
                <div class="col-lg-2 col-md-4 col-sm-12">
                  <q-input
                      dense outlined
                      v-model="vehicle.plates"
                      label="Placa *"
                      lazy-rules
                      :rules="[ val => val && val.length > 4 || 'Por favor introduzca una placa' ]"
                  />
                </div>
                <div class="col-lg-1 col-md-4 col-sm-12">
                  <q-btn type="submit" class="float-right" color="primary" :label="'Guardar'" />
                </div>
              </div>
            </q-form>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">Vehiculos de {{client.name}} {{client.last_name}}</div>
          <q-table
            :data="vehicles"
            :columns="columns_vehicles"
            row-key="_id"
            :filter="filter_vehicles"
            :pagination="initialPagination"
            no-data-label="No hay resultados"
            no-results-label="No hay resultados"
            rows-per-page-label="registros por página"
            :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
          >
            <template v-slot:top-right>
              <q-input  borderless dense outlined debounce="300" v-model="filter_vehicles" placeholder="Buscar">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
            </template>

            <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="flex justify-around ">
                <q-btn round size="sm" @click="confirm_delete_vehicle(props.row.id)" color="red" icon="delete" />
              </div>
            </q-td>
          </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
    <q-dialog v-model="confirm_vehicle" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="filter_alt" color="primary" text-color="white" />
          <span class="q-ml-sm">¿Esta seguro de eliminar el registro?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red" v-close-popup />
          <q-btn flat label="Confirmar" color="primary" @click="removeVehicle" />
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
      _id:null,
      _id_vehicle:null,
      show_client:false,
      show_vehicles:false,
      vehicles:[],
      confirm:false,
      confirm_vehicle:false,
      vehicle:{
        name:'',
        model:'',
        color:'',
        year:'',
        plates:'',
        client_id:null
      },
      client:{
        name:'',
        last_name:'',
        ci:'',
        phone:'',
        email:''
      },
      initialPagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      filter: '',
      filter_vehicles: '',
      show_filter: true,
      columns: [
        {
          name: 'ci',
          required: true,
          label: 'Cédula',
          align: 'left',
          field:'ci'
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre y Apellido',
          align: 'left',
          field: row => `${row.name} ${row.last_name}` 
        },
        {
          name: 'email',
          required: true,
          label: 'Correo Electrónico',
          align: 'left',
          field:'email'
        },
        {
          name: 'phone',
          label: 'Teléfono',
          align: 'center',
          field:'phone'
        },
        {
          name: 'id',
          label: 'Acciones',
          align: 'center',
          field:'id'
        }
      ],
      columns_vehicles: [
        {
          name: ' name',
          required: true,
          label: 'Marcar',
          align: 'left',
          field:'name'
        },
        {
          name: 'model',
          required: true,
          label: 'Modelo',
          align: 'left',
          field: 'model' 
        },
        {
          name: 'color',
          required: true,
          label: 'Color',
          align: 'left',
          field:'color'
        },
        {
          name: 'year',
          label: 'Año',
          align: 'center',
          field:'year'
        },
        {
          name: 'plates',
          label: 'Placa',
          align: 'center',
          field:'plates'
        },
        {
          name: 'id',
          label: 'Acciones',
          align: 'center',
          field:'id'
        }
      ]
    }
  },
  computed:{
    ...mapState('clients',['clients'])
  },
  created(){
    this.getClients()
  },
  methods:{
    ...mapActions('clients',['removeClient','setClients']),
    getClients(){
      this.$axios.get('persons?role=cliente')
      .then(res=>{
        this.setClients(res.data)
      })
    },
    remove(){
      this.$axios.delete('/persons/'+this._id)
      .then(()=>{
        this.$q.notify({
          message: 'Cliente removido con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this._id = null
        this.confirm = false
        this.removeClient(this._id)
        this.getClients()
      })
      
    },
    removeVehicle(){
      this.$axios.delete('/vehicles/'+this._id_vehicle)
      .then(()=>{
        this.$q.notify({
          message: 'Vehiculo removido con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this._id_vehicle = null
        this.confirm_vehicle = false
        this.getVehicles(this._id)
      })
      
    },
    confirm_delete(_id){
      this.confirm = true 
      this._id = _id
    },
    getVehicles(_id){
       this.$axios.get('vehicles?id='+_id)
      .then(res=>{
        this.vehicles = res.data
      })
      .catch(err=>{
        console.log(err)
      })
    },
    confirm_delete_vehicle(_id){
      this.confirm_vehicle = true 
      this._id_vehicle = _id
    },
    show(_id){
      this.client = this.clients.find(item=>item.id == _id)
      this.show_client = true
    },
    show_vehicle(_id) {
      this.getVehicles(_id)
      this.vehicle.client_id = _id
      this._id = _id
      this.show_vehicles = true
      this.client = this.clients.find(item=>item.id == _id)
    },
    submitVehicle(){
      this.$axios.post('vehicles',this.vehicle)
      .then(()=>{
        this.getVehicles(this.vehicle.client_id)
        this.vehicle.name = ''
        this.vehicle.code = ''
        this.vehicle.color = ''
        this.vehicle.year = ''
        this.vehicle.plates = ''
        this.vehicle.model = ''
        this.$refs.formvehicles.reset()
      })
      .catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>