
#---------------Codigo con los datos en el .env---------------------------
import os # Para obtener variables de entorno
from dotenv import load_dotenv # Para cargar variables de entorno desde archivo .env
import requests # Para hacer peticiones HTTP
import json # Para manejar datos JSON

# Carga las variables del archivo .env desde la raíz del proyecto
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))  # Ajusta según estructura

load_dotenv()

THINGSPEAK_API_KEY = os.getenv("WRITE_API_KEY") # Clave de escritura de ThingSpeak
CHANNEL_ID = os.getenv("THINGSPEAK_CHANNEL_ID") # ID de canal de ThingSpeak
BULK_URL = f"https://api.thingspeak.com/channels/{CHANNEL_ID}/bulk_update.json" # URL de API de ThingSpeak

#---------------------------------------------------------------------------

#---------------Codigo con los datos en el archivo---------------------------
# Función para enviar datos a ThingSpeak
def send_bulk_to_thingspeak(data_list):
    print(f"\n📤 Iniciando envío de {len(data_list)} registros...", flush=True)
    """
    Envía datos masivos con manejo robusto de errores
    y validación de formato.
    """
    if not data_list:
        print("Lista de datos vacía. No se envía nada.") # No hay datos para enviar
        return None
  # Estructura de datos a enviar
    payload = {
        "write_api_key": THINGSPEAK_API_KEY,
        "updates": [] 
    }
    # Validar formato de datos
    for data in data_list:
        try:
            registro = {
                "created_at": data["fecha"],
                "field1": data["id_impresora"],
                "field2": data["nombre_trabajo"],
                "field3": data["material"],
                "field4": data["temp_estrusora_celcius"],
                "field5": data["filamento_utilizado_gr"],
                "field6": data["tiempo_imp_min"],
                "field7": data["fecha"],
                "field8": data["estatus"]
            }
            payload["updates"].append(registro)
        except KeyError as e:
            print(f"Error en formato de datos: Falta clave {e}")
            continue
    # Enviar datos
    try:
        response = requests.post(
            BULK_URL,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        # Manejar códigos de estado específicos
        if response.status_code in [200, 202]:  # Ambos son éxitos
            print(f"✅ Envío exitoso. Respuesta: {response.text}")
            return True
        elif response.status_code == 429:
            print("⚠️ Límite de tasa excedido. Debes reducir la frecuencia de envío")
            return 'retry'
        else:
            print(f"❌ Error en API. Código: {response.status_code}, Respuesta: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"🔌 Error de conexión: {str(e)}")
        return 'retry'