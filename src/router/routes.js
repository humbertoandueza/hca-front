const routes = [
  {
    path: '/dashboard/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      /* {path: '', component: () => import('pages/Dashboard.vue')},
      {path: '/Dashboard2', component: () => import('pages/Dashboard2.vue')},
      {path: '/Profile', component: () => import('pages/UserProfile.vue')},
      {path: '/Map', component: () => import('pages/Map.vue')},
      {path: '/MapMarker', component: () => import('pages/MapMarker.vue')},
      {path: '/StreetView', component: () => import('pages/StreetView.vue')},
      {path: '/TreeTable', component: () => import('pages/TreeTable.vue')},
      {path: '/Charts', component: () => import('pages/Charts.vue')},
      {path: '/Cards', component: () => import('pages/Cards.vue')},
      {path: '/Tables', component: () => import('pages/Tables.vue')},
      {path: '/Contact', component: () => import('pages/Contact.vue')},
      {path: '/Checkout', component: () => import('pages/Checkout.vue')},
      {path: '/Calendar', component: () => import('pages/Calendar.vue')},
      {path: '/Pagination', component: () => import('pages/Pagination.vue')},
      {path: '/Taskboard', component: () => import('pages/TaskBoard.vue')},
      {path: '/Ecommerce', component: () => import('pages/ProductCatalogues.vue')}, */
      //products
      {
        path: '/product/create', 
        component: () => import('pages/products/create.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/product/list', 
        component: () => import('pages/products/list.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/product/edit/:id', 
        component: () => import('pages/products/create.vue'),
        meta: { Auth: true }
        
      },
      //stock
      {
        path: '/stock/list', 
        component: () => import('pages/stocks/list.vue'),
        meta: { Auth: true }
        
      },
      //clients
      {
        path: '/client/create', 
        component: () => import('pages/clients/create.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/client/list', 
        component: () => import('pages/clients/list.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/client/edit/:id', 
        component: () => import('pages/clients/create.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/client/vehicles', 
        component: () => import('pages/clients/vehicles.vue'),
        meta: { Auth: true }
        
      },
      //teams
      {
        path: '/team/create', 
        component: () => import('pages/teams/create.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/team/list', 
        component: () => import('pages/teams/list.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/team/edit/:id', 
        component: () => import('pages/teams/create.vue'),
        meta: { Auth: true }
        
      },
      //orders
      {
        path: '/order/create', 
        component: () => import('pages/orders/create.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/order/list', 
        component: () => import('pages/orders/list.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/order/orders', 
        component: () => import('pages/orders/orders.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/order/edit/:id', 
        component: () => import('pages/orders/create.vue'),
        meta: { Auth: true }
        
      },
      //providers
      {
        path: '/provider/create', 
        component: () => import('pages/providers/create.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/provider/list', 
        component: () => import('pages/providers/list.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/provider/edit/:id', 
        component: () => import('pages/providers/create.vue'),
        meta: { Auth: true }
        
      },
      //sales
      {
        path: '/sale/create', 
        component: () => import('pages/sales/create.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/sale/list', 
        component: () => import('pages/sales/list.vue'),
        meta: { Auth: true }
        
      },
      //buys
      {
        path: '/buy/create', 
        component: () => import('pages/buys/create.vue'),
        meta: { Auth: true }
        
      },
      {
        path: '/buy/list', 
        component: () => import('pages/buys/list.vue'),
        meta: { Auth: true }
        
      },

    ]
  },
  /* {
    path: '/Lock',
    component: () => import('pages/LockScreen.vue')
  },
  {
    path: '/Maintenance',
    component: () => import('pages/Maintenance.vue')
  },
  {
    path: '/Pricing',
    component: () => import('pages/Pricing.vue')
  }, */
  {
    path: '/',
    component: () => import('pages/Login-1.vue')
  },
  /* {
    path: '/Mail',
    component: () => import('layouts/Mail.vue')
  },
  {
    path: '/Lock-2',
    component: () => import('pages/LockScreen-2.vue')
  } */
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
