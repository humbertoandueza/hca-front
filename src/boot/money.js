import money from 'v-money'
export default async ({ Vue }) => {
    Vue.use(money, {precision: 2})
}