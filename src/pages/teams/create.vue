<template>
    <q-page class="q-pa-sm">
        <div class="row q-col-gutter-lg">
            <div class="col-12">
              <q-card class="my-card">
                <q-card-section>
                  <div class="text-center">
                    <h4>Registrar Equipo</h4>
                  </div>
                    <q-form
                      ref="form1"
                      @submit="submit"
                      class="q-gutter-md q-pa-sm"
                      >
                      <div class="row q-col-gutter-lg">
                        <div class="col-4">
                          <q-input
                              dense outlined
                              v-model="team.name"
                              label="Nombre *"
                              lazy-rules
                              :rules="[ val => val && val.length > 2 || 'Por favor introduzca un nombre']"
                          />
                        </div>
                        <div class="col-8">
                          <q-input
                              dense outlined
                              v-model="team.description"
                              label="Descripción"
                              lazy-rules
                              :rules="[val => val && val.length > 0 || 'Por favor introduzca una descripcion']"
                          />
                        </div>
                        <div class="col-6">
                          <q-input
                              dense outlined
                              type="email"
                              v-model="team.email"
                              label="Correo Electrónico *"
                              lazy-rules
                              :rules="[ val => !!val || 'Correo electrónico Electrónico invalido', isValidEmail ]"
                          />
                        </div>
                        <div class="col-6">
                          <q-input
                              dense outlined
                              type="password"
                              v-model="team.password"
                              label="Contraseña *"
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
import {mapActions , mapState} from 'vuex'
export default {
  data () {
    return {
      team:{
        name:'',
        description:'',
        password:'',
        email:''
      }
    }
  },
  computed:{
    ...mapState('teams',['teams']),
  },
  created() {
    if(this.$route.params.id) {
      this.getTeam()
    }
  },
  methods: {
    ...mapActions('teams',['addTeam','updateTeam']),
    
    getTeam(){
      let _id = this.$route.params.id
      this.$axios.get('/teams/'+_id)
      .then(res=>{
        this.team = res.data
        this.team.email = res.data.user.email
      })
      //this.client = this.clients.find(item=>item.id === _id)
    },
    submit() {
      let _id = this.$route.params.id
      if(_id){
        this.$axios.put('/teams/'+_id,this.team)
        .then(()=>{
          this.updateTeam(this.team)
          this.$q.notify({
            message: 'Equipo Actualizado con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/team/list')
        })
        .catch(err=>{
          console.log(err.response.data.message)
          this.$q.notify({
            message: err.response.data.message,
            caption: '!Error¡',
            color: 'red'
          })
        })
      }else{
        this.$axios.post('/teams',this.team)
        .then(()=>{
          this.addTeam(this.team)
          this.$q.notify({
            message: 'Equipo añadido con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/team/list')
        })
        .catch(err=>{
          console.log(err.response.data.message)
          this.$q.notify({
            message: err.response.data.message,
            caption: '!Error¡',
            color: 'red'
          })
        })
      }
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Correo Electrónico Invalido';
    }
  }
}
</script>