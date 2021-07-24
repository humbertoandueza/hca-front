<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Listado de Equipos
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :data="teams"
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
          <q-btn round size="sm" class="q-ma-sm" @click="$router.push(`/team/create`)" color="primary" icon="add" />

        </template>
          
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="flex justify-around ">
                <q-btn round size="sm" @click="$router.push(`/team/edit/${props.row.id}`)" color="info" icon="edit" />
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
  </q-page>
</template>
<script>
import { mapState , mapActions } from 'vuex'
export default {
  name: "list-products",
  data() {
    return {
      _id:null,
      confirm:false,
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
          name: 'name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field:'name'
        },
        {
          name: 'description',
          required: true,
          label: 'Descripción',
          align: 'left',
          field: 'description' 
        },
        {
          name: 'email',
          required: true,
          label: 'Correo Electrónico',
          align: 'left',
          field:row=>row.user.email
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
    ...mapState('teams',['teams'])
  },
  created(){
    this.getTeams()
  },
  methods:{
    ...mapActions('teams',['removeTeam','setTeams']),
    getTeams(){
      this.$axios.get('teams')
      .then(res=>{
        console.log(res.data)
        this.setTeams(res.data)
      })
    },
    remove(){
      this.$axios.delete('/teams/'+this._id)
      .then(()=>{
        this.$q.notify({
          message: 'Equipo removido con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this._id = null
        this.confirm = false
        this.removeTeam(this._id)
        this.getTeams()
      })
      
    },
    confirm_delete(_id){
      this.confirm = true 
      this._id = _id
    }
  }
}
</script>