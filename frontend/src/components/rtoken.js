import Axios from 'axios';

var RefreshedToken = function(refresh){
    return Axios.post(`http://127.0.0.1:8000/api/token/refresh/`, {
            refresh: refresh,
    })
    //save the refreshed token
    .then(response => response)
    .catch(error => console.log(error))
}

export default RefreshedToken;