//constantes
const palabra = document.querySelector('.scramble');
const containerInput = document.querySelector('.resp-scramble');
const contenedorIntentos = document.getElementsByClassName('container-circle');
const resets = document.querySelectorAll('.circle');
const tentar = document.querySelector('.tries-contenido');
const contenedorLetras = document.querySelector('.container-letras');
const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
//variables
let stringLetra = '';
let contadorIntentos = 0;

//funciones
//funcion para reiniciar intentos
const reiniciarIntentos = () => {
    for (i = 0; i < 5; i++) {
        resets[i].classList.remove('morado');
    }
}

//funcion para desordenar la palabra
const desordenarPalabra = (string) => {
    let character = string.split('');
    let arrayDesordenado = [];
    let contador = 0;
    containerInput.innerHTML = "";
    while (character.length) {
        //numero aleatorio 
        let sorted = Math.floor(Math.random() * character.length);
        //mudo la posicion de la letra en el array
        let sortedArray = character.splice(sorted, 1)[0];
        //agrego letra por letra al array  desordenado
        arrayDesordenado.push(sortedArray);

        //creo inputs para cada letra
        const input = document.createElement('input');
        input.classList.add('try');
        input.maxLength = 1;
        //agrego id a cada input para poder indentificarlos
        input.id = contador;
       
        contador++;
        containerInput.appendChild(input);
    }
    //muestro la string el la pantalla
    palabra.textContent = arrayDesordenado.join('');
    nodeInp(string);
}

//funcion para controlar los inputs 
const nodeInp = (str) => {
    //creo un node list de todos los inputs
    const inputs = document.querySelectorAll('.try');
    for (var i = 0; i < inputs.length; i++) {
        //valido se foi introducido una letra para pasar al siguiente input
        inputs[i].addEventListener('input', function (e) {
            //convierto las letras a minusculas 
            this.value = this.value.toLowerCase();
            //para q el input solo acepte texto
            if (!regex.test(this.value)){
                //se for introducido um numero lo reemplaza
                this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,'');
            }
            
            //variable para identificar el input actual
            let nextId = Number(this.id);
            //aumento em 1 o valor do id para poder selccionar o proximo input
            nextId++;
            const nextInput = document.getElementById(nextId);

            //si el input no esta vacio 
            if (this.value != "") {
                //se estoy en el ultimo input solo agrego la letra al string
                
                this.disabled = true; //desabilito el input
                if (this.id == inputs.length - 1) {
                    //concateno la nueva letra
                    stringLetra = stringLetra.concat(this.value);
                    console.log(stringLetra);
                    //si llego al ultimo input compraro las pabras para e muestro un mensaje
                    if (stringLetra === str) {
                        alert('voce ganhou!!');
                        contadorIntentos = 0;
                        stringLetra = '';
                        getPalabra();
                        limparInputs();
                    } else if (stringLetra != str) {
                        limparInputs(str);
                        stringLetra = '';
                    }
                } else {
                    //se no estoy en el ultimo input paso al siguente
                    stringLetra = stringLetra.concat(this.value);
                    nextInput.focus();
                }
                //creo um span e muestro en tela cao se escruta una letra errada
                if (str.indexOf(this.value) === -1) {
                    const span = document.createElement('span');
                    span.className = 'letra';
                    span.textContent = `${this.value},`;
                    contenedorLetras.appendChild(span);
                }
            }
        })
    }
}

//voy cambiando los colores de los circulos por cada intento errado
const colorIntentos = (intentos, str) => {
    resets[intentos].classList.add('morado');
    contadorIntentos++;
    tentar.textContent = `Tries:(${contadorIntentos}/5)`;
    if (contadorIntentos === 5) {
        alert('perdeu! a palabra certa é: ' + str);
        contenedorLetras.innerHTML = "";
        
        getPalabra();
    }
}

//limpios los inputs para que oueda hacer un nuevo intento
const limparInputs = (str) => {
    const input = containerInput.childNodes;
    for (var i = 0; i < containerInput.childElementCount; i++) {
        input[i].value = '';
        input[i].disabled = false;
        input[0].focus();
    }
    colorIntentos(contadorIntentos, str);
}

//funcion asincrona que trae la palabra de la api
async function getPalabra() {
    let longitud = Math.floor(Math.random() * (9 - 4)) + 4;
    const url = `https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=${longitud}`;
    contadorIntentos = 0;
    tentar.textContent = `Tries(${contadorIntentos}/5): `;
    const resp = await fetch(url);
    const json = await resp.json();
    const str = json.join('');
    
    desordenarPalabra(str);
    reiniciarIntentos();
}

//eventos para trael la pabra al iniciar el juego
getPalabra();
