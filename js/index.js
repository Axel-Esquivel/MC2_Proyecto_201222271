var lista_cartas;
var grupo_seleccion = 0;
var carta_seleccionada = false;

function iniciar() {
    for (let k = 0; k < 20; k++) {
        const n = getN(k);
        const numero_cartas = document.getElementById('numero_cartas');

        if (n <= 81 && n >= 9) {
            const option = document.createElement('option');
            option.text = n;
            option.value = n;

            numero_cartas.appendChild(option);
        }
    }

    agregar_cartas = document.getElementById('agregar-cartas');
    agregar_cartas.addEventListener('click', iniciar_movimientos);

    iniciar_lanzamientos = document.getElementById('iniciar-lanzamientos');
    iniciar_lanzamientos.addEventListener('click', realizar_lanzamientos)
}

function getN(k) {
    return 3 * (2 * k + 1);
}

function log(base, x) {
    return Math.log(x) / Math.log(base);
}

function iniciar_movimientos() {
    lista_cartas = [];
    carta_seleccionada = false;
    numero_cartas = document.getElementById('numero_cartas').value;

    if (numero_cartas >= 9) {
        lista_cartas = crear_cartas(numero_cartas);
        repartir_cartas(lista_cartas);
    }
}

function crear_cartas(numero_cartas) {
    var cartas_creadas = []

    for (let i = 0; i < numero_cartas; i++) {
        const div = document.createElement('div')

        div.id = i
        div.className = "carta animate__backInUp"
        div.addEventListener('click', seleccionar_carta)

        cartas_creadas.push(new Carta(i + 1, div))
    }

    return cartas_creadas
}

function seleccionar_carta(e) {
    const carta = e.target;

    if (carta_seleccionada == false) {
        carta_seleccionada = true;
        carta.className = "carta seleccionada";
        lista_cartas[carta.id].seleccionada = true;
        grupo_seleccion = lista_cartas[carta.id].grupo
    } else {
        if (lista_cartas[carta.id].seleccionada == true) {
            grupo_seleccion = 0
            carta.className = "carta";
            carta_seleccionada = false;
            lista_cartas[carta.id].seleccionada = false;
        }
    }
}

async function realizar_lanzamientos() {
    if (carta_seleccionada == true && grupo_seleccion != 0) {
        numero_lanzamientos = Math.ceil(log(3, lista_cartas.length));

        for (let lanzamiento = 1; lanzamiento <= numero_lanzamientos; lanzamiento++) {
            console.log(`Lanzamiento ${ lanzamiento } grupo selección ${ grupo_seleccion }`)



            await sleep(5000)
        }

    } else {
        alert('Debe seleccionar una carta, antes de inciiar los lanzamientos.')
    }
}

function repartir_cartas(cartas) {
    contenedor_a = document.getElementById('contenedor-a');
    contenedor_b = document.getElementById('contenedor-b');
    contenedor_c = document.getElementById('contenedor-c');

    contenedor_a.innerHTML = '';
    contenedor_b.innerHTML = '';
    contenedor_c.innerHTML = '';

    grupo = 1;
    margin_1 = 0;
    margin_2 = 0;
    margin_3 = 0;
    cartas.forEach(carta => {
        switch (grupo) {
            case 1:
                carta.grupo = grupo;
                carta.contenedor = contenedor_a;
                carta.carta.style.margin = `${margin_1}em ${margin_1}em`;
                carta.contenedor.appendChild(carta.carta);
                grupo = 2;
                margin_1++;
                break;
            case 2:
                carta.grupo = grupo;
                carta.contenedor = contenedor_b;
                carta.carta.style.margin = `${margin_1}em ${margin_1}em`;
                carta.contenedor.appendChild(carta.carta);
                grupo = 3;
                margin_2++;
                break;
            case 3:
                carta.grupo = grupo
                carta.contenedor = contenedor_c
                carta.carta.style.margin = `${margin_1}em ${margin_1}em`;
                carta.contenedor.appendChild(carta.carta);
                grupo = 1;
                margin_3++;
                break;
        }


    });
}

function Carta(n, carta) {
    this.n = n;
    this.grupo = 0;
    this.contenedor;
    this.carta = carta;
    this.seleccionada = false;
}

function sleep(n) {
    return new Promise(resolve=>setTimeout(resolve,n));
}

iniciar()