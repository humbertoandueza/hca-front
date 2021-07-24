<template>
    <q-page class="q-pa-sm">
        <div class="row q-col-gutter-lg">
            <div class="col-12">
              <q-card class="my-card">
                <q-card-section>
                  <div class="text-center">
                    <h4>Registrar Orden de servicio</h4>
                  </div>
                    <q-form
                      ref="form1"
                      @submit="submit"
                      class="q-gutter-md q-pa-sm"
                      >
                      <div class="row justify-end">
                        <div class="col-md-2 col-xs-6">
                          <q-input
                              dense outlined
                              v-model="order.invoice"
                              label="Factura N° *"
                              mask="########"
                              lazy-rules
                              :rules="[ val => val && val.length >= 3 || 'Por favor introduzca un número de factura']"
                          />
                        </div>
                        <div class="col-md-2 col-xs-6">
                          <q-input
                              dense outlined
                              v-model="order.odr"
                              label="ORD *"
                              lazy-rules
                              :rules="[ val => val && val.length >= 2 || 'Por favor introduzca un número de orden']"
                          />
                        </div>
                      </div>
                      <div class="row justify-center">
                        <div class="col-3">
                          <q-select
                            borderless
                            dense outlined
                            v-model="client_id"
                            use-input
                            label="Cliente" stack-label
                            hide-selected
                            fill-input
                            input-debounce="0"
                            :options="options_clients"
                            @input="getVehicles"
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
                        </div>
                        <div class="col-3">
                          <q-select
                            borderless
                            dense outlined
                            v-model="vehicle_id"
                            use-input
                            label="Vehiculos" stack-label
                            hide-selected
                            fill-input
                            input-debounce="0"
                            :options="options_vehicles"
                            lazy-rules
                            :rules="[ val => val.value && val.label.length > 0 || 'Por favor seleccione una opción']"
                          />
                        </div>
                        <div class="col-md-2 col-xs-6">
                          <q-input
                              dense outlined
                              v-model="order.km"
                              label="Km *"
                              mask="########"
                              lazy-rules
                              :rules="[ val => val && val.length >= 0 || 'Por favor introduzca un km']"
                          />
                        </div>
                        <div class="col-md-2 col-xs-6">
                          <q-input
                              dense outlined
                              type="date"
                              v-model="order.date"
                              label="Fecha *"
                              lazy-rules
                              :rules="[ val => val && val.length >= 10 || 'Por favor introduzca una fecha']"
                          />
                        </div>
                      </div>
                      <div class="row q-col-gutter-lg justify-center">
                        <div class="col-md-2 col-xs-6">
                          <div class="text-center text-bold">
                            <label>MOTOR</label>
                          </div>
                          <q-checkbox v-model="order.mot_rec" label="SE RECALIENTA" />
                          <q-checkbox v-model="order.mot_gol" label="GOLPEA" />
                          <q-checkbox v-model="order.mot_dif" label="DIFICULTAD ARRANQUE" />
                          <q-checkbox v-model="order.mot_fal" label="FALLA" />
                          <q-checkbox v-model="order.mot_fue" label="NO TIENE FUERZA" />
                          <q-checkbox v-model="order.mot_apa" label="SE APAGA" />
                          <q-checkbox v-model="order.mot_exp" label="HACE EXPLOSIONES" />
                          <q-checkbox v-model="order.mot_ace" label="NO ACELERA" />

                          <div class="text-center text-bold q-mt-md">
                            <label>EMBRAGUE</label>
                          </div>
                          <q-checkbox v-model="order.emb_des" label="DESLIZA" />
                          <br>
                          <q-checkbox v-model="order.emb_peg" label="SE PEGA" />

                          <div class="text-center text-bold q-mt-md">
                            <label>DIRECCION</label>
                          </div>
                          <q-checkbox v-model="order.dir_dur" label="DURA" />
                          <br>
                          <q-checkbox v-model="order.dir_jue" label="MUCHO JUEGO" />
                          <br>
                          <q-checkbox v-model="order.dir_tie" label="TIEMBLA" />
                          <br>
                          <q-checkbox v-model="order.dir_chi" label="CHILLA" />
                        </div>
                        <div class="col-md-2 col-xs-6">
                          <div class="text-center text-bold">
                            <label>CAUCHOS</label>
                          </div>
                          <q-checkbox v-model="order.cau_cor" label="CORTADO" />
                          <q-checkbox v-model="order.cau_pin" label="PINCHADO" />
                          <q-checkbox v-model="order.cau_des" label="DESGASTADO" />
                          <q-checkbox v-model="order.cau_rep" label="CAUCHO REPUESTO" />

                          <div class="text-center text-bold q-mt-md">
                            <label>ALTERNADOR</label>
                          </div>
                          <q-checkbox v-model="order.alt_car" label="NO CARGA" />
                          <br>
                          <q-checkbox v-model="order.alt_dan" label="CORREA DAÑADA" />

                          <div class="text-center text-bold q-mt-md">
                            <label>AGUA [FILTRACION]</label>
                          </div>
                          <q-checkbox v-model="order.agu_bom" label="BOMBA" />
                          <br>
                          <q-checkbox v-model="order.agu_con" label="CONEXIONES" />
                          <br>
                          <q-checkbox v-model="order.agu_rad" label="RADIADOR" />
                          <br>
                          <q-checkbox v-model="order.agu_man" label="MANGUERAS" />
                          <br>
                          <q-checkbox v-model="order.agu_cor" label="CORREA BOMBA AGUA" />

                          <div class="text-center text-bold q-mt-md">
                            <label>ARRANQUE</label>
                          </div>
                          <q-checkbox v-model="order.arr_peg" label="SE PEGA" />
                          <br>
                          <q-checkbox v-model="order.arr_fun" label="NO FUNCIONA" />
                          
                        </div>
                        <div class="col-md-2 col-xs-6">
                          <div class="text-center text-bold">
                            <label>GASOLINA</label>
                          </div>
                          <q-checkbox v-model="order.gas_bom" label="BOMBA" />
                          <q-checkbox v-model="order.gas_car" label="CARBURADOR " />
                          <q-checkbox v-model="order.gas_tan" label="TANQUE" />
                          <q-checkbox v-model="order.gas_tub" label="TUBERIAS" />
                          <q-checkbox v-model="order.gas_mar" label="MARCADOR" />

                          <div class="text-center text-bold q-mt-md">
                            <label>FRENOS</label>
                          </div>
                          <q-checkbox v-model="order.fre_chi" label="CHILLAN" />
                          <br>
                          <q-checkbox v-model="order.fre_dis" label="DISPAREJOS" />
                          <br>
                          <q-checkbox v-model="order.fre_baj" label="BAJOS" />

                          <div class="text-center text-bold q-mt-md">
                            <label>RUIDOS</label>
                          </div>
                          <q-checkbox v-model="order.rui_mot" label="MOTOR" />
                          <br>
                          <q-checkbox v-model="order.rui_arr" label="ARRANQUE" />
                          <br>
                          <q-checkbox v-model="order.rui_dir" label="DIRECCION" />
                          <br>
                          <q-checkbox v-model="order.rui_tra" label="TRANSMISION" />
                          <br>
                          <q-checkbox v-model="order.rui_del" label="RUEDAS DELANTERAS" />
                          <br>
                          <q-checkbox v-model="order.rui_trs" label="RUEDAS TRASERAS" />
                          <br>
                          <q-checkbox v-model="order.rui_caj" label="CAJA DE VELOCIDAD" />
                        </div>
                        <div class="col-md-2 col-xs-6">
                          <div class="text-center text-bold">
                            <label>ACEITE [FILTRACION] </label>
                          </div>
                          <q-checkbox v-model="order.ace_car" label="CARTER" />
                          <q-checkbox v-model="order.ace_ace" label="TAPA DE ACEITE" />
                          <q-checkbox v-model="order.ace_val" label="TAPA VALVULA" />
                          <q-checkbox v-model="order.ace_fil" label="FILTRO" />
                          <br>
                          <q-checkbox v-model="order.ace_pre" label="PRESION" />
                          <q-checkbox v-model="order.ace_fal" label="FALTA ACEITE" />

                          <div class="text-center text-bold q-mt-md">
                            <label>ELECTRICIDAD</label>
                          </div>
                          <q-checkbox v-model="order.ele_sil" label="SILVINES" />
                          <br>
                          <q-checkbox v-model="order.ele_sto" label="STOP" />
                          <br>
                          <q-checkbox v-model="order.ele_gen" label="LUCES GENERAL" />
                          <br>
                          <q-checkbox v-model="order.ele_int" label="LUZ INTERNA" />
                          <br>
                          <q-checkbox v-model="order.ele_ext" label="LUZ EXTERNA" />
                          <br>
                          <q-checkbox v-model="order.ele_bat" label="BATERIAS" />
                          <br>
                          <q-checkbox v-model="order.ele_bor" label="BORNES" />
                          <div class="text-center text-bold q-mt-md">
                            <label>DIAGNOSTICO OBD II</label>
                          </div>
                          <q-checkbox v-model="order.dia_luc" label="LUCES ADVERTENCIA (TABLERO)" />
                        </div>
                        <div class="col-md-2 col-xs-6">
                          <div class="text-center text-bold">
                            <label>VARIOS</label>
                          </div>
                          <q-checkbox v-model="order.var_cor" label="CORNETA" />
                          <q-checkbox v-model="order.var_lim" label="LIMPIA PARABRISAS" />
                          <q-checkbox v-model="order.var_esp" label="ESPEJOS" />
                          <q-checkbox v-model="order.var_odo" label="ODOMETRO" />
                          <q-checkbox v-model="order.var_ven" label="VENTILADORES" />

                          <div class="text-center text-bold q-mt-md">
                            <label>OTROS</label>
                          </div>
                          <q-checkbox v-model="order.otr_com" label="COMPUERTAS" />
                          <br>
                          <q-checkbox v-model="order.otr_bis" label="BISAGRAS" />
                          <br>
                          <q-checkbox v-model="order.otr_asi" label="ASIENTOS" />
                          <br>
                          <q-checkbox v-model="order.otr_vid" label="VIDRIOS ASTILLADOS" />
                          <div class="text-center text-bold q-mt-md">
                            <label>GRASAS</label>
                          </div>
                          <q-checkbox v-model="order.gra_rue" label="RUEDAS" />
                          <br>
                          <q-checkbox v-model="order.gra_car" label="CARDAN" />
                          <q-checkbox v-model="order.gra_tre" label="TREN DELANTERO" />
                        </div>
                        <div class="col-10">
                          <q-input
                              dense outlined
                              v-model="order.description"
                              label="Descripción de Defectos *"
                              type="textarea"
                          />
                        </div>
                        <div class="col-10">
                          <q-select
                            borderless
                            dense outlined
                            v-model="team_id"
                            use-input
                            label="Equipos" stack-label
                            hide-selected
                            fill-input
                            map-options
                            input-debounce="0"
                            :options="options_teams"
                            lazy-rules
                            :rules="[ val => val.value && val.label.length > 0 || 'Por favor seleccione una opción']"
                          />
                        </div>
                      </div>
                      <div class="flex justify-center">
                        <q-btn type="submit" color="primary" :label="'Guardar'" />
                      </div>
                    </q-form>
                </q-card-section>
              </q-card>
          </div>
        </div>
    </q-page>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      one:false,
      client_id:null,
      vehicle_id:null,
      team_id:null,
      order:{
        odr:'',
        invoice:'0001',
        vehicle_id:null,
        team_id:null,
        km:'',
        date:moment().format('YYYY-MM-DD'),
        description:'',
        mot_rec:false,
        mot_gol:false,
        mot_dif:false,
        mot_fal:false,
        mot_fue:false,
        mot_apa:false,
        mot_exp:false,
        mot_ace:false,
        emb_des:false,
        emb_peg:false,
        dir_dur:false,
        dir_jue:false,
        dir_tie:false,
        dir_chi:false,
        cau_cor:false,
        cau_pin:false,
        cau_des:false,
        cau_rep:false,
        alt_car:false,
        alt_dan:false,
        agu_bom:false,
        agu_con:false,
        agu_rad:false,
        agu_man:false,
        agu_cor:false,
        arr_peg:false,
        arr_fun:false,
        gas_bom:false,
        gas_car:false,
        gas_tan:false,
        gas_tub:false,
        gas_mar:false,
        fre_chi:false,
        fre_dis:false,
        fre_baj:false,
        rui_mot:false,
        rui_arr:false,
        rui_dir:false,
        rui_tra:false,
        rui_del:false,
        rui_trs:false,
        rui_caj:false,
        ace_car:false,
        ace_ace:false,
        ace_val:false,
        ace_fil:false,
        ace_pre:false,
        ace_fal:false,
        ele_sil:false,
        ele_sto:false,
        ele_gen:false,
        ele_int:false,
        ele_ext:false,
        ele_bat:false,
        ele_bor:false,
        dia_luc:false,
        var_cor:false,
        var_lim:false,
        var_esp:false,
        var_odo:false,
        var_ven:false,
        otr_com:false,
        otr_bis:false,
        otr_asi:false,
        otr_vid:false,
        gra_rue:false,
        gra_car:false,
        gra_tre:false,
      },
      options_clients:[],
      options_vehicles:[],
      options_teams:[],
      clients_clone:[],
    }
  },
  async created() {
    await this.getClients()
    await this.getTeams()
    let id = this.$route.params.id
    if(id){
      this.getOrder(id)
    }
  },
  methods: {
    submit(){
      this.$store.commit('startLoading')
      this.order.team_id = this.team_id.value
      this.order.vehicle_id = this.vehicle_id.value
      let id = this.$route.params.id
      if(id){
        this.$axios.put('orders/'+id,this.order)
        .then(res=>{
          this.$store.commit('stopLoading')
          this.$q.notify({
            message: 'Orden de servicio actualizada con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/order/list')
        })
        .catch(err=>{
          this.$store.commit('stopLoading')
          console.log(err)
          this.$q.notify({
            message: err.response.data.message,
            caption: '!Error¡',
            color: 'red'
          })
        })
      }else{
        this.$axios.post('orders',this.order)
        .then(res=>{
          this.$store.commit('stopLoading')
          this.$q.notify({
            message: 'Orden de servicio registrada con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/order/list')
        })
        .catch(err=>{
          this.$store.commit('stopLoading')
          console.log(err)
          this.$q.notify({
            message: err.response.data.message,
            caption: '!Error¡',
            color: 'red'
          })
        })
      }
    },
    getOrder(id) {
      this.$store.commit('startLoading')
      this.$axios.get('orders/'+id)
        .then(res=>{
          this.$store.commit('stopLoading')
          let val = Object.entries(res.data)
          for(let i = 0;i < val.length;i++){
            console.log(val[i])
            let key = val[i][0]
            let v = val[i][1]
            let value = v;
            if(v === 1){
              value = true 
            }
            if(v === 0) {
              value = false
            }
            this.order[key] = value
          }
          this.team_id = this.options_teams.find(item=>item._id == res.data.team_id)
        })
        .catch(err=>{
          this.$store.commit('stopLoading')
          console.log(err)
        })
    },
    getVehicles(val) {
      if(val.value){
        this.$store.commit('startLoading')
        let _id = val.value
        this.$axios.get('vehicles?id='+_id)
        .then(res=>{
          this.$store.commit('stopLoading')
          this.options_vehicles = res.data.map(item=>{
            return {
              value:item.id,
              _id:item.id,
              label:`${item.name} ${item.model} (${item.plates})`
            }
          })
        })
        .catch(err=>{
          this.$store.commit('stopLoading')
          console.log(err)
        })
      }
    },
    async getTeams(){
      this.$store.commit('startLoading')
      await this.$axios.get('teams')
      .then(res=>{
        this.$store.commit('stopLoading')
        this.options_teams = res.data.map(item=>{
          return {
            value:item.id,
            _id:item.id,
            label:`${item.name}`
          }
        })
        console.log(this.options_teams)
      })
      .catch(err=>{
        this.$store.commit('stopLoading')
        console.log(err)
      })
    },
    async getClients(){
      this.$store.commit('startLoading')
      await this.$axios.get('persons?role=cliente')
      .then(res=>{
        this.$store.commit('stopLoading')
        this.options_clients = res.data.map(item=>{
          return {
            value:item.id,
            _id:item.id,
            label:`(${item.ci}) ${item.name} ${item.last_name}`
          }
        })
        this.clients_clone = this.options_clients
      })
      .catch(err=>{
        this.$store.commit('stopLoading')
        console.log(err)
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
