import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3000',
})

// LOGIN: http://localhost:3000/auth/login -> POST -> {user, password}
export const login = async (credenciales) => {
    const response = await instance.post('auth/login', credenciales, {
        headers:{
            'Content-Type': 'Aplication/json'
        }
    });
    console.log(response);
    return response.data;
}

//COMANDO: http://localHost:3000/GoDisk/commands -> POST -> {Comandos}
export const commands = async (comandos) => {
    const response = await instance.post('GoDisk/commands', comandos, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(response)
    return response.data
}