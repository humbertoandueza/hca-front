<template>
    <q-page class="q-pa-sm">
        <div class="row q-col-gutter-lg">
            <div class="col-12">
              <q-card class="my-card">
                <q-card-section>
                  <div class="text-center">
                    <h4>Registrar Proveedor</h4>
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
                              v-model="provider.ci"
                              label="Rif o CI *"
                              mask="###########"
                              lazy-rules
                              :rules="[ val => val && val.length >= 8 || 'Por favor introduzca un Rif o CI']"
                          />
                        </div>
                        <div class="col-4">
                          <q-input
                              dense outlined
                              v-model="provider.name"
                              label="Nombre *"
                              lazy-rules
                              :rules="[ val => val && val.length > 2 || 'Por favor introduzca un nombre']"
                          />
                        </div>
                        <div class="col-4">
                          <q-input
                              dense outlined
                              v-model="provider.last_name"
                              label="Apellido"
                              lazy-rules
                              :rules="[val => val && val.length > 0 || 'Por favor introduzca un apellido']"
                          />
                        </div>
                        <div class="col-6">
                          <q-input
                              dense outlined
                              type="email"
                              v-model="provider.email"
                              label="Correo Electrónico *"
                              lazy-rules
                              :rules="[ val => !!val || 'Correo electrónico Electrónico invalido', isValidEmail ]"
                          />
                        </div>
                        <div class="col-6">
                          <q-input
                              dense outlined
                              v-model="provider.phone"
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
      provider:{
        name:'',
        last_name:'',
        ci:'',
        phone:'',
        email:''
      }
    }
  },
  computed:{
    ...mapState('providers',['providers']),
  },
  created() {
    if(this.$route.params.id) {
      this.getProvider()
    }
  },
  methods: {
    ...mapActions('providers',['addProvider','updateProvider']),
    
    getProvider(){
      let _id = this.$route.params.id
      this.$axios.get('/persons/'+_id)
      .then(res=>{
        this.client = res.data
      })
      /* let _id = this.$route.params.id
      this.provider = JSON.parse(JSON.stringify(this.providers.find(item=>item._id == _id))) */
    },
    submit() {
      let _id = this.$route.params.id
      if(_id){
        this.$axios.put('/persons/'+_id,this.provider)
        .then(()=>{
          this.updateProvider(this.provider)
          this.$q.notify({
            message: 'Proveedor Actualizado con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/provider/list')
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
        this.provider.role = 'provider'
        this.$axios.post('/persons',this.provider)
        .then(()=>{
          this.addProvider(this.provider)
          this.$q.notify({
            message: 'Proveedor añadido con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/provider/list')
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