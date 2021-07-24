<template>
  <div>
    <q-btn round dense flat color="white" icon="notifications">
    <q-badge color="red" text-color="white" floating v-if="noRead">
        {{noRead}}
    </q-badge>
    <q-menu
    >
        <q-list style="min-width: 100px">
            <q-item @click="read(msg)" style="max-width: 420px" v-for="msg in notifications" :key="msg.id" clickable v-ripple>
                <q-item-section>
                    <q-item-label :style="msg.status == 1 ? 'color:red;':'color:green'">{{ msg.title }}</q-item-label>
                    <q-item-label caption lines="1">{{ msg.description }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    {{msg.time}}
                    <p style="font-size:10px;font-weigth:bold;margin:0px;">{{msg.date}}</p>
                </q-item-section>
            </q-item>
            <q-item v-if="!notifications.length">
                <q-item-section class="text-center">
                    <q-item-label>No hay notificaciones</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-menu>
    </q-btn>
    <q-dialog v-model="dialog"  transition-show="flip-down" transition-hide="flip-up">
      <q-card>
        <q-bar>
          <div>{{message.time}}</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">{{message.title}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{message.description}}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex' 
    export default {
        name: "Messages",
        data (){
            return {
                dialog:false,
                position:'center',
                message:{
                    title:'',
                    description:'',
                    time:''
                }
            }
        },
        created(){
            this.getNotifications()
        },
        computed:{
            ...mapState('notifications',['notifications']),
            noRead(){
                return this.notifications.filter(item=>item.status == 1).length
            }
        },
        methods:{
            ...mapActions('notifications',['getNotifications']),
            read(message){
                this.message = message
                this.message.status = 2
                this.dialog = true
                this.$axios.put('/notifications/'+message.id)
                .then(()=>{
                    this.getNotifications()
                })
            }
        }
    }
</script>

<style scoped>

</style>
