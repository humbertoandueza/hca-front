<template>
    <q-page class="q-pa-sm">
        <div class="row q-col-gutter-lg">
            <div class="col-12">
              <q-card class="my-card">
                <q-card-section>
                  <div class="text-center">
                    <h4>Registrar Producto</h4>
                  </div>
                    <q-stepper
                    v-model="step"
                    ref="stepper"
                    alternative-labels
                    color="primary"
                    animated
                    >
                      <q-step
                          :name="1"
                          title="Datos"
                          icon="settings"
                          :done="step > 1"
                      >
                        <q-form
                          ref="form1"
                          @submit="onSubmit"
                          class="q-gutter-md"
                          >
                          <div class="row q-col-gutter-lg">
                            <div class="col-6">
                              <q-input
                                  dense outlined
                                  v-model="product.code"
                                  label="Código *"
                                  mask="A-####"
                                  hint="Ejemplo: A-1545"
                                  lazy-rules
                                  @input="validateCode"
                                  :rules="[ val => val && val.length > 5 || 'Por favor introduzca un código']"
                              />
                            </div>
                            <div class="col-6">
                              <q-input
                                  dense outlined
                                  v-model="product.name"
                                  label="Nombre del producto"
                                  lazy-rules
                                  :rules="[val => val && val.length > 0 || 'Por favor introduzca un nombre']"
                              />
                            </div>
                            <div class="col-6">
                              <q-input
                                  dense outlined
                                  v-model="product.description"
                                  label="Descripción del producto *"
                                  lazy-rules
                                  :rules="[ val => val && val.length > 0 || 'Por favor introduzca una descripción']"
                              />
                            </div>
                            <div class="col-6">
                              <div class="q-gutter-sm">
                                <q-radio v-model="product.type_unit" val="KIT" label="KIT" />
                                <q-radio v-model="product.type_unit" val="JUEGOS" label="JUEGOS" />
                                <q-radio v-model="product.type_unit" val="UNIDAD" label="UNIDADES " />
                              </div>
                            </div>
                          </div>
                          <div class="col-12 text-center" v-if="exist">
                            <p class="text-red">Ya se encuentra registrado un producto con el mismo código</p>
                          </div>
                        </q-form>
                      </q-step>

                      <q-step
                          :name="2"
                          title="Caracteristicas"
                          icon="create_new_folder"
                          :done="step > 2"
                      >
                        <q-form
                          ref="form2"
                          @submit="onSubmit"
                          class="q-gutter-md"
                          >
                          <div class="row q-col-gutter-lg">
                            <div class="col-6">
                              <q-input
                                  dense outlined
                                  v-model="product.brand"
                                  label="Marca *"
                                  hint="Ejemplo: Mikalor"
                                  lazy-rules
                                  :rules="[ val => val && val.length > 0 || 'Por favor introduzca una marca']"
                              />
                            </div>
                            <div class="col-6">
                              <q-input
                                  dense outlined
                                  v-model="product.serial"
                                  label="Serial del producto"
                                  hint="Ejemplo: 76437646 o S/S"
                                  lazy-rules
                                  :rules="[ val => val && val.length > 0 || 'Por favor introduzca un serial']"
                              />
                            </div>
                            <div class="col-6">
                              <q-input
                                  dense outlined
                                  v-model="product.type_vehicle"
                                  label="Tipo de carro *"
                                  hint="Ejemplo: Todos"
                                  lazy-rules
                                  :rules="[ val => val && val.length > 0 || 'Por favor introduzca una descripción']"
                              />
                            </div>
                            <div class="col-6">
                              <q-input
                                  dense outlined
                                  v-model.number="product.quantity_initial"
                                  label="Cantidad inicial *"
                                  hint="Ejemplo: 14"
                                  mask="#########"
                                  lazy-rules
                                  :rules="[ val => val && val > 0 || 'Por favor introduzca una cantidad']"
                              />
                            </div>
                          </div>
                        </q-form>
                      </q-step>

                      <q-step
                          :name="3"
                          title="Precio"
                          icon="add_comment"
                      >
                        <q-form
                          ref="form3"
                          @submit="submit"
                          class="q-gutter-md"
                          >
                          <div class="row q-col-gutter-lg">
                            <div class="col-6">
                              <q-field
                                dense outlined
                                v-model="product.price_cost"
                                label="Precio de costo"
                                lazy-rules
                                @input="priceSale"
                                :rules="[ val => val && val > 0 || 'Por favor introduzca un precio de costo']"
                              >
                                <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                  <money  :id="id" class="q-field__input text-right" :value="value" @input="emitValue" v-bind="moneyFormatForComponent" v-show="floatingLabel" />
                                </template>
                              </q-field>
                            </div>
                            <div class="col-6">
                              <q-field
                                dense outlined
                                v-model="product.price_sale"
                                label="Precio de Venta"
                                :hint="`El % de venta es del ${porcentaje}`"
                                lazy-rules
                                :rules="[ val => val && val > 0 || 'Por favor introduzca un precio de venta']"
                              >
                                <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                  <money :id="id" class="q-field__input text-right" :value="value" @input="emitValue" v-bind="moneyFormatForComponent" v-show="floatingLabel" />
                                </template>
                              </q-field>
                            </div>
                            <div class="col-5">
                              <q-select
                                dense outlined
                                v-model="location"
                                use-input
                                hide-selected
                                fill-input
                                @input="val => product.location_id = val.value"
                                input-debounce="0"
                                :options="options"
                                @filter="filterFn"
                                hint="Ubicación"
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
                                <template v-slot:option="scope">
                                  <q-item
                                    v-bind="scope.itemProps"
                                    v-on="scope.itemEvents"
                                  >
                                    <q-item-section>
                                      <div class="flex justify-between items-center">
                                        <q-item-label v-html="scope.opt.label" />
                                          <q-icon size="xs" @click="confirmRemoveShelve(scope.opt._id)" color="red" name="close" />
                                      </div>
                                    </q-item-section>
                                    
                                  </q-item>
                                </template>
                              </q-select>
                            </div>
                            <div class="col-1 flex text-center justify-center">
                              <q-toggle v-model="show_new"/>
                              <p style="font-size:10px;font-weight:bold; ">Añadir ubicación</p>
                            </div>
                            <div class="col-6">
                              <q-input
                                v-if="show_new"
                                dense outlined
                                v-model="new_location"
                                label="Nueva ubicación"
                                hint="Ejemplo: Estante 15"
                              >
                                <template v-slot:append>
                                  <q-btn round dense @click="addLocation" flat icon="add" />
                                </template>
                              </q-input>
                            </div>
                          </div>
                        </q-form>
                        
                      </q-step>

                      <template v-slot:navigation>
                        <div class="flex justify-end">
                          <q-stepper-navigation>
                          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Atrás" class="q-ml-sm" />
                          <q-btn @click="next" :disable="exist" color="primary" :label="step === 3 ? 'Guardar' : 'Continuar'" />
                          </q-stepper-navigation>
                        </div>
                      </template>
                  </q-stepper>
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
      show_new:false,
      new_location:'',
      exist:false,
      step: 1,
      location:'',
      product:{
        code:'',
        name:'',
        description:'',
        type_unit:'KIT',
        brand:'',
        serial:'',
        type_vehicle:'',
        location_id:'',
        price_cost:0,
        price_sale:0,
        quantity_initial:0,
        quantity_entry:0,
        quantity_output:0,
        quantity_stock:0
      },
      moneyFormatForComponent: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        precision: 2,
        masked: false
      },
      porcentaje:40,
      options:[],
    }
  },
  computed:{
    ...mapState('products',['products','shelves']),
  },
  created() {
    if(this.$route.params.id) {
      this.getProduct()
    }
    this.getLocations()
  },
  methods: {
    ...mapActions('products',['addProduct','updateProduct','addShelve','removeShelve','setShelves']),
    validateCode(val){
      if(val.length == 6) {
        this.$axios.get('/products/create?code='+val)
        .then(res=>{
          this.exist = res.data.exist
        })
      }
    },
    confirmRemoveShelve(_id){
      this.removeShelve(_id)
      .then(()=>{
        this.$q.notify({
          message: 'Estante removido con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this.product.location_id = ''
      })
    },
    getLocations(){
      this.$axios.get('/locations')
      .then(res=>{
        this.options = res.data.map(item=>{
          return {
            value:item.id,
            label:item.name
          }
        })
        if(this.$route.params.id){
          this.location = this.options.find(item=>item.value == this.product.location_id)
        }
        this.setShelves(this.options)
      })
    },
    getProduct(){
      let code = this.$route.params.id
      this.product = JSON.parse(JSON.stringify(this.products.find(item=>item.code == code)))
    },
    addLocation() {
      this.$axios.post('/locations',{name:this.new_location})
      .then(()=>{
        this.addShelve(this.new_location)
        this.$q.notify({
          message: 'Estante añadido con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this.show_new= false
        this.new_location = ''
        this.getLocations()
      })
    },
    priceSale(){
      let cal = this.product.price_cost * (this.porcentaje/100)
      this.product.price_sale = cal + this.product.price_cost
    },
    onSubmit () {
      this.$refs.stepper.next()
    },
    next() {
      if(this.step==1){
        this.$refs.form1.submit()     
      }
      else if(this.step == 2){
        this.$refs.form2.submit()     
      }
      else{
        this.$refs.form3.submit()
      }
    },
    submit() {
      if(this.$route.params.id){
        this.$axios.put('/products/'+this.product.id,this.product)
        .then(()=>{
          this.updateProduct(this.product)
          this.$q.notify({
            message: 'Producto Actualizado con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/product/list')
        })
        .catch(()=>{
          this.$q.notify({
            message: 'El producto no se ha podido actualizar.',
            caption: '¡Error!',
            color: 'red'
          })
        })
        
      }else{
        this.product.quantity_stock = this.product.quantity_initial
        this.$axios.post('/products',this.product)
        .then(()=>{
          let loc = this.options.find(item=>item.value == this.product.location_id)
          this.product.location = {id:loc.value,name:loc.label}
          this.addProduct(this.product)
          this.$q.notify({
            message: 'Producto añadido con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
          this.$router.push('/product/list')
        })
        .catch(()=>{
          this.$q.notify({
            message: 'El producto no se ha podido guardar.',
            caption: '¡Error!',
            color: 'red'
          })
        })
      }
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.shelves.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>