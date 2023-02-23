const altPaso = 32
var id_select = 0
var idu_activo

function detecta_tipo(nom) {
    var ex = nom.split('.')
    ex = ex[(ex.length - 1)].toLowerCase()
    for (var i in ext.video) { if (ex == ext.video[i]) return 'video' }
    for (var i in ext.audio) { if (ex == ext.audio[i]) return 'audio' }
    for (var i in ext.img) { if (ex == ext.img[i]) return 'img' }
    return ''
}
function select_paso(id) {
    if (pasos.length == 0) { return false }
    id_select = id
    for (var i in pasos) {
        if (id == pasos[i].id) {
            document.getElementById(id).style.boxShadow = "0 0 0 3px #363 inset"
            PA = pasos[i]
        } else {
            document.getElementById(pasos[i].id).style.boxShadow = "none"
        }
    }
}
function paso_activo(IDU) {
    idu_activo = IDU
    for (var i in pasos) {
        if (IDU == pasos[i].IDU) {
            document.getElementById(pasos[i].id).style.backgroundColor = "#363"
            PS.scrollTo(0, (altPaso * i))
        } else {
            document.getElementById(pasos[i].id).style.backgroundColor = ""
        }
    }
}
function actualiza_id() {
    for (var i in pasos) { pasos[i].id = i }
}
function actualiza_pasos() {
    if (PA.nom == undefined) { return false }
    if (PA.id == undefined) {
        PA.id = pasos.length
        pasos.push(PA)
    } else {
        pasos[PA.id] = PA
    }
}
function guarda_paso() {
    actualiza_pasos()
    guarda_datos()
    cierra_form()
    crea_lista_pasos()
}
function elimina_paso() {
    console.log(id_select)
    dialog.showMessageBox({
        "title": "nextevent-sync",
        "buttons": ['Eliminar', 'NO eliminar'],
        "cancelId": 2,
        "message": '¿ Eliminar  " ' + pasos[id_select].nom + ' " ?',
        "noLink": true,
        "type": "info"
    }).then(r => {
        console.log(r.response)
        if (r.response === 0) {
            if (PA.nom == undefined) { return false }
            pasos.splice(id_select, 1)
            actualiza_id()
            guarda_datos()
            crea_lista_pasos()
            cierra_form()
        }
    }).catch(err => {
        console.log(err)
    })
}
function limpia_memoria() {
    dialog.showMessageBox({
        "title": "nextevent-sync",
        "buttons": ['Eliminar', 'Cancelar'],
        "cancelId": 2,
        "message": "¿Eliminar todos los elementos de la lista?",
        "noLink": true,
        "type": "info"
    }).then(r => {
        console.log(r.response)
        if (r.response === 0) {
            pasos = new Array()
            cierra_form()
            elimina_memoria_local()
            crea_lista_pasos()
        }
    }).catch(err => {
        console.log(err)
    })
}
function ordena_paso(n) {
    var tm = pasos.length
    if (tm < 2) return false
    if (Number(PA.id) == 0 && n == -1) { return false }
    if (Number(PA.id) == (tm - 1) && n == 1) { return false }
    var TMP = PA
    pasos.splice(PA.id, 1)
    actualiza_id()
    pasos.splice((Number(TMP.id) + n), 0, TMP)
    actualiza_id()
    id_select = Number(TMP.id)
    guarda_datos()
    crea_lista_pasos()
}
//////////////////////////////////////////////////////////////////////
function existe(path) {
    try { if (fs.accessSync(path)) { return true } }
    catch (e) { return false }
}
function crea_lista_pasos() {
    console.log(pasos)
    //var simb = ['◻', '↺', '▷']
    //var tips = { img: '⛰▲', audio: '♫', video: '..' }
    let simb = ['◻', '↺', '▷']
    let tips = { img: 'I', audio: 'A', video: 'V' }
    let id, alerta, v, s, S = ""
    if (pasos.length > 0) {
        for (var i in pasos) {
            id = pasos[i].id
            alerta = (existe(pasos[i].ruta) == false) ? ' style="color:#c99"' : ''
            S += `<div id='${id}' onclick='select_paso(${id})'>`
            S += `<div>${i}</div><div class='${pasos[i].tipo}'>${tips[pasos[i].tipo]}</div>`
            v = pasos[i].vol
            s = (v == "0") ? " style='background-color:transparent'" : ""
            S += `<div title='${pasos[i].ruta.replace('\\', '/')}'${alerta}>${pasos[i].nom}</div>`
            S += `<div title='${pasos[i].text}'>${pasos[i].text.replace('<', ' ')}</div>`
            // S += "<div>" + pasos[i].IDU + "</div>"
            S += `<div${s}><div style='width:${v}px'></div></div>`
            S += `<div>${((pasos[i].tipo != 'img') ? simb[pasos[i].fin] : '')}</div>`
            S += `<div><button onclick='abre_form_paso(${id})'><div></div><div></div><div></div></button></div>`
            S += `</div>`
        }
    }
    PS.innerHTML = `${S}<div id="relleno"></div>`
    altRelleno()
    select_paso(id_select)
    paso_activo(idu_activo)
}
const altRelleno = () => {
    document.getElementById('relleno').style.height = `${window.innerHeight}px`
}
window.onresize = altRelleno