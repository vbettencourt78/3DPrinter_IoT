from data_simulator.simulator import generar_lote_datos
from data_simulator.thingspeak_integration import send_bulk_to_thingspeak
import time
import json
import sys


#   Configuración de codificación de salida
sys.stdout.reconfigure(encoding='utf-8')

# Configuración de simulación
CONFIG = {
    "intervalo_envio": 15,
    "registros_por_lote": 1,
    "max_reintentos": 2,
    "backoff_base": 2
}

#   Función principal
def main():
    print("🚀 Iniciando simulador de impresora 3D...")
    print(f"Configuración inicial:\n{json.dumps(CONFIG, indent=2)}")
    
    try:
        while True:
            print("\n=== Nuevo ciclo ===", flush=True)
            
            # Generar lote
            print("🛠 Generando lote de datos...", flush=True)
            lote = generar_lote_datos(CONFIG["registros_por_lote"])
            print(f"📦 Lote generado: {len(lote)} registros", flush=True)
            
            # Validación básica
            if not lote:
                print("❌ Lote vacío, omitiendo...", flush=True)
                continue
             # Mostrar primer registro
            print("🔍 Muestra del primer registro:", flush=True)
            print(json.dumps(lote[0], indent=2), flush=True)
            
            # Envío de datos con reintento
            print("📡 Intentando enviar datos...", flush=True)
            for intento in range(CONFIG["max_reintentos"] + 1):
                resultado = send_bulk_to_thingspeak(lote)
                                     
                if resultado is True:  # Éxito
                    enviado = True
                    break
                elif resultado == 'retry':
                    wait_time = CONFIG["backoff_base"] ** intento
                    print(f"⏳ Reintento {intento+1} en {wait_time}s...")
                    time.sleep(wait_time)
                else:  # Error fatal
                    break
     
     # Manejo de envío exitoso               
            if not enviado:
                print("⛔ Lote descartado después de múltiples fallos")
                # Opcional: Guardar lote en archivo para recuperación
                
            time.sleep(CONFIG["intervalo_envio"])
    
    # Manejo de interrupciones        
    except KeyboardInterrupt:
        print("\n🔴 Detenido por el usuario", flush=True)
    #   Manejo de errores
    except Exception as e:
        print(f"🔥 Error crítico: {str(e)}", flush=True)

if __name__ == "__main__":
    print("=== Script iniciado ===", flush=True)
    main()
    print("=== Script finalizado ===", flush=True)

#para ejecutar este codigo escribo en el terminal: python main.py