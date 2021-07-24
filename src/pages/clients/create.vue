<template>
    <q-page class="q-pa-sm">
        <div class="row q-col-gutter-lg">
            <div class="col-12">
              <q-card class="my-card">
                <q-card-section>
                  <div class="text-center">
                    <h4>Registrar Cliente</h4>
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
                              v-model="client.ci"
                              label="Cédula *"
                              mask="########"
                              lazy-rules
                              :rules="[ val => val && val.length >= 7 || 'Por favor introduzca un cédula']"
                          />
                        </div>
                        <div class="col-4">
                          <q-input
                              dense outlined
                              v-model="client.name"
                              label="Nombre *"
                              lazy-rules
                              :rules="[ val => val && val.length > 2 || 'Por favor introduzca un nombre']"
                          />
                        </div>
                        <div class="col-4">
                          <q-input
                              dense outlined
                              v-model="client.last_name"
                              label="Apellido"
                              lazy-rules
                              :rules="[val => val && val.length > 0 || 'Por favor introduzca un apellido']"
                          />
                        </div>
                        <div class="col-6">
                          <q-input
                              dense outlined
                              type="email"
                              v-model="client.email"
                              label="Correo Electrónico *"
                              lazy-rules
                              :rules="[ val => !!val || 'Correo electrónico Electrónico invalido', isValidEmail ]"
                          />
                        </div>
                        <div class="col-6">
                          <q-input
                              dense outlined
                              v-model="client.phone"
                              mask="####-#######"
                              hint="Ejemplo:0412-4584558"
                              label="Teléfono *"
                              lazy-rules
                              :rules="[ val => val && val.length > 11 || 'Por favor introduzca un número de teléfono válido' ]"
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
      client:{
        name:'',
        last_name:'',
        ci:'',
        phone:'',
        email:''
      }
    }
  },
  computed:{
    ...mapState('clients',['clients']),
  },
  created() {
    if(this.$route.params.id) {
      this.getClient()
    }
  },
  methods: {
    ...mapActions('clients',['addClient','updateClient']),
    
    getClient(){
      let _id = this.$route.params.id
      this.$axios.get('/persons/'+_id)
      .then(res=>{
        this.client = res.data
      })
      //this.client = this.clients.find(item=>item.id === _id)
    },
    submit() {
      let _id = this.$route.params.id
      if(_id){
        this.$axios.put('/persons/'+_id,this.client)
        .then(()=>{
          this.updateClient(this.client)
          this.$q.notify({
            message: 'Cliente Actualizado con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/client/list')
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
        this.client.role = 'cliente'
        this.$axios.post('/persons',this.client)
        .then(()=>{
          this.addClient(this.client)
          this.$q.notify({
            message: 'Cliente añadido con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/client/list')
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