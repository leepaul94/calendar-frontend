// ecargado de actulizar y mantener el modal
import React, { useEffect, useState } from 'react';

import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/events';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {

    const dispatch = useDispatch();
    const { modalOpen } = useSelector(state => state.ui);
    const {activeEvent} = useSelector(state => state.calendar);

    const [dateStart, setDateStart] = useState( now.toDate() );
    const [dateEnd, setDateEnd] = useState( nowPlus1.toDate() );
    const [titleValid, setTitleValid] = useState(true);
    const [formValues, setFormValues] = useState( initEvent )

    const { title, notes, start, end } = formValues;

    // Necesito un efecto porque cuando selecciono con dobleclick quiero que me aparezca la info de ese evento por defecto. 
    // Entonces necesito un efecto que este pendiente de los cambios de mi activeEvent porque cuando los selecciono o doble clickeo, se activa.
    useEffect(() => { // que se dispare esta accion cada vez que cambie el activeEvent
        if( activeEvent ){ // si esta activo el evento
            setFormValues( activeEvent ); // me setea el formValues segun los valores del activeEvent que en el codigo de arriba me lo va a desestructurar y usar en el html
        } else {
            setFormValues( initEvent ); // me lo setea a los valores iniciales luego de eliminar el evento para que no me aparezcan esos valores cuando quiero crear un nuevo evento, para que asi me aparezcan en blanco
        }
    }, [ activeEvent, setFormValues ])

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues, // copio todos los valores
            [target.name]: target.value // entre corchetes porque quiero computar el nombre de la propiedad
        });
    }

    const closeModal = () => { // para que se cierre el modal
        dispatch( uiCloseModal() );
        dispatch( eventClearActiveEvent() ); // al salirme del evento, que el activeEvent se vuelva null
        setFormValues( initEvent ); // reinicializa los valores del formulario porque me quedan el del ultimo que haya seleccionado
    }

    const handleStartDateChange = (e) => {
        setDateStart( e ); // actualizar la fecha cuando el usuario lo haga
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleEndDateChange = (e) => {
        setDateEnd( e );
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const momentStart = moment( start );
        const momentEnd = moment( end );

        if( momentStart.isSameOrAfter( momentEnd ) ) { // metodo de moment
            return Swal.fire('Error', 'La fecha final debe de ser mayor a la fecha de inicio', 'error');
        }

        if( title.trim().length < 2 ) {
            return setTitleValid(false);
        }

        if ( activeEvent ) { // si ya esta creado, va a ser true. caso contrario null es decir false
            dispatch( eventStartUpdate( formValues ) ); // aca se esta actualizando uno ya creado
        } else {
            dispatch( eventStartAddNew(formValues) );
        }
        
        setTitleValid(true);
        closeModal();

    }
   
    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={ 200 }
            className="modal"
            overlayClassName="modal-fondo"
        >

            <h1> { (activeEvent) ? 'Edit Event' : 'New Event' } </h1>
            <hr />
            <form 
                className="container"
                onSubmit={ handleSubmit }
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={ handleStartDateChange }
                        value={dateStart}
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={ handleEndDateChange }
                        value={dateEnd}
                        minDate={ dateStart }
                        className="form-control"
                        format="y-MM-dd h:mm:ss a"
                        amPmAriaLabel="Select AM/PM"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={ `form-control ${ !titleValid && 'is-invalid' }` }
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={ title }
                        onChange={ handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ notes }
                        onChange={ handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>

        </Modal>
    )
}
