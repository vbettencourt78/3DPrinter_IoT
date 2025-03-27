import random
from datetime import datetime

def generate_data():

    """
    Genera un registro con un valor aleatorio entre 1 y 1000

    Returns:
       dict: A dictionary with the following keys:
            - `id_impresora` (str): The ID of the printer.
            - `nombre_trabajo` (str): The name of the printing job.
            - `material` (str): The type of material used (`PLA` or `ABS`).
            - `temp_estrusora_celcius` (int): The temperature of the extruder in Celsius.
            - `filamento_utilizado_gr` (float): The amount of filament used in grams.
            - `tiempo_imp_min` (int): The printing time in minutes.
            - `fecha` (str): The date and time of the job in ISO format.
            - `estatus` (str): The status of the job, either `completado` or `fallido`.
    """
    materials = ["PLA", "ABS"]
    material = random.choice(materials)
    # Asegurar formato de fecha compatible con ISO 8601
    current_time = datetime.now().astimezone()  # Incluye información de zona horaria
    iso_date = current_time.isoformat(timespec='seconds') # Formato ISO 8601
      
     # Temperatura basada en material
    if material == "PLA":
        temp = random.randint(195, 210)
        filament_used = round(random.uniform(5, 500), 2)  # Gramos (PLA: 50-500g)
    else:
        temp = random.randint(240, 260)
        filament_used = round(random.uniform(5, 500), 2)  # Gramos (ABS: 80-600g)
    
    return {
        "id_impresora": f"{random.randint(1, 5):03d}",
        "nombre_trabajo": f"Job_{datetime.now().strftime('%Y%m%d%H%M')}",
        "material": material,
        "temp_estrusora_celcius": temp,
        "filamento_utilizado_gr": filament_used,  # En gramos
        "tiempo_imp_min": random.randint(5, 1440),  # Tiempo en minutos (5-120 mins)
        "fecha": iso_date,
        "estatus": random.choice(["completado", "fallido"])
    }
    
# Función para generar múltiples registros
def generar_lote_datos(cantidad=10):
    """Genera múltiples registros con timestamps escalonados"""
    return [generate_data() for _ in range(cantidad)] 