import axios from "axios";


export const getNotification = async () => {
    const res = await axios.get('/api/admin/notifications', {
        headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.ADMIN_SECRET || "admin545sdfsdfssad",
        },
    });

    if(!res){
        return {error: "No response from server"};
    }
    return res.data;
}

export const markAllRead = async () => {
    const res = await axios.post('/api/admin/notifications', {}, {
        headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.ADMIN_SECRET || "admin545sdfsdfssad",
        },
    });

    if(!res){
        return {error: "No response from server"};
    }
    return res.data;
}   

export const deleteFucntion = async (option, id) => {
    const res = await axios.delete('/api/admin/notifications', {
        headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.ADMIN_SECRET || "admin545sdfsdfssad",
        },
        data: { option, id }
    });

    if(!res){
        return {error: "No response from server"};
    }
    return res.data;
}