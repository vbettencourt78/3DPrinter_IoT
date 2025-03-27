// ==============================================
// Configuración Inicial
//Muestra todos los valores en una tabla multiplicados por 100
//Indica su id y la fecha en que se obtuvo el valor
//Para este ejercicio se utilizó los archivos index2.html y app3.js y 
// el contrato Multiplier2.sol
// ==============================================

// ==============================================
// Configuración - ThingSpeak
// ==============================================
const THINGSPEAK_CHANNEL_ID = "2868702";
const THINGSPEAK_API_KEY = "ZAEKJ4I02MM6OU1S";
// Dirección del contrato desplegado en Fuji (Reemplazar con la tuya)
const contractAddress = "0x70139fe27630940F4Acc73CCd4D6931360B9B917";
// ABI del contrato (Copiar desde artifacts/contracts/Multiplier.sol/Multiplier2.json)
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "numMinutes",
        "type": "uint256"
      }
    ],
    "name": "addEntry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "numMinutes",
        "type": "uint256"
      }
    ],
    "name": "calculateCost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "numMinutes",
        "type": "uint256"
      }
    ],
    "name": "convertMinutesToHours",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "entries",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "result",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "total",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "entryCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getEntry",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ==============================================
// Elementos de la UI
// ==============================================
const showDataBtn = document.getElementById("showDataBtn");
const multiplyBtn = document.getElementById("multiplyBtn");
const statusElement = document.getElementById("status");
const resultElement = document.getElementById("result");
const cloudValueElement = document.getElementById("cloudValue");
const dataContainer = document.getElementById("dataContainer");
const jsonDataElement = document.getElementById("jsonData");
const resultsContainer = document.getElementById("resultsContainer");

// ==============================================
// Variables Globales
// ==============================================
let provider;
let signer;
let contract;
let total = 0; // Declare and initialize total
// ==============================================
// Funciones Auxiliares - ThingSpeak API Integration
// ==============================================
function handleError(error) {
    console.error("Error:", error);
    statusElement.textContent = "Ocurrió un error. Revisa la consola para más detalles.";
}

async function fetchThingSpeakHistory() {
    const response = await fetch(
        `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}`
    );

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Mapear los datos para incluir las nuevas columnas
    return data.feeds.map(feed => ({
        created_at: feed.created_at || "N/A", // Fecha de creación
        id_impresora: feed.field1 || "N/A", // ID de la impresora
        nombre_trabajo: feed.field2 || "N/A", // Nombre del trabajo
        material: feed.field3 || "N/A", // Material utilizado
        temp_estrusora_celcius: feed.field4 || "N/A", // Temperatura de la extrusora
        filamento_utilizado_gr: feed.field5 || "N/A", // Filamento utilizado en gramos
        tiempo_imp_min: feed.field6 || "N/A", // Tiempo de impresión en minutos
        fecha: feed.field7 || "N/A", // Fecha del trabajo
        estatus: feed.field8 || "N/A" // Estatus del trabajo
       
    }));
}

// ==============================================
// Muestra los datos en el elemento <pre> con formato JSON
// ==============================================
function displayJsonData(data) {
    jsonDataElement.textContent = JSON.stringify(data, null, 2);
    if (typeof Prism !== "undefined") {
        Prism.highlightElement(jsonDataElement);
    }
}

// ==============================================
// Event Listener para mostrar datos de ThingSpeak
// ==============================================
showDataBtn.addEventListener("click", async () => {
    try {
        statusElement.textContent = "Obteniendo datos de ThingSpeak...";
        const data = await fetchThingSpeakHistory();
        displayJsonData(data);
        dataContainer.classList.remove("hidden");
        statusElement.textContent = "Datos cargados exitosamente!";
    } catch (error) {
        handleError(error);
    }
});

// ==============================================
// Event Listener para multiplicar valores
// ==============================================
multiplyBtn.addEventListener("click", async () => {
    try {
        statusElement.textContent = "Procesando valores...";
        await handleMultiplyForAll();
    } catch (error) {
        handleError(error);
    }
});

// ==============================================
// Función para manejar la multiplicación para cada valor del JSON
// ==============================================
async function handleMultiplyForAll() {
    try {
        // Mostrar mensaje de estado
        statusElement.textContent = "Obteniendo datos desde ThingSpeak...";
        
        // Obtener datos desde ThingSpeak
        const data = await fetchThingSpeakHistory();
        console.log("Datos obtenidos desde ThingSpeak:", data);

        // Limpiar el contenedor de resultados antes de mostrar nuevos
        resultsContainer.innerHTML = "";

        // Crear la tabla y agregar encabezados
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const headers = [
            "ID Impresora",
            "Nombre Trabajo",
            "Material",
            "Temp. Extrusora (°C)",
            "Filamento Utilizado (g)",
            "Tiempo Impresión (min)",
            "Fecha",
            "Estatus",
            "Total (USD)"
        ];
        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            th.style.border = "1px solid #ddd";
            th.style.padding = "8px";
            th.style.backgroundColor = "#f2f2f2";
            th.style.textAlign = "left";
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        // Iterar sobre los datos obtenidos
        for (const entry of data) {
            const id = entry.id_impresora; // Asignar id_impresora como id
            //const valor = parseFloat(entry.filamento_utilizado_gr); // Convertir filamento_utilizado_gr a número
            const valor = parseFloat(entry.tiempo_imp_min); // Asignar tiempo_imp_min como valor (filamento_utilizado_gr);
            
            // Validar que id y valor existan
            if (!id || isNaN(valor)) {
                console.error(`Entrada inválida: ${JSON.stringify(entry)}`);
                continue;
            }
        
            const scaledNumber = Math.round(valor); // Escalar el valor si es necesario
            const numMinutes = Math.round(valor); // Asegúrate de que `valor` sea el tiempo en minutos
            console.log(`Procesando entrada ID ${id}: Valor escalado: ${scaledNumber}, Minutos: ${numMinutes}`);
        
            // Validar conexión con MetaMask
            if (!window.ethereum) {
                throw new Error("MetaMask no está instalado.");
            }
        
            await window.ethereum.request({ method: "eth_requestAccounts" });
        
            // Crear proveedor, signer y contrato
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
        
            // Validar que el contrato esté inicializado
            if (!contract) {
                throw new Error("El contrato no está inicializado correctamente.");
            }

            // Llamar a calculateCost directamente
            try {
              const cost = await contract.calculateCost(numMinutes);
              console.log(`El costo calculado para ${numMinutes} minutos es: ${cost} dólares`);
          } catch (error) {
              console.error("Error al calcular el costo:", error);
          }

        
            // Enviar el número escalado al contrato
            try {
                const txAddEntry = await contract.addEntry(id, scaledNumber, numMinutes);
                await txAddEntry.wait();
                console.log(`Transacción completada para entrada ID ${id}`);
            } catch (txError) {
                console.error(`Error al enviar la transacción para ID ${id}:`, txError);
                continue;
            }
        
          // Obtener el resultado del contrato
           try {
            const [contractId, value, result, total] = await contract.getEntry(id);
            console.log(`ID: ${contractId}, Value: ${value}, Result: ${result}, Total: ${total}`);
           } catch (getError) {
            console.error(`Error al obtener el resultado para ID ${id}:`, getError);
            continue;
      }
        
            // Crear una fila en la tabla para este resultado
            const row = document.createElement("tr");
        
            const idCell = document.createElement("td");
            idCell.textContent = entry.id_impresora || "N/A";
            idCell.style.border = "1px solid #ddd";
            idCell.style.padding = "8px";
        
            const jobNameCell = document.createElement("td");
            jobNameCell.textContent = entry.nombre_trabajo || "N/A";
            jobNameCell.style.border = "1px solid #ddd";
            jobNameCell.style.padding = "8px";
        
            const materialCell = document.createElement("td");
            materialCell.textContent = entry.material || "N/A";
            materialCell.style.border = "1px solid #ddd";
            materialCell.style.padding = "8px";
        
            const tempCell = document.createElement("td");
            tempCell.textContent = entry.temp_estrusora_celcius || "N/A";
            tempCell.style.border = "1px solid #ddd";
            tempCell.style.padding = "8px";
        
            const filamentCell = document.createElement("td");
            filamentCell.textContent = entry.filamento_utilizado_gr || "N/A";
            filamentCell.style.border = "1px solid #ddd";
            filamentCell.style.padding = "8px";
        
            const timeCell = document.createElement("td");
            timeCell.textContent = entry.tiempo_imp_min || "N/A";
            timeCell.style.border = "1px solid #ddd";
            timeCell.style.padding = "8px";
        
            const dateCell = document.createElement("td");
            dateCell.textContent = entry.fecha || "N/A";
            dateCell.style.border = "1px solid #ddd";
            dateCell.style.padding = "8px";
        
            const statusCell = document.createElement("td");
            statusCell.textContent = entry.estatus || "N/A";
            statusCell.style.border = "1px solid #ddd";
            statusCell.style.padding = "8px";

            const totalCell = document.createElement("td");
            totalCell.textContent = total || "N/A"; // Asignar el valor de total
            totalCell.style.border = "1px solid #ddd";
            totalCell.style.padding = "8px";

            row.appendChild(idCell);
            row.appendChild(jobNameCell);
            row.appendChild(materialCell);
            row.appendChild(tempCell);
            row.appendChild(filamentCell);
            row.appendChild(timeCell);
            row.appendChild(dateCell);
            row.appendChild(statusCell);
            row.appendChild(totalCell);
          
            tbody.appendChild(row);
            table.appendChild(tbody);
            resultsContainer.appendChild(table);

           // Agregar la fila al cuerpo de la tabla
           //const resultsContainer = document.getElementById("resultsContainer");
           //resultsContainer.classList.remove("hidden");
    }
      

        statusElement.textContent = "Transacción completada para todos los valores. ✅";
    } catch (error) {
        handleError(error);
    }
}