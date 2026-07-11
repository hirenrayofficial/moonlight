import axios from "axios"

export const AddProduct = async(filedAcces)=> {
    const res = await axios.post("/api/admin/product",{
        rawPayload:filedAcces
    })
    if(!res){
        return
    }
    return res.data
    // console.log(filedAcce    s)

}
export const findProduct = async(filedAcces)=> {
    const res = await axios.get("/api/admin/product")
    if(!res){
        return
    }
    return res.data
    // console.log(filedAcce    s)

}