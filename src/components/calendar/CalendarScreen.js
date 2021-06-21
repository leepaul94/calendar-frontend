import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { NavBar } from '../ui/NavBar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

const localizer = momentLocalizer(moment); // or globalizeLocalizer


export const CalendarScreen = () => { 

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { uid } = useSelector(state => state.auth);

    const [ lastView, setLastView ] = useState( localStorage.getItem('lastView') || 'month'); // cuando cambie, se vaya actualizando

    useEffect(() => { // se cargan los eventos de la base de datos
        
        dispatch( eventStartLoading() );
        
    }, [dispatch]);

    const onDoubleClick = (e) => { // cuando alguien haga doble click aparezca un modal
        dispatch( uiOpenModal() );
    }

    const onSelectEvent = (e) => { // cuando se selecciona
        dispatch( eventSetActive(e) );
    }

    const onViewChange = (e) => { // se dispara cada vez que se cambia la forma del calendario: mes, semana, dia, agenda
        setLastView(e); // actualiza lastView
        localStorage.setItem('lastView', e); // cuando haga el cambio, se guarda esa info en el local storage y que cuando haga refresh me lo deje en el mismo lugar
        // e es la variable que grabo y lo grabo en la variable lastView del localStorage
    }

    const onSelectSlot = (e) => {
        dispatch( eventClearActiveEvent() )
    }

    // esta funcion es una que va a aplicar un determinado estilo al evento del calendario
    const eventStyleGetter = ( event, start, end, isSelected ) => { 

        const style = {
            backgroundColor: ( uid === event.user._id ) ? '#367CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    };

    return (
        <div className="calendar-screen">
            <NavBar />

            <Calendar
                localizer={localizer}
                events={ events }
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={ eventStyleGetter }
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelectEvent }
                onSelectSlot={ onSelectSlot }
                selectable={ true }
                onView={ onViewChange }
                view={ lastView }
                components={{
                    event: CalendarEvent
                }}
            />

            <AddNewFab />

            {
                (activeEvent)
                    && (<DeleteEventFab />)
            }

            <CalendarModal />
        </div>
    )
}
