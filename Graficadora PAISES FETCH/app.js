import { objCountries, MigrateData, PostData } from "./data.js";

const canvas = document.getElementById("lienzo");
const formularioCarga = document.getElementsByTagName("form")[0];
const nombrePais = document.getElementById("nombre");
const cantidadPais = document.getElementById("cantidad");
let context = canvas.getContext('2d');
let majorValue = 0;
let valueDivisorScale = 0;

const DeterminateDivisor = () => {
    var levelNumber = 0;
    var index = 10;
    while(majorValue / index >= 1) {
        levelNumber++;
        index *= 10;
    }
    valueDivisorScale = Math.round(majorValue / Math.pow(10, levelNumber)) * Math.pow(10, levelNumber);
}

const DrawData = () => {
    const width = canvas.width / objCountries.length;
    objCountries.forEach ((country, i) => {
        let heightGraph = ((country.population * 300) / valueDivisorScale) * -1;
        context.fillStyle = country.color;
        context.fillRect(width * i, 350, width, heightGraph);
    });
}

const ShowCountry = (event) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    DrawData();
    context.font = "36px Arial";
    context.fillStyle = "#000";
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const width = canvas.width / objCountries.length;
    objCountries.forEach((country, i) => {
        let acumm = width * i;
        if (mouseX >= acumm && mouseX <= acumm + width) {
            context.fillText(`${country.pais} : ${country.population} hab.`, 10, 50);
        }
    });
}

const GetData = async() => {
    await MigrateData();
    if (objCountries.length > 0){
        majorValue = objCountries.reduce((previo, actual) => {
            return actual.population > previo.population ? actual : previo;
        }).population;
        DeterminateDivisor();
        DrawData();
    }
}

(async() => {
    await GetData();
})();

canvas.addEventListener("mousemove", function(event) { ShowCountry(event) });

formularioCarga.addEventListener("submit", async(event) => {
    event.preventDefault();
    const objSave = {
        "nombre": nombrePais.value,
        "cantidad": parseInt(cantidadPais.value)
    }
    if (PostData(objSave)) {
        alert("Se almacenó el registro con éxito");
        nombrePais.value = "";
        cantidadPais.value = "";
        context.clearRect(0, 0, canvas.width, canvas.height);
        await GetData();
    } else {
        alert("Ocurrió algún error que se deberá tratar...");
    }
});