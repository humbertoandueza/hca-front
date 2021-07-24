<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          Hospital Clinico Automotriz
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn>
          <messages></messages>
         
          <q-btn round flat>
            <q-avatar size="26px">
              <img :src="require('src/assets/avatar.png')">
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-secondary "
    >
      <q-list>

        <q-item v-if="can(['admin'])" to="/product/list" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="filter_alt"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Productos (F1)</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can(['admin'])" to="/stock/list" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="fact_check"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Stock (F2)</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can(['admin'])" to="/client/list" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="face"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Clientes (F3)</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can(['cliente'])" to="/client/vehicles" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="directions_car_filled"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Vehiculos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can(['cliente'])" to="/order/orders" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="directions_car_filled"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Ordernes de servicio</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can(['admin'])" to="/team/list" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="groups"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Equipos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can(['admin','equipo'])" to="/order/list" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="directions_car_filled"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Ordenes de servicio</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item v-if="can(['admin'])" to="/provider/list" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="people_alt"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Proveedores (F4)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="can(['admin'])" to="/sale/create" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="shopping_cart"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Ventas (F5)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="can(['admin'])" to="/sale/list" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="list"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Reporte de Ventas (F6)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="can(['admin'])" to="/buy/create" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="inventory"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Compras (F7)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="can(['admin'])" to="/buy/list" exact exact-active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="list"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Reporte de Compras (F8)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="confirm=true" exact exact-active-class="cursor-pointer q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="logout"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Cerrar Sesión</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view/>
    </q-page-container>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="logout" color="primary" text-color="white" />
          <span class="q-ml-sm">¿Esta seguro de cerrar sesión?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red" v-close-popup />
          <q-btn flat label="Confirmar" color="primary" @click="logout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import Messages from "./Messages";

export default {
  name: 'MainLayout',
  components: {
    Messages
  },
  data() {
    return {
      confirm:false,
      leftDrawerOpen: false,
    }
  },
  created() {
    const component = this;
    this.handler =  (e)=> {
      if(e.key === 'F1'){
        this.$router.push('/product/list')
      }
      if(e.key === 'F2'){
        this.$router.push('/stock/list')
      }
      if(e.key === 'F3'){
        this.$router.push('/client/list')
      }
      if(e.key === 'F4'){
        this.$router.push('/provider/list')
      }
      if(e.key === 'F5'){
        this.$router.push('/sale/create')
      }
      if(e.key === 'F6'){
        this.$router.push('/sale/list')
      }
      if(e.key === 'F7'){
        this.$router.push('/buy/create')
      }
      if(e.key === 'F8'){
        this.$router.push('/buy/list')
      }
    }
    this.prevent = (e) => {
      var functionKeys = new Array(112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 123);
      if (functionKeys.indexOf(e.keyCode) > -1 || functionKeys.indexOf(e.which) > -1) {
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', this.prevent);
    window.addEventListener('keyup', this.handler);
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.handler);
  },
  created(){
    this.$store.dispatch('setRole')
  },
  methods:{
    logout(){
      localStorage.clear()
      this.$router.go()
    },
    can(roles){
      return this.$store.getters.can(roles)
    }
  }
}
</script>
