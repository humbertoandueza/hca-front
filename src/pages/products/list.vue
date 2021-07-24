<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Listado de productos
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :data="products"
          :columns="columns"
          row-key="code"
          :loading="loading"
          :filter="filter"
          :visible-columns="visibleColumns"
          :pagination.sync="pagination"
          @request="onRequest"
          no-data-label="No hay resultados"
          no-results-label="No hay resultados"
          rows-per-page-label="registros por página"
          :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber)=>`${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
        >
        <template v-slot:top="props">
          <q-space />

          <div v-if="$q.screen.gt.xs" class="col">
            <q-toggle v-model="visibleColumns" :checked="false" val="type_unit" label="Kit/Unidades/Juegos" />
            <q-toggle v-model="visibleColumns" :checked="false" val="brand" label="Marca" />
            <q-toggle v-model="visibleColumns" :checked="false" val="type_vehicle" label="Tipo de carro" />
          </div>
          <q-select
            v-else
            v-model="visibleColumns"
            multiple
            borderless
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            style="min-width: 150px"
          />

          
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
          <q-btn round size="sm" class="q-ma-sm" @click="$router.push(`/product/create`)" color="primary" icon="add" />
          <q-btn round size="sm" class="q-ma-sm" @click="$refs.file.click()" color="primary" icon="note_add" />
          <input ref="file" type="file" @change="readExcel" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
        </template>
          
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="flex justify-around ">
                <q-btn round size="sm" @click="show(props.row.code)" color="teal" icon="visibility" />
                <q-btn round size="sm" @click="$router.push(`/product/edit/${props.row.code}`)" color="info" icon="edit" />
                <q-btn round size="sm" @click="confirm_delete(props.row.code)" color="red" icon="delete" />

              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <span class="truncate">{{props.value}} </span>
              <q-tooltip >{{props.value}}</q-tooltip>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="show_product"
      full-width
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Producto: {{product.name}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-lg flex justify-around">
            <div class="col-4">
              <p class="text-bold">Código:{{product.code}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Nombre:{{product.name}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Kit/Unidades/Juegos:{{product.type_unit}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Marca:{{product.brand}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Serial:{{product.serial}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Tipo de carro:{{product.type_vehicle}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Ubicación:{{product.location.name}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Precio de costo:{{$formatMoney(product.price_cost)}}</p>
            </div>
            <div class="col-4">
              <p class="text-bold">Cantidad de productos iniciales:{{product.quantity_initial}}</p>
            </div>
             <div class="col-4">
              <p class="text-bold">Precio de venta:{{$formatMoney(product.price_sale)}}</p>
            </div>
            <div class="col-12">
              <p class="text-bold">Descripción:{{product.description}}</p>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="filter_alt" color="primary" text-color="white" />
          <span class="q-ml-sm">¿Esta seguro de eliminar el registro?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red" v-close-popup />
          <q-btn flat label="Confirmar" color="primary" @click="remove" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm_loading" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="col-12 text-center">
            <q-spinner-cube
              size="lg"
              color="primary"
            />
          </div>
          <div class="col-12 text-center q-mt-md">
            <span class="q-ml-sm text-bold">Cargando Archivo...</span>
            <br>
            <span class="q-ml-sm text-bold" style="font-size:12px;">Esta operación puede tardar varios minutos</span>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { mapState , mapActions } from 'vuex'
import XLSX from 'xlsx'
export default {
  name: "list-products",
  data() {
    return {
      loading:false,
      confirm_loading:false,
      visibleColumns:[],
      code:null,
      show_product:false,
      confirm:false,
      excel:[],
      product:{
        code:'',
        name:'',
        description:'',
        type_unit:'kit',
        brand:'',
        serial:'',
        type_vehicle:'',
        location:'',
        price_cost:0,
        price_sale:0,
        quantity_initial:0,
        quantity_entry:0,
        quantity_output:0,
        quantity_stock:0
      },
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 10
      },
      filter: '',
      show_filter: true,
      columns: [
        {
          name: 'code',
          required: true,
          label: 'Código',
          align: 'left',
          field:'code'
        },
        {
          name: 'name',
          required: true,
          label: 'Producto',
          align: 'left',
          field:'name'
        },
        {
          name: 'serial',
          required: true,
          label: 'Serial',
          align: 'left',
          field:'serial'
        },
        {
          name: 'type_unit',
          label: 'Kit/Unidades/Juegos/',
          align: 'center',
          field:'type_unit'
        },
        {
          name: 'location',
          required: true,
          label: 'Ubicación',
          align: 'center',
          field:val=>val.location.name
        },
        {
          name: 'brand',
          label: 'Marca',
          align: 'left',
          field:'brand'
        },
        {
          name: 'type_vehicle',
          label: 'Tipo de Carro',
          align: 'center',
          field:'type_vehicle'
        },
        {
          name: 'price_cost',
          required: true,
          label: 'Precio de costo',
          align: 'left',
          field:'price_cost',
          format: val => this.$formatMoney(val)
        },
        {
          name: 'price_sale_20',
          required: true,
          label: 'Precio de Venta(20%)',
          align: 'left',
          field:'price_sale_20',
          format: val => this.$formatMoney(val)
        },
        {
          name: 'price_sale_30',
          required: true,
          label: 'Precio de Venta(30%)',
          align: 'left',
          field:'price_sale_30',
          format: val => this.$formatMoney(val)
        },
        {
          name: 'price_sale_40',
          required: true,
          label: 'Precio de Venta(40%)',
          align: 'left',
          field:'price_sale_40',
          format: val => this.$formatMoney(val)
        },
        {
          name: 'price_sale_50',
          required: true,
          label: 'Precio de Venta(50%)',
          align: 'left',
          field:'price_sale_50',
          format: val => this.$formatMoney(val)
        },
        {
          name: 'id',
          required: true,
          label: 'Acciones',
          align: 'left',
          field:'_id'
        }
      ]
    }
  },
  computed:{
    ...mapState('products',['products'])
  },
  created(){
    /* this.getProducts() */
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },
  methods:{
    ...mapActions('products',['removeProduct','setProducts']),
    onRequest(props){
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.getProducts(page,rowsPerPage,filter)
    },
    readExcel () {
     /*  this.confirm_loading = true */      
      let reader = new FileReader();
        let file = this.$refs.file.files[0]
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            let data = e.target.result;
            let workbook = XLSX.read(data, {type: 'binary'});
            console.log(workbook.SheetNames[0])
            let first_sheet_name = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[first_sheet_name];
            let jsonObj = XLSX.utils.sheet_to_json(worksheet);
            let map = jsonObj.map(item=>{
                return {
                    code:item['__EMPTY_1'] || 'S/C',
                    name:item['__EMPTY_3'] || 'S/D',
                    description:item['__EMPTY_3'] || 'S/D',
                    type_unit:item['__EMPTY_4'] || 'UNIDAD',
                    brand:item['__EMPTY_5'] || 'S/M',
                    serial:item['__EMPTY_6'] || 'S/S',
                    type_vehicle:item['__EMPTY_7'] || 'Todos',
                    location:item['__EMPTY_10'] || 'Desconocida',
                    price_cost:parseFloat(item['__EMPTY_11']) || 1,
                    quantity_initial:parseInt(item['__EMPTY']) || 1,
                }
            })
            map.splice(0,1)
            this.excel = map
            this.postExcel(0,1)
        }
    },
    postExcel(index_r,count= 0){
      let products = this.excel.filter((item,index)=>index>=index_r && index<=index_r+199)
      this.$axios.post('/products/excel',{products})
      .then(()=>{
        if(this.excel.length >= index_r+199 ){
          this.postExcel(index_r+199,count+1)
        }else{
          this.confirm_loading = false
          this.onRequest({
            pagination:this.pagination,
            filter:undefined
          })
          this.$q.notify({
            message: 'Productos añadido con éxito.',
            caption: 'Felicitaciones',
            color: 'primary'
          })
        }
      })
      .catch(err=>{
        this.$q.notify({
          message: 'Ocurrio un error al leer el archivo.',
          caption: 'Error',
          color: 'red'
        })
        console.log(err)
      })
    },
    getProducts(page,per_page,filter){
      let query = filter ? filter : '';
      this.loading = true
      this.$axios.get('/products?page='+page+'&per_page='+per_page+'&filter='+query)
      .then(res=>{
        
        this.pagination.rowsNumber = res.data.total
        
        this.loading = false
        res.data = res.data.data.map(item=>{
          const cal = (val,porcent) => {
            let cal = parseFloat(val) * (porcent/100)
            return cal + parseFloat(val)
          }
          return {
            ...item,
            price_sale_20:cal(item.price_cost,20),
            price_sale_30:cal(item.price_cost,30),
            price_sale_40:cal(item.price_cost,40),
            price_sale_50:cal(item.price_cost,50),
          }
        })
        this.setProducts(res.data)
      })
      .catch(err=>{
        this.loading = false
        console.log(err)
        this.$q.notify({
          message: 'Ocurrio un error al obtener los productos',
          caption: '¡Error!',
          color: 'red'
        })
      })
    },
    remove(){
      let product = this.products.find(item=>item.code == this.code)
      this.$axios.delete('/products/'+product.id)
      .then(()=>{
        this.removeProduct(this.code)
        this.$q.notify({
          message: 'Producto removido con éxito.',
          caption: 'Felicitaciones',
          color: 'primary'
        })
        this.code = null
        this.confirm = false
        this.getProducts()
      })
    },
    confirm_delete(code){
      this.confirm = true 
      this.code = code
    },
    show(code){
      this.product = this.products.find(item=>item.code == code)
      this.show_product = true
    }
  }
}
</script>