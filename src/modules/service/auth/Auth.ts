import Axios from "@/utils/axios/Axios";

export const AuthLogin = async (payload: { email: string; password: string })  =>{
    const response = await Axios.post('/login', payload);
    return response.data ?? {};
}