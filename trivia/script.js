let todasLasPreguntas = [];
let preguntasJuego = [];
let indiceActual = 0;
let puntos = { correctas: 0, incorrectas: 0, noRespondidas: 0 };
let timerInterval;
let tiempoRestante = 5;

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const categorySelect = document.getElementById('category-select');
const optionsContainer = document.getElementById('options-container');


async function inicializarApp() {
    try {
        const res = await fetch('trivia_realista_240.json');
        if (!res.ok) throw new Error("No se pudo obtener el archivo");
        
        const data = await res.json();

        todasLasPreguntas = data.categorias.flatMap(cat => cat.preguntas);

        if (todasLasPreguntas.length === 0) throw new Error("El JSON está vacío");
        
        poblarCategorias();
    } catch (err) {
        console.error("Error detallado:", err);
        document.body.innerHTML = "<h1>Error al cargar los datos. No se puede continuar.</h1>"; 
    }
}

function poblarCategorias() {
    const categorias = [...new Set(todasLasPreguntas.map(p => p.id.split('_')[0]))];
    categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });
}


function iniciarJuego() {
    const catSeleccionada = categorySelect.value;
    if (!catSeleccionada) return alert("Selecciona una categoría"); 

    const filtradas = todasLasPreguntas.filter(p => p.id.startsWith(catSeleccionada));
    preguntasJuego = filtradas.sort(() => 0.5 - Math.random()).slice(0, 5); 
    indiceActual = 0;
    puntos = { correctas: 0, incorrectas: 0, noRespondidas: 0 };
    
    setupScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    mostrarPregunta();
}

function mostrarPregunta() {
    clearInterval(timerInterval);
    if (indiceActual >= 5) return mostrarResultados(); 
    const p = preguntasJuego[indiceActual];
    document.getElementById('progress').textContent = `Pregunta ${indiceActual + 1} de 5`; 
    document.getElementById('question-text').textContent = p.pregunta;
    
    const opciones = [p.correcta, ...p.incorrectas].sort(() => 0.5 - Math.random());
    
    optionsContainer.innerHTML = '';
    opciones.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => validarRespuesta(opt, p.correcta, btn);
        optionsContainer.appendChild(btn);
    });

    iniciarContador();
}

function iniciarContador() {
    tiempoRestante = 5;
    document.getElementById('timer').textContent = `Tiempo: ${tiempoRestante}s`;
    
    timerInterval = setInterval(() => {
        tiempoRestante--;
        document.getElementById('timer').textContent = `Tiempo: ${tiempoRestante}s`;
        
        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            puntos.noRespondidas++; 
            indiceActual++;
            setTimeout(mostrarPregunta, 1000); 
        }
    }, 1000);
}

function validarRespuesta(seleccion, correcta, btnSeleccionado) {
    clearInterval(timerInterval);
    
    Array.from(optionsContainer.children).forEach(b => b.disabled = true);

    if (seleccion === correcta) {
        btnSeleccionado.classList.add('correct');
        puntos.correctas++;
    } else {
        btnSeleccionado.classList.add('incorrect');
        puntos.incorrectas++;
        
        Array.from(optionsContainer.children).find(b => b.textContent === correcta).classList.add('correct');
    }

    indiceActual++;
    setTimeout(mostrarPregunta, 1500); 
}


function mostrarResultados() {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    document.getElementById('score-summary').innerHTML = `
        <p>Total de preguntas: 5</p>
        <p>✅ Correctas: ${puntos.correctas}</p>
        <p>❌ Incorrectas: ${puntos.incorrectas}</p>
        <p>⏳ No respondidas: ${puntos.noRespondidas}</p>
    `; 
}

document.getElementById('start-btn').onclick = iniciarJuego;
document.getElementById('restart-btn').onclick = () => {
    setupScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
};


document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});