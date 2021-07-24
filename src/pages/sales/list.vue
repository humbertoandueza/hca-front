<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Reporte de Ventas
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :data="sales"
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
          </template>
          
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="flex justify-around ">
                <q-btn round v-if="props.row.status == 1 || props.row.status  == 3" size="sm" @click="show_pays_modal(props.row)" color="teal" icon="attach_money" />
                <q-btn round size="sm" @click="show(props.row.id)" color="teal" icon="visibility" />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status == 2 || props.row.status  == 3 ? 'green':'red'">
                {{ props.row.status  == 2 || props.row.status  == 3 ? 'Pagada' : 'Pendiente' }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="show_products"
      full-width
      full-height
    >
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Listado de productos</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-table
                :data="products"
                :columns="columns_products"
                row-key="_id"
                :filter="filter_p"
                :pagination="initialPagination"
                no-data-label="No hay resultados"
                no-results-label="No hay resultados"
                rows-per-page-label="registros por página"
                :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
                >
                <template v-slot:top>
                    <q-input borderless dense outlined debounce="300" v-model="filter_p" placeholder="Buscar">
                        <template v-slot:append>
                            <q-icon name="search"/>
                        </template>
                    </q-input>
                </template>
            </q-table>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="show_pays"
      full-width
      full-height
    >
      <q-card>
        <q-card-section class="q-pt-auto">
          <div class="row q-py-lg">
            <div class="col-12 q-pb-lg">
              <div class="text-h5 text-center">Abonar</div>
            </div>
            <div class="col-4">
              <div class="text-h6 ">Cliente: {{pay.client.name}} {{pay.client.last_name}}</div>
              <div class="flex justify-around">
                <div class="text-bold">Total: {{$formatMoney(pay.total)}}</div>
                <div class="text-bold">Abono: {{$formatMoney(pay.total-pay.deuda)}}</div>
                <div class="text-bold">Deuda: {{$formatMoney(pay.deuda)}}</div>
              </div>
            </div>
            
            <div class="col-8 flex justify-center items-center">
              <div class="row q-col-gutter-sm flex justify-center items-center" v-if="pay.status == 1">
                <div class="col-4" >
                  <q-field
                    dense outlined
                    v-model="pay.amount"
                    label="Monto" stack-label
                    @input="validateAmount"
                    lazy-rules
                    >
                    <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                        <money :id="id" class="q-field__input text-right" :value="value" @input="emitValue" v-bind="moneyFormatForComponent" v-show="floatingLabel" />
                    </template>
                  </q-field>
                </div>
                <div class="col-4">
                  <q-select
                      borderless
                      dense outlined
                      v-model="pay.currency"
                      use-input
                      label="Metodo de Pago" stack-label
                      hide-selected
                      fill-input
                      input-debounce="0"
                      :options="options_currency"
                    />
                </div>
                <div class="col-2" v-if="pay.currency != 'USD'">
                  <q-input
                  label="Referencia de Pago" stack-label
                  mask="####"
                  dense outlined
                  v-model.number="pay.reference"
                  />
                </div>
                <div class="col-2">
                  <q-btn type="submit" color="primary" :disable="pay.amount == 0" @click="savePay" :label="'Guardar'"/>
                </div>
              </div>
            </div>
            <div class="col-12 q-pt-lg">
              <q-separator color="primary"/>
            </div>
          </div>
          
          <div class="row q-pa-sm">
            <div class="col-12">
              <q-table
                title="Abonos realizados"
                :data="pays"
                :columns="columns_pay"
                row-key="_id"
                :filter="filter_pay"
                :pagination="initialPagination"
                no-data-label="No hay resultados"
                no-results-label="No hay resultados"
                rows-per-page-label="registros por página"
                :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
                >
                <template v-slot:top-right>
                    <q-input borderless dense outlined debounce="300" v-model="filter_pay" placeholder="Buscar">
                        <template v-slot:append>
                            <q-icon name="search"/>
                        </template>
                    </q-input>
                </template>
            </q-table>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { mapState , mapActions } from 'vuex'
import { columns , columns_pay , columns_products} from 'src/pages/sales/tables.js'
export default {
  name: "list-sales",
  data() {
    return {
      _id:null,
      show_products:false,
      show_pays:false,
      confirm:false,
      products:[],
      filter_pay:'',
      options_currency:['USD','BS','ZELLE','PAYPAL'],
      pay:{
        amount:0,
        sale_id:null,
        currency:'USD',
        reference:'',
        deuda:0,
        client:{
          name:'',
          last_name:'',
        },
        total:''
      },
      initialPagination: {
        sortBy: 'asc',
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      moneyFormatForComponent: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        precision: 2,
        masked: false
      },
      filter: '',
      filter_p: '',
      show_filter: true,
      columns,
      columns_pay,
      columns_products
      
    }
  },
  computed:{
    ...mapState('sales',['sales','pays'])
  },
  created(){
    this.getSales()
  },
  methods:{
    ...mapActions('sales',['setSales','setPays']),
    getSales(){
      this.$axios.get('/sales')
      .then(res=>{
        this.setSales(res.data)
      })
    },
    getPays(id){
      this.$axios.get('/pays?sale_id='+id)
      .then(res=>{
        if(res.data.length){
          this.pay.deuda = parseFloat(this.pay.total) - res.data.reduce((acum,item)=>{
            return acum + parseFloat(item.amount)
          },0.0) 
        }
        this.setPays(res.data)
      })
    },
    validateAmount(){
      if(this.pay.amount > this.pay.deuda){
        this.pay.amount = parseFloat(this.pay.deuda)
      }
    },
    savePay(){
      this.$axios.post('/pays',this.pay)
      .then(res=>{
        console.log(res.data)
        this.pay.status = res.data.status
        this.getPays(this.pay.sale_id)
        this.getSales()
        this.pay.amount = 0
        this.pay.currency  = 'USD'  
        this.pay.reference  = ''  
        this.$q.notify({
          message: 'Pago realizada con éxito.',
          caption: 'Felicitaciones',
          color: 'green'
        })

      })
    },
    show_pays_modal(sale) {
      let s = JSON.parse(JSON.stringify(sale))
      this.pay = {...this.pay,...s}
      this.pay.deuda = parseFloat(s.total)
      this.pay.sale_id = s.id
      this.pay.reference = ''
      this.getPays(s.id)
      this.show_pays = true;
    },
    show(_id){
      this.products = this.sales.find(item=>item.id == _id).products.map(item=>{
        return {
          ...item,
          ...item.product
        }
      })
      this.show_products = true
    }
  }
}
</script>