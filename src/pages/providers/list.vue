<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Listado de Proveedores
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :data="providers"
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
          <q-btn round size="sm" class="q-ma-sm" @click="$router.push(`/provider/create`)" color="primary" icon="add" />

        </template>
          
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="flex justify-around ">
                <q-btn round size="sm" @click="show(props.row.id)" color="teal" icon="visibility" />
                <q-btn round size="sm" @click="$router.push(`/provider/edit/${props.row.id}`)" color="info" icon="edit" />
                <q-btn round size="sm" @click="confirm_delete(props.row.id)" color="red" icon="delete" />

              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="show_provider"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Proveedor: {{provider.name}} {{provider.last_name}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-lg flex justify-around">
            <div class="col-12 text-center">
              <p class="text-bold">Rif o CI:{{provider.ci}}</p>
            </div>
            <div class="col-6">
              <p class="text-bold">Correo Electrónico: <br>{{provider.email}}</p>
            </div>
            <div class="col-6">
              <p class="text-bold">Teléfono: <br>{{provider.phone}}</p>
            </div>
          </div>
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
  </q-page>
</template>
<script>
import { mapState , mapActions } from 'vuex'
export default {
  name: "list-products",
  data() {
    return {
      _id:null,
      show_provider:false,
      confirm:false,
      provider:{
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
      show_filter: true,
      columns: [
        {
          name: 'ci',
          required: true,
          label: 'Rif o CI',
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
      ]
    }
  },
  computed:{
    ...mapState('providers',['providers'])
  },
  created() {
    this.getProviders()
  },
  methods:{
    ...mapActions('providers',['removeProvider','setProviders']),
    getProviders(){
      this.$axios.get('/persons?role=provider')
      .then(res=>{
        this.setProviders(res.data)
      })
    },
    remove(){
      this.$axios.delete('/persons/'+this._id)
      .then(()=>{
        this.removeProvider(this._id)
        this.$q.notify({
          message: 'Proveedor removido con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this._id = null
        this.confirm = false
        this.getProviders()
      })
     
    },
    confirm_delete(_id){
      this.confirm = true 
      this._id = _id
    },
    show(_id){
      this.provider = this.providers.find(item=>item.id == _id)
      this.show_provider = true
    }
  }
}
</script>