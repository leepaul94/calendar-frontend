import moment from "moment";


export const prepareEvents = (events = [] ) => {
    //retorno los eventos transformados
    return events.map(
        (e) => ({
            ...e,
            start: moment( e.start ).toDate(),
            end: moment( e.end ).toDate()
        })
    )
}