import axios from "axios"

export const getProduct = async()=>{
    const res = await axios.get("/api/admin/product",)
    return res.items
}