import Swal from "sweetalert2";
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch"
import { types } from "../types/types";
import { eventLogout } from "./events";



export const startLogin = ( email, password ) => {
    return async(dispatch) => {

        const resp = await fetchWithoutToken( 'auth', { email, password }, 'POST');
        const body = await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() ); // para saber cual es la fecha en la que se creo el token y se que tengo dos hs para que funcione. Grabo la fecha, minuto y hora y seg en la que se creo el token y voy a saber cuanto tiempo me falta para que el token expire

            dispatch( login({
                uid: body.uid,
                name: body.name
            }) )
        } else { // muestro un mensaje de error
            Swal.fire('Error', body.msg, 'error');
        }

    }
}

export const startRegister = ( email, password, name ) => {
    return async( dispatch ) => {
        const resp = await fetchWithoutToken( 'auth/new', { email, password, name }, 'POST');
        const body = await resp.json(); // se extrae el body

        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() ); // para saber cual es la fecha en la que se creo el token y se que tengo dos hs para que funcione. Grabo la fecha, minuto y hora y seg en la que se creo el token y voy a saber cuanto tiempo me falta para que el token expire

            dispatch( login({
                uid: body.uid,
                name: body.name
            }) )
        } else { // muestro un mensaje de error
            Swal.fire('Error', body.msg, 'error');
        }
    }
}

export const startChecking = () => {
    return async( dispatch ) => {
        const resp = await fetchWithToken( 'auth/renew' );
        const body = await resp.json(); // se extrae el body

        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() ); // para saber cual es la fecha en la que se creo el token y se que tengo dos hs para que funcione. Grabo la fecha, minuto y hora y seg en la que se creo el token y voy a saber cuanto tiempo me falta para que el token expire

            dispatch( login({
                uid: body.uid,
                name: body.name
            }) )
        } else { // si el token no es correcto, cancelo el checking
            dispatch( checkingFinish() );
        }
    }
}

const checkingFinish = () => ({
    type: types.authCheckingFinish
})

const login = ( user ) => ({
    type: types.authLogin,
    payload: user
})

export const startLogout = () => {
    return ( dispatch ) => {

        localStorage.clear(); // esto borra todo del localStorage
        dispatch( eventLogout() );
        dispatch( logout() );
    }
}

const logout = () => ({
    type: types.authLogout
})