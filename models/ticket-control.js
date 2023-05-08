const path= require('path');
const fs  = require('fs');


class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}


class TicketControl {

    constructor() {
        this.ultimo   = 0; // ultimo ticket que estoy atendiendo
        this.hoy      = new Date().getDate(); // que dia es hoy, solo el dia 
        this.tickets  = []; // tckets pendientes
        this.ultimos4 = []; // ultimos 4 tickets atendidos

        this.init();
        

    
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init() {    
        const {ultimo, hoy, tickets, ultimos4} = require('../db/data.json');
        if( hoy === this.hoy) {
            this.ultimo = ultimo;
            this.tickets = tickets;
            this.ultimos4 = ultimos4;
        }else{
            // Es otro dia
            this.guardarDB(); // guardo en la base de datos
        }
    }
    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json'); // path absoluto
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson)); // escribo el archivo
    }

    siguiente() {
        this.ultimo += 1; // incremento de 1
        const ticket = new Ticket(this.ultimo, null); // creo el ticket
        this.tickets.push(ticket); // agrego el ticket al arreglo

        this.guardarDB(); // guardo en la base de datos

        return `Ticket ${this.ultimo}`; // retorno el ticket
    }

    atenderTicket(escritorio) {
        // No tenemos tickets
        if( this.tickets.length === 0) { // si no hay tickets
            return null;
        }
        const ticket = this.tickets.shift(); // sacar el primer elemento

        ticket.escritorio = escritorio; // cambiar el escritorio

        this.ultimos4.unshift(ticket); // agregar al inicio del arreglo

        if ( this.ultimos4.length > 4) { // si el arreglo tiene mas de 4 elementos
            this.ultimos4.splice(-1, 1); // borra el ultimo
        }

        this.guardarDB(); // guardo en la base de datos

        return ticket; // retorno el ticket
    
    }
    
    
    
    // getUltimoTicket() {
    //     return this.ultimo;
    // }

    // getUltimos4() {
    //     return this.ultimos4;
    // }

    // crearTicket() {
    //     this.ultimo += 1;
    //     let ticket = new Ticket(this.ultimo, null);
    //     this.tickets.push(ticket);

    //     return `Ticket ${this.ultimo}`;
    // }

    // atenderTicket(escritorio) {
    //     if (this.tickets.length === 0) {
    //         return 'No hay tickets';
    //     }

    //     let numeroTicket = this.tickets[0].numero;
    //     this.tickets.shift();

    //     let atenderTicket = new Ticket(numeroTicket, escritorio);

    //     this.ultimos4.unshift(atenderTicket);

    //     if (this.ultimos4.length > 4) { 
    //         this.ultimos4.splice(-1, 1);
    //                     }
    //                     console.log('Ultimos 4');
    //                     console.log(this.ultimos4);
                        

    //     return atenderTicket;
        
    // }
    
}   



module.exports = {
    TicketControl


}
