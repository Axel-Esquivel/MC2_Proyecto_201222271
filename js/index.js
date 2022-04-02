var lista_cartas;
var grupo_seleccion = 0;
var numero_lanzamientos = 0;
var carta_encontrada = false;

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

    iniciar_lanzamientos = document.getElementById('iniciar-lanzamiento');
    iniciar_lanzamientos.addEventListener('click', realizar_lanzamiento)

    grupo_1 = document.getElementById('grupo-1').addEventListener('click', establecer_grupo_1)
    grupo_2 = document.getElementById('grupo-2').addEventListener('click', establecer_grupo_2)
    grupo_3 = document.getElementById('grupo-3').addEventListener('click', establecer_grupo_3)

    texto = document.getElementById('lanzamientos-restantes');
    texto.innerText = numero_lanzamientos;
}

function establecer_grupo_1() { grupo_seleccion = 1; }

function establecer_grupo_2() { grupo_seleccion = 2; }

function establecer_grupo_3() { grupo_seleccion = 3; }

function getN(k) {
    return 3 * (2 * k + 1);
}

function log(base, x) {
    return Math.log(x) / Math.log(base);
}

function iniciar_movimientos() {
    lista_cartas = [];
    carta_encontrada = false;
    numero_cartas = document.getElementById('numero_cartas').value;

    if (numero_cartas >= 9) {
        lista_cartas = crear_cartas(numero_cartas);
        repartir_cartas(lista_cartas);
    }

    numero_lanzamientos = Math.ceil(log(3, lista_cartas.length));
}

function crear_cartas(numero_cartas) {
    var cartas_creadas = []

    for (let i = 0; i < numero_cartas; i++) {
        const div = document.createElement('div');

        div.id = i;
        div.className = "carta animate__animated animate__backInUp";
        div.addEventListener('click', seleccionar_carta);
        div.addEventListener('mouseover', mostrar_carta);
        div.addEventListener('mouseout', mostrar_carta);
        div.innerText = i + 1

        cartas_creadas.push(new Carta(i + 1, div));
    }

    return cartas_creadas
}

function mostrar_carta(e) {
    div_carta = e.target;
    carta = lista_cartas[div_carta.id]
    vista_previa = document.getElementById('vista-previa');

    if (e.type == 'mouseover') {
        vista_previa.innerText = div_carta.innerText;
        div_carta.style.boxShadow = '0px 0px 10px 5px purple';

        if (carta.seleccionada) {
            vista_previa.style.backgroundColor = 'red';
        } else {
            vista_previa.style.backgroundColor = 'green';
        }
    } else {
        div_carta.style.boxShadow = '';
        vista_previa.innerText = '';
        vista_previa.style.backgroundColor = '';
    }
}

function seleccionar_carta(e) {
    const carta = e.target;

    if (lista_cartas[carta.id].seleccionada == false) {
        carta.className = "carta seleccionada";
        lista_cartas[carta.id].seleccionada = true;
    } else {
        if (lista_cartas[carta.id].seleccionada == true) {
            carta.className = "carta";
            lista_cartas[carta.id].seleccionada = false;
        }
    }
}

async function realizar_lanzamiento() {
    if (numero_lanzamientos != 0 && grupo_seleccion != 0) {
        var lista_a = [];
        var lista_b = [];
        var lista_seleccion = lista_cartas.filter(carta => carta.grupo == grupo_seleccion);

        if (grupo_seleccion != 1 && grupo_seleccion != 2) {
            lista_a = lista_cartas.filter(carta => carta.grupo == 1);
            lista_b = lista_cartas.filter(carta => carta.grupo == 2);
        }

        if (grupo_seleccion != 2 && grupo_seleccion != 3) {
            lista_a = lista_cartas.filter(carta => carta.grupo == 2);
            lista_b = lista_cartas.filter(carta => carta.grupo == 3);
        }

        if (grupo_seleccion != 3 && grupo_seleccion != 1) {
            lista_a = lista_cartas.filter(carta => carta.grupo == 3);
            lista_b = lista_cartas.filter(carta => carta.grupo == 1);
        }

        lista_cartas = []

        lista_cartas = lista_cartas.concat(lista_a);
        lista_cartas = lista_cartas.concat(lista_seleccion);
        lista_cartas = lista_cartas.concat(lista_b);

        lista_cartas.forEach(carta => carta.grupo = 0);

        repartir_cartas(lista_cartas);

        grupo_seleccion = 0;
        numero_lanzamientos--;
        carta_encontrada = true;
    } else {
        alert('Debe el grupo en donde se encuentre la carta que selecciono o ya no tiene mas lanzamientos.')
    }

    if (numero_lanzamientos == 0 && carta_encontrada == true) {
        posicion = (lista_cartas.length - 1) / 2;
        carta = lista_cartas[posicion];

        alert(`La carta que eligió fue: ${carta.n}`);
    }

    texto = document.getElementById('lanzamientos-restantes');
    texto.innerText = numero_lanzamientos;
}

async function repartir_cartas(cartas) {
    contenedor_a = document.getElementById('contenedor-a');
    contenedor_b = document.getElementById('contenedor-b');
    contenedor_c = document.getElementById('contenedor-c');

    contenedor_a.innerHTML = '';
    contenedor_b.innerHTML = '';
    contenedor_c.innerHTML = '';

    grupo = 1;
    margin_1 = 1;
    margin_2 = 1;
    margin_3 = 1;

    for (let i = 0; i < lista_cartas.length; i++) {
        const carta = lista_cartas[i];

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
                carta.carta.style.margin = `${margin_2}em ${margin_2}em`;
                carta.contenedor.appendChild(carta.carta);
                grupo = 3;
                margin_2++;
                break;
            case 3:
                carta.grupo = grupo
                carta.contenedor = contenedor_c
                carta.carta.style.margin = `${margin_3}em ${margin_3}em`;
                carta.contenedor.appendChild(carta.carta);
                grupo = 1;
                margin_3++;
                break;
        }

        await sleep(100)
    }
}

function Carta(n, carta) {
    this.n = n;
    this.grupo = 0;
    this.contenedor;
    this.carta = carta;
    this.seleccionada = false;
}

function sleep(n) {
    return new Promise(resolve => setTimeout(resolve, n));
}

iniciar()