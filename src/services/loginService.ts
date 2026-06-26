import axios from "axios";
import { BASE_URL } from "../utils/constant";

interface LoginInterface{
    email: string,
    password: string
}

interface LoginResponse{
    token: string,
    user?: {
        id: string,
        name: string,
        email: string,
    }
}

export const loginService = async(userData:LoginInterface): Promise<LoginResponse> =>{
    const response = await axios.post<LoginResponse>(`${BASE_URL}/api/users/login`,userData,{
        headers:{
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}