const baseUrl = process.env.REACT_APP_API_URL;

const fetchWithoutToken = ( endpoint, data, method = 'GET' ) => { // el endpoint que quiero llamar: /auth, /events. La data que quiero postear o enviar

    const url = `${ baseUrl }/${ endpoint }`; // localhost:4000/api/auth o events

    if( method === 'GET') { // si el metodo es igual a get
        return fetch( url );
    } else {
        return fetch( url, { // se configura el objeto
            method, // es el que recibo y no es 'GET'
            headers: { // Para mi backend estoy trabajando con el formato del content type application JSON, es decir, solo JSON va a recibir
                'Content-type': 'application/json'
            },
            body: JSON.stringify( data ) // se anexa el body como un JSON string
        });
    }

}

const fetchWithToken = ( endpoint, data, method = 'GET' ) => { // el endpoint que quiero llamar: /auth, /events. La data que quiero postear o enviar

    const url = `${ baseUrl }/${ endpoint }`; // localhost:4000/api/auth o events
    const token = localStorage.getItem('token') || ''; // obtengo el token del localstorage que guardo previamente al hacer login

    if( method === 'GET') { // si el metodo es igual a get
        return fetch( url, {
            method,
            headers: {
                'x-token': token
            }
        });
    } else { // el post con el token
        return fetch( url, { // se configura el objeto
            method, // es el que recibo y no es 'GET'
            headers: { // Para mi backend estoy trabajando con el formato del content type application JSON, es decir, solo JSON va a recibir
                'Content-type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify( data ) // se anexa el body como un JSON string
        });
    }


}


export {
    fetchWithoutToken,
    fetchWithToken
}