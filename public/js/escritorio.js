
// Referencias html 
const lblEscritorio = document.querySelector('#lblEscritorio')
const btnAtender = document.querySelector('#btnAtender');
const lblTicket = document.querySelector('#lblTicket');
const divAlerta = document.querySelector('#alerta');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search)

if (!searchParams.has('escritorio')) {
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio')
}

const escritorio = searchParams.get('escritorio')
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});


socket.on('tickets-pendientes', (pendientes) => {
    if (pendientes === 0) {
        lblPendientes.style.display = 'none';
        btnAtender.disabled = true;
       
    }else{
        lblPendientes.style.display = '';
        btnAtender.disabled = false;
        lblPendientes.innerText = pendientes;
    }
    
});

btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg }) => {
        if (!ok) {
            lblTicket.innerText = 'Nadie';
            return divAlerta.style.display = '';
        }
        lblTicket.innerText = 'Ticket ' + ticket.numero;
        const audio = new Audio('./audio/new-ticket.mp3');
        audio.play();
   
    });

});