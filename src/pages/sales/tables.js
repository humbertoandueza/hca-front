import moment from 'moment'
import { formatMoney } from '../../functions'
export const columns_pay = [
    {
      name: 'created_at',
      required: true,
      label: 'Fecha',
      align: 'left',
      field:row => moment(row.created_at).format('YYYY-MM-DD h:mm:ss a')
    },
    {
      name: 'amount',
      required: true,
      label: 'Monto',
      align: 'left',
      field:row=> formatMoney(row.amount)
    },
    {
      name: 'currency',
      required: true,
      label: 'Metodo de pago',
      align: 'center',
      field:'currency'
    },
    {
      name: 'reference',
      required: true,
      label: 'Referencia',
      align: 'left',
      field: row => `${row.reference}` 
    }
]
export const columns = [
    {
      name: '_id',
      required: true,
      label: 'Venta Nº',
      align: 'left',
      field:row => row.id.toString().padStart(4, 0)
    },
    {
      name: 'created_at',
      required: true,
      label: 'Fecha',
      align: 'left',
      field:row=> moment(row.created_at).format('YYYY-MM-DD h:mm:ss a'),
      sortable:true
    },
    {
      name: 'status',
      required: true,
      label: 'Estado',
      align: 'left',
      field:row=> `${row.status == 2 || row.status == 3 ? 'Pagada':'Pendiente'}`
    },
    {
      name: 'client',
      required: true,
      label: 'Cliente',
      align: 'left',
      field:row=> `(${row.client.ci}) ${row.client.name} ${row.client.last_name}`
    },
    {
      name: 'products',
      required: true,
      label: 'Cantidad de productos',
      align: 'center',
      field:row=> row.products.length
    },
    {
      name: 'total',
      required: true,
      label: 'Total',
      align: 'left',
      field: row => `${formatMoney(row.total)}` 
    },
    {
      name: 'id',
      required: true,
      label: 'Acciones',
      align: 'left',
      field:'id'
    }
]
export const columns_products = [
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
      field:val=> val.location.name
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
      name: 'quantity',
      required: true,
      label: 'Cantidad',
      align: 'left',
      field:'quantity'
    },
    {
      name: 'price_sale',
      required: true,
      label: 'Precio de Venta',
      align: 'left',
      field:'price',
      format: val => `${formatMoney(val)}`
    },
    {
      name: 'total',
      required: true,
      label: 'Total',
      align: 'left',
      field:row=> `${formatMoney(row.quantity*row.price)}`
    }
]