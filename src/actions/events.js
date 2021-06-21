import Swal from "sweetalert2";
import { fetchWithToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

export const eventStartAddNew = ( event ) => {
    return async( dispatch, getState ) => {

        const { uid, name } = getState().auth;

        try {
            const resp = await fetchWithToken('events', event, 'POST');
            const body = await resp.json();

            if( body.ok ) { // si es true, quiere decir que se inserto en la base de datos
                event.id = body.event.id;
                event.user = {
                    _id: uid,
                    name
                }
                dispatch( eventAddNew( event ) );
            }

        } catch (error) {
            console.log(error);
        }
    }
}

// Solo lo disparo unicamente si efectivamente lo grabo en la base de datos
const eventAddNew = ( event ) => ({
    type: types.eventAddNew,
    payload: event
})

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event
})

export const eventClearActiveEvent = () => ({
    type: types.eventClearActiveEvent
})

export const eventStartUpdate = ( event ) => {
    return async( dispatch ) => {

        try {
            
            const resp = await fetchWithToken(`events/${ event.id }`, event, 'PUT'); // 1ero la peticion al url, luego la data que quiero guardar y tercero el metodo
            const body = await resp.json();

            if ( body.ok ) {
                dispatch( eventUpdated( event ) );
            } else { 
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {
            console.log(error);
        }
    }
}

const eventUpdated = ( event ) => ({
    type: types.eventUpdate,
    payload: event
})

export const eventStartDelete = () => {
    return async( dispatch, getState ) => {

        const { id } = getState().calendar.activeEvent;
        try {
            
            const resp = await fetchWithToken(`events/${ id }`, {}, 'DELETE'); // 1ero la peticion al url, luego la data que quiero guardar y tercero el metodo
            const body = await resp.json();

            if ( body.ok ) {
                dispatch( eventDeleted() );
            } else { 
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {
            console.log(error);
        }

    }
}

const eventDeleted = () => ({
    type: types.eventDeleted
})

export const eventStartLoading = () => {
    return async( dispatch ) => {

        try {
            const resp = await fetchWithToken('events');
            const body = await resp.json();

            const events = prepareEvents( body.events ); // aca transformo las fechas de mis eventos

            dispatch( eventLoaded( events) );

        } catch (error) {
            console.log(error)
        }
    }
}

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
})

export const eventLogout = () => ({
    type: types.eventLogout
})