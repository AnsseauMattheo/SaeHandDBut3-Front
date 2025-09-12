import axios from 'axios';

export function Login(email, password) {
    axios.post("http://localhost:8080/api/auth/login", email, password)
    .then((response) => {
        console.log(response)
    })
}
