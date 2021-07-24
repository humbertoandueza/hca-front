<template>
  <div id="q-app">
    <q-dialog v-model="loading" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="col-12 text-center">
            <q-spinner-cube
              size="lg"
              color="primary"
            />
          </div>
          <div class="col-12 text-center q-mt-md">
            <span class="q-ml-sm text-bold">Cargando</span>
            <br>
            <span class="q-ml-sm text-bold" style="font-size:12px;">Por favor espere</span>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed:{ 
    loading() {
      return this.$store.state.loading
    }
  }
}
</script>
<style>
.q-stepper {
  box-shadow: none !important;;
}
</style>