# Sample Hardhat Project
# Prototipo IoT: Pago por Uso de Impresora 3D en Avalanche

## Descripción
Sistema que simula el pago por uso de una impresora 3D usando:
- **ThingSpeak** para almacenar datos de la impresora 3D.
- **Chainlink** como puente hacia Avalanche (no implementado en esta version).
- **Smart Contracts** en Avalanche para calcular costos.

## Configuración
1. Clona el repositorio:
   ```bash
   git clone https://github.com/vbettencourt78/3DPrinter_IoT.git

## Generación de datos aleatorios a ser almacenados en la nube de Thingspeak
## hay que ejecutar lo siguiente:
python main.py

## Para correr la aplicación en web, hay que hacer los siguiente:
1- yarn hardhat compile
2- npx hardhat run scripts/deploy.js --network fuji
3- Guardar en el archivo app.js el numero de contrato desplegado y el ABI que se encuentra en artifacts/contracts/Multiplier2.sol
4- luego posicionarse en la carpeta frontend, escribiendo cd frontend
5- luego ejecutar en el terminal python -m http.server 8000
6- abres el browser en la dirección que te muestra el terminal http://localhost:8000/
