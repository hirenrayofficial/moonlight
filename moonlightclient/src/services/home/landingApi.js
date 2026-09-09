import axios from "axios";

export async function getLanding() {
    const res = await axios.get("/api/home/landing-dt")
    return res.data
}