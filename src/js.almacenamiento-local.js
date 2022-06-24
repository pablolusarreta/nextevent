var pasos = new Array();
function carga_datos() {
    if (localStorage.NEXTEVENTSIMPLE) {
        pasos = JSON.parse(localStorage.getItem('NEXTEVENTSIMPLE'));
    }
}
function guarda_datos() {
    localStorage.setItem('NEXTEVENTSIMPLE', JSON.stringify(pasos));
}
function elimina_memoria_local() {
    localStorage.removeItem('NEXTEVENTSIMPLE')
}
///////////////////////////////////////////////////////////////////////
var config = {
    vol: "100",
    fin: "0",
    fade: "2",
    fichero: ""
}
function carga_config() {
    if (localStorage.NEXTEVENTSIMPLECONFIG) {
        config = JSON.parse(localStorage.getItem('NEXTEVENTSIMPLECONFIG'));
        document.getElementById('flujo').innerHTML= flujo[config.flujo]
    } else {
        guarda_config()
    }
}
function guarda_config() {
    localStorage.setItem('NEXTEVENTSIMPLECONFIG', JSON.stringify(config));
}