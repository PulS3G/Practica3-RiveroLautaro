const mainInput = document.getElementById("mainInput");
const ratesContainer = document.getElementById("rates-container");
const loadingState = document.getElementById("loading-state");
const errorMsg = document.getElementById("error-message");
const switchBtn = document.getElementById("switchBtn");
const currencyLabel = document.getElementById("currency-label");
const directionText = document.getElementById("direction-text");

const API_URL = "https://dolarapi.com/v1/dolares";
let dolarRates = [];
let isPesosToDolares = true;

async function initApp() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error en la API");
    const data = await response.json();

    dolarRates = data.filter((d) =>
      ["Oficial", "Blue", "Bolsa"].includes(d.nombre),
    );

    if (dolarRates.length > 0) {
      renderBaseCards();
      showRatesGrid();
    } else {
      throw new Error("No se encontraron datos");
    }
  } catch (err) {
    showError("No se pudieron obtener las cotizaciones.");
  }
}

switchBtn.addEventListener("click", () => {
  isPesosToDolares = !isPesosToDolares;

  currencyLabel.textContent = isPesosToDolares ? "$" : "$";
  mainInput.placeholder = isPesosToDolares ? "Monto en ARS" : "Monto en U$D";
  directionText.innerHTML = isPesosToDolares
    ? "Convertir de <b>Pesos</b> a <b>Dólares</b>"
    : "Convertir de <b>Dólares</b> a <b>Pesos</b>";

  updateCalculations();
});

mainInput.addEventListener("input", updateCalculations);

function updateCalculations() {
  const amount = parseFloat(mainInput.value);
  errorMsg.className = "error-hidden";

  if (isNaN(amount) || amount <= 0) {
    if (mainInput.value !== "") {
      showError("Ingresá un monto numérico válido.");
    }
    clearCalculations();
    return;
  }

  dolarRates.forEach((dolar) => {
    const nombreClase =
      dolar.nombre === "Bolsa" ? "mep" : dolar.nombre.toLowerCase();
    const container = document.querySelector(
      `.${nombreClase} .calculation-results`,
    );

    if (container) {
      let resCompra, resVenta;

      if (isPesosToDolares) {
        resCompra = `$ ${(amount / dolar.compra).toFixed(2)}`;
        resVenta = `$ ${(amount / dolar.venta).toFixed(2)}`;
      } else {
        resCompra = `$ ${(amount * dolar.compra).toLocaleString("es-AR")}`;
        resVenta = `$ ${(amount * dolar.venta).toLocaleString("es-AR")}`;
      }

      container.innerHTML = `
                <p class="calc-title">${
                  isPesosToDolares ? "Obtenés (Dólares)" : "Necesitás (Pesos)"
                }</p>
                <div class="calc-item show-result">
                    <p>Precio Compra: <span class="calc-amount">${resCompra}</span></p>
                </div>
                <div class="calc-item show-result">
                    <p>Precio Venta: <span class="calc-amount">${resVenta}</span></p>
                </div>
            `;
    }
  });
}

function renderBaseCards() {
  ratesContainer.innerHTML = "";

  dolarRates.forEach((dolar) => {
    const nombreMostrar = dolar.nombre === "Bolsa" ? "MEP" : dolar.nombre;
    const nombreClase =
      dolar.nombre === "Bolsa" ? "mep" : dolar.nombre.toLowerCase();

    const card = document.createElement("div");
    card.className = `card-dark card-rate ${nombreClase}`;

    card.innerHTML = `
            <div class="card-header">
                <h3>Dólar ${nombreMostrar}</h3>
                <span class="card-tag">ARS/USD</span>
            </div>
            <div class="api-prices">
                <div class="price-item">
                    <span>Compra:</span> <strong>$${dolar.compra}</strong>
                </div>
                <div class="price-item">
                    <span>Venta:</span> <strong>$${dolar.venta}</strong>
                </div>
            </div>
            <div class="calculation-results">
                 <p class="calc-title">Esperando monto...</p>
            </div>
        `;
    ratesContainer.appendChild(card);
  });
}

function showRatesGrid() {
  loadingState.classList.add("hidden");
  ratesContainer.classList.remove("hidden");
  setTimeout(() => {
    document
      .querySelectorAll(".card-rate")
      .forEach((card) => card.classList.add("fade-in-up"));
  }, 50);
}

function clearCalculations() {
  document.querySelectorAll(".calculation-results").forEach((container) => {
    container.innerHTML = '<p class="calc-title">Esperando monto...</p>';
  });
}

function showError(text) {
  loadingState.classList.add("hidden");
  errorMsg.textContent = text;
  errorMsg.className = "error-visible";
}

initApp();
