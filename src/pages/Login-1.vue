<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img :src="require('src/assets/avatar.png')">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <span class="text-bold">HCA-APP</span>
              <div class="col text-h6 ellipsis">
                Iniciar Sesión 
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              @submit="login"
              ref="submit"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="user.email"
                label="Correo Electrónico"
                @keyup.enter.native="$refs.submit.submit()"
                :rules="[ val => !!val || 'Correo electrónico Electrónico invalido', isValidEmail]"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="user.password"
                @keyup.enter.native="$refs.submit.submit()"
                :rules="[val => val.length > 4 || 'Contraseña mínimo 5 carácteres']"
                label="Contraseña"
                lazy-rules

              />

              <div class="text-center">
                <q-btn label="Entrar" type="submit" color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    data() {
        return {
          user:{
            email: '',
            password: ''
          }
        }
    },
    methods:{
      isValidEmail (val) {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'Correo Electrónico Invalido';
      },
      login(){
        this.$store.commit('startLoading')
        this.$axios.post('/auth/login',this.user)
        .then(res=>{
          this.$store.commit('stopLoading')
          localStorage.setItem('token',res.data.access_token)
          localStorage.setItem('user',JSON.stringify(res.data.user))
          if(res.data.user.role == 'cliente') {
            this.$router.push('/client/vehicles')
          }
          if(res.data.user.role == 'admin'){
            this.$router.push('/product/list')
          }
          if(res.data.user.role == 'equipo'){
            this.$router.push('/order/list')
          }
        })
        .catch(err=>{
          this.$store.commit('stopLoading')
          console.log(err)
          this.$q.notify({
            message: 'Correo o contraseña incorrecto.',
            caption: '!Error¡',
            color: 'red'
          })
        })
        /* fetch('http://api.hcaguanare.com/api/auth/login', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.user),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error Fecth:', error);
        }); */
      },
    }
  }
</script>

<style>
  .bg-image {
   background-image: linear-gradient(135deg, #880808 0%, #330505 70%);
  }
</style>
