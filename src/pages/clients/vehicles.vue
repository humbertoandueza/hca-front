<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Listado de Vehiculos
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
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
                  <q-btn round size="sm" @click="show(props.row.id)" color="teal" icon="visibility" />
                </div>
              </q-td>
            </template>
          </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="show_historical">
      <q-card>
        <div class="q-px-lg q-pb-md">
          <q-timeline color="secondary">
            <q-timeline-entry heading>
              <div class="text-h5 text-center">
                Historial
              </div>
            </q-timeline-entry>

            <q-timeline-entry
              v-for="historial of historical"
              :key="historial.id"
              :title="historial.title"
              :subtitle="historial.date"
            >
              <div>
                {{historial.description}}
              </div>
            </q-timeline-entry>


          </q-timeline>
        </div>
      </q-card>
    </q-dialog>
    
  </q-page>
</template>
<script>
import { mapState , mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: "list-products",
  data() {
    return {
      historical:[],
      show_historical:false,
      initialPagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      filter_vehicles: '',
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
    ...mapState('vehicles',['vehicles'])
  },
  created(){
    this.getVehicles()
  },
  methods:{
    ...mapActions('vehicles',['setVehicles']),
    show(id) {
      console.log(id)
      this.$store.commit('startLoading')
      this.$axios.get('vehicles_historical?vehicle_id='+id)
      .then(res=>{
        this.$store.commit('stopLoading')
        this.show_historical = true
        this.historical = res.data.map(item => {
          return {
            ...item,
            date:moment(item.created_at).format('YYYY-MM-DD hh:mm:ss a')
          }
        })
      })
      .catch(err=>{
        console.log(err)
      })
    },
    getVehicles(){
      let _id = this.$store.state.user.cliente.id
      this.$axios.get('vehicles?id='+_id)
      .then(res=>{
        this.setVehicles(res.data)
      })
      .catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>
<style>
.text-secondary {
  color: #dc1212 !important;
}
</style>