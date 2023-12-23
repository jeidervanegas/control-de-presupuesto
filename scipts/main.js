

//variables

const formulario = document.querySelector('.formulario');
const gastosListado = document.querySelector('.gastos ul');




//eventos
eventListaner();
function eventListaner() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}



//clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number( presupuesto);
        this.restante = Number( presupuesto);
        this.gastos=[];
    }
    nuevoPresupuesto(gasto) {
        this.gastos = [...this.gastos, gasto];

        this.calcularRestante()
    }
    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + Number(gasto.cantidad), 0);
        
        this.restante = this.presupuesto - gastado;
    }
    borrarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    imprimirPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    imprimirAlerta(mensaje, tipo) {
        //se crea el div de alerta
        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('divAlerta');
        divAlerta.textContent = mensaje;

        //validamos en funcio  del tipo de error
        if(tipo === 'error'){
            divAlerta.classList.add('error');
        } else {
            divAlerta.classList.add('correcto');
        }
        //lo agregamos al html
        document.querySelector('.primario').insertBefore(divAlerta, formulario);
        setTimeout(() => {
            divAlerta.remove();
        },3000);
    }
    agregarGastoListado(gastos) {
        this.limpiarHTML();
        //iteramos 
        gastos.forEach(gasto => {
            //extraemos las variables
            const {nombre, cantidad, id} = gasto;
            
            //creamos el li que va a contener las variables
            const li = document.createElement('li');
            li.classList.add('divGasto');
            li.dataset.id = id;

            //organizamos las variables en el html
            li.innerHTML = `$ ${nombre} <span class="span__gasto">${cantidad}</span>
            
            `;

            //creamos un boton para borrar los gastos
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('boton__borrar');
            btnBorrar.textContent = 'Borrar x';
            btnBorrar.onclick = () => {
                borrarGasto(id);
            }
            li.appendChild(btnBorrar);

            //agregarmos el gasto al html
            gastosListado.appendChild(li);
        })

    }
    limpiarHTML() {
        while(gastosListado.firstChild){
            gastosListado.removeChild(gastosListado.firstChild)
        }
    }
    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }
    validarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const divRestante = document.querySelector('.presupuesto__contenido--restante');

        //validamos
        if((presupuesto / 4) > restante){
            divRestante.classList.remove('correcto','alerta');
            divRestante.classList.add('error__restante');
        } else if((presupuesto / 2) > restante) {
            divRestante.classList.remove('correcto');
            divRestante.classList.add('alerta');
        } else {
            divRestante.classList.remove('error__restante','alerta');
            divRestante.classList.add('correcto__restante');
        }

        //si el restante es <= 0

        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado','error');

            formulario.querySelector('button[type = submit]').disabled = true;
        }
    }
}

//instanciamos

const ui = new UI();
let presupuesto;




//funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto');

    //validamos
    if(presupuestoUsuario === '' || presupuestoUsuario === null || presupuestoUsuario <= 0 || isNaN(presupuestoUsuario)){
        window.location.reload();
    }

    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.imprimirPresupuesto(presupuesto);

}

//formulario

function agregarGasto(e) {
    e.preventDefault();

    //capturamos la info
    const  nombre = document.querySelector('#gasto').value;
    const  cantidad = document.querySelector('#cantidad').value;

    //validamos
    if(nombre === '' || cantidad ==='' ){
        ui.imprimirAlerta('Ambos campos son obligatorios','error')
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no válida','error')
        return;
    }

    ui.imprimirAlerta('Gasto acregado correctamente');
    formulario.reset();

    //creamos un nuevo objeto para agregar un id
    const gasto = {nombre, cantidad, id:Date.now()}
    presupuesto.nuevoPresupuesto(gasto);
    
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    //procedemosa actualizar presupuesto
    ui.actualizarRestante(restante);
    ui.validarPresupuesto(presupuesto);

    
}

function borrarGasto(id){
    presupuesto.borrarGasto(id);

    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos)

    ui.actualizarRestante(restante);
    ui.validarPresupuesto(presupuesto);

}