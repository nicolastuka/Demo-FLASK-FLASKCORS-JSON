let objCountries = [];
const urlServer = "http://127.0.0.1:7800";//tiene que coincidir...

const MigrateData = async() => {
    let data = await GetData();
    data.forEach((d) => {
        objCountries.push({
            "pais" : d['nombre'],
            "population" : parseInt(d['cantidad']),
            "color" : "#" + Math.floor(Math.random()*16777215).toString(16)
        });
    });
}

const GetData = async() => {
    const respuesta = await fetch(urlServer)
    if (respuesta === 200) {
        objCountries = [];
    }
    const data = await respuesta.json();
    return data;
}

const PostData = async(data) => {
    const respuesta = await fetch(urlServer, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json' // Especifica el tipo de contenido que estás enviando
        },
        body: JSON.stringify(data)
    });
    if (respuesta.status === 200) {
        objCountries = [];
        return true;
    }
    return false;
}

export {objCountries, MigrateData, PostData};
