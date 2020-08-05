const axios = require('axios');

const API_URL = 'http://localhost:3000'


function getCredentials() {
    let credentials = {
        "login" :"BankinUser",
        "password" : "12345678",
        "clientId" :"BankinClientId",
        "clientSecret": "secret"
    }
        axios.post(API_URL + '/login', {user :  credentials.login, password : credentials.password}, {
            auth: {
                username : credentials.clientId,
                password: credentials.clientSecret
              }
        }).then((res) => {
            let token  = setToken(res.data.refresh_token);
            console.log(token)
            return token
        })
        .catch((error) => {
            console.log(error);
        })
}

function setToken(ref_token) {
    var apiToken = null;
    axios.post(API_URL + '/token', {
        grant_type: "refresh_token",
        refresh_token : ref_token
    }) .then((data) => {
        this.apiToken = data.data.access_token;
    }).catch ((error) => {
        console.log(error)
    })
    return apiToken;
}

function getAccounts(apiToken) {
    axios.get(API_URL + '/accounts', {   
         headers: { Authorization: 'Bearer ' + apiToken }
}) .then((data) => {
        let accounts = data.data
        accounts.forEach(function (item){
            item.transaction = getTransaction(item.id)
        })
        return accounts;
    }).catch ((error) => {
        console.log(error.toJSON())
    })
}

function getTransaction(account) {
    axios.get(API_URL + '/' + account + '/transactions', {   
        headers: { Authorization: 'Bearer ' + apiToken }
}) .then((data) => {
       return data.data.access_token
   }).catch ((error) => {
       console.log(error.toJSON())
   })

}

let toke = getCredentials();
getAccounts(toke);
