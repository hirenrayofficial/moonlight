import axios from "axios"






export const  AccesLogs =async ()=>{
    const res = await axios.get('/api/admin/dashboard/stats')
    // console.log(res.data)

    return res.data
}