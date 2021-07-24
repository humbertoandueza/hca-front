import axios from '../../functions/axios'
import moment from 'moment'
export function getNotifications ({commit}) {
    axios.get('/notifications')
    .then(res=>{
        let messages = res.data.map(item=>{
            return {
                ...item,
                time : moment(item.created_at).format('h:mm:ss a'),
                date : moment(item.created_at).format('YYYY-MM-DD'),

            }
        })
        commit('setNotifications',messages)
    })
}


