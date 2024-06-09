import json
import mysql.connector as mysql
from flask import Flask, request
from flask_cors import CORS

# Crear una instancia de servidor Flask
app = Flask(__name__)

# CORS(app) Recuerden el conceto de las CORS que vimos en el último TP de la parte de JS
CORS(app, origins="*", methods=["GET", "POST"], allow_headers=["Content-Type"])

# Datos de conexión a la base de datos
data_cnn = ("localhost", "root", "", "tecnica1_sudamerica")
# Establecemos conexión
connection = mysql.connect(
    host=data_cnn[0], user=data_cnn[1], password=data_cnn[2], database=data_cnn[3]
)


# Función que voy a utilizar para obtener los datos...
def GetData():
    sql = "SELECT * FROM paises ORDER BY cantidad DESC"
    cursor = connection.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    json_data = json.dumps(
        [{"id": row[0], "nombre": row[1], "cantidad": row[2]} for row in results]
    )
    connection.commit()
    cursor.close()
    return json_data


# Función que voy a utilizar para escribir datos (o registros que queda mejor) en la base de datos
def SetData(objJSON):
    sql = f"INSERT INTO paises (nombre, cantidad) VALUES('{objJSON['nombre']}', {objJSON['cantidad']})"
    try:
        cursor = connection.cursor()
        cursor.execute(sql)
    except Exception as e:
        print("Error al ejecutar la consulta SQL:", e)
    connection.commit()
    cursor.close()


# Decorador para tratar con los métodos GET y POST
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return GetData()
    if request.method == "POST" and request.is_json:
        SetData(request.json)
        return "Pais almacenador correctamente", 200


# Punto de ejecución del programa...
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=7800)
