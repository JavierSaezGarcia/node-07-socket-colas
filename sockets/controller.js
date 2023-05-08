
const { TicketControl }= require('../models/ticket-control');
const ticketControl = new TicketControl();


const socketController = (socket) => {   
   
    // Todo esto se dispara cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length); 


    
    socket.on('siguiente-ticket', ( payload, callback ) => {          
        
        const siguiente = ticketControl.siguiente(); // lee el valor del ticket
        callback( siguiente  ); // lo manda al cliente   

        // TODO Notificar que hay un nuevo ticket pendiente de asignar        
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
         
    });

    socket.on('atender-ticket', ( {escritorio}, callback ) => {

        if( !escritorio ){  
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
            
        }
        const ticket = ticketControl.atenderTicket( escritorio );


        // TODO Notificar cambio en los ultimos 4 tickets
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        
        socket.emit('tickets-pendientes', ticketControl.tickets.length); // ve la cola SOLO el que atiende ( socket.emit )
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length); // ven la cola actualizada TODOS menos el que atiende ( socket.broadcast.emit )

        if( !ticket ){
            return callback({
                ok: false,
                msg: 'No hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket

            });
        } 
    });
    


}


module.exports = {
    socketController
}

