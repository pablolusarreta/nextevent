const { dialog } = require('electron').remote
const { ipcRenderer, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const index = require('electron').remote.require('./index')

const version = 'nextevent 7.2.0'

let BV, BG, IS, PA, PAtmp, P, PS, FA, inf_salida, motor_pausado, ahora
let pausado = false
let ext = {
    video: ['mp4', 'webm', 'ogg'],
    audio: ['wav', 'mp3', 'oga'],
    img: ['jpg', 'jpeg', 'gif', 'png']
}

const muestra_ficheros = () => {
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Multimedia', extensions: ext.video.concat(ext.audio, ext.img) },
            { name: 'Video', extensions: ext.video },
            { name: 'Audio', extensions: ext.audio },
            { name: 'Imagen', extensions: ext.img },
            { name: 'Todos los ficheros', extensions: ['*'] }
        ]
    }).then(res => {
        if (!res.canceled) {
            console.log(res.filePaths)
            for (let i in res.filePaths) {
                PA = new Object();
                establece_fichero(res.filePaths[i].toString())
                actualiza_pasos()
            }
            guarda_datos()
            crea_lista_pasos()
        }

    }).catch(err => {
        console.log(err)
    })
}


ipcRenderer.on('boton_go_pause', (e, m) => {
    if (pausado) { clearInterval(motor_pausado) }
    BG.style.opacity = BP.style.opacity = m.op
    BG.onclick = eval(m.f)
    BP.onclick = eval(m.fp)
})
ipcRenderer.on('boton_out', (e, m) => {
    BV.style.opacity = m.op
    IS.innerHTML = '';
    BV.onclick = eval(m.f)
})
ipcRenderer.on('info_salida', (e, m) => {
    inf_salida = { pantalla: m }
    IS.innerHTML = '□ ' + inf_salida.pantalla[0] + ' · ' + inf_salida.pantalla[1]
})
ipcRenderer.on('barra_progreso_off', () => {
    IF.style.width = '0%'
    CDA.style.width = '0%'
    CD.innerHTML = ''
})
ipcRenderer.on('reproduccion', (e, m) => {
    if (PAtmp.nom === (decodeURI(m.s.split('/').pop()))) {
        if (goact) {
            CD.innerHTML = '';
            IF.style.width = '0%'
        } else {
            CD.innerHTML = '<strong>' + new Date((m.d * 1000 - (m.t * 1000)) - 3600000).toLocaleTimeString() + '</strong> | '
            CD.innerHTML += new Date((m.d - 3600) * 1000).toLocaleTimeString()
            IF.style.width = String((100 * m.t) / m.d) + '%'
        }
        if (m.t == m.d) {
            CD.innerHTML = '';
            IF.style.width = '0%'
        }
    } else {
        if (goact) {
            CDA.width = '0%';
        } else {
            CDA.style.width = String((100 * m.t) / m.d) + '%'
        }
        if (m.t == m.d) {
            CDA.width = '0%';
        }
    }
})
ipcRenderer.on('pause:control', (e) => {
    pausado = true
    motor_pausado = setInterval(() => {
        if (BP.style.opacity == "1") { BP.style.opacity = "0.3" } else { BP.style.opacity = "1" }
    }, 500)
})
ipcRenderer.on('play:control', (e) => {
    pausado = false
    clearInterval(motor_pausado)
    BP.style.opacity = "1"
})
ipcRenderer.on('GOGO', (e) => {
    GO()
})

const ventanaSalida = () => {
    index.ventanaSalida('salida.htm')
}
let goact = false
const GO = () => {
    CD.innerHTML = ''; IF.style.width = CDA.style.width = '0%'
    if (goact == false) {
        goact = true; PAtmp = PA
        setTimeout(() => goact = false, Number(config.fade) * 1000 + 100);
        if (PA.tipo == 'img') { if (pausado) { clearInterval(motor_pausado) } }
        paso_activo(pasos[id_select].IDU)
        let sig = (id_select < (pasos.length - 1)) ? (id_select + 1) : 0;
        BP.style.opacity = "1"
        index.GO(PA)
        P = PA
        select_paso(sig)
    }
}
const PAUSE = () => {
    if (P != undefined) {
        if (P.tipo == 'img') { return false }
        if (pausado) { index.PLAY() } else { index.PAUSE() }
    }
}
////////////////////////////////////////////////////////////////////////////////////
const arranca = () => {
    carga_datos()
    carga_config()
    crea_lista_pasos()
    select_paso(id_select)
}
const quedan = t => {
    t = Math.abs(t)
    let dias = Math.floor(t / 86400000)
    let horas = Math.floor((t % 86400000) / 3600000)
    let minutos = Math.floor(((t % 86400000) % 3600000) / 60000)
    return `${dias} Dias, ${horas} Horas y ${minutos} minutos.`
}
window.onload = () => {
    BV = document.getElementById("boton_crea_v")
    BG = document.getElementById("boton_go")
    BP = document.getElementById("boton_pausa")
    IS = document.getElementById("info_s")
    PS = document.getElementById("pasos")
    TL = document.getElementById("telon")
    FA = document.getElementById("formulario")
    IF = document.getElementById("info")
    CDA = document.getElementById("contador_audio")
    RL = document.getElementById("relog")
    CD = document.getElementById("contador")
    CD.addEventListener('dblclick', () => { ipcRenderer.send('herramientas') })
    document.title = version
    setInterval(() => {
        ahora = new Date(); let h = ahora.getHours(); let m = ahora.getMinutes();
        RL.innerHTML = ((h < 10) ? '0' + h : h) + ':' + ((m < 10) ? '0' + m : m)
    }, 1000)
    prueva()
    /*document.getElementsByTagName('body')[0].removeChild(document.getElementById("quedan"))*/
    arranca()
    //ventanaSalida()
}

window.onkeydown = e => {
    if (e.code === 'ArrowRight' || e.code === 'Enter') {
        BG.click()
    } else if (e.code === 'ControlRight') {
        PAUSE()
    } else if (e.code === 'ArrowLeft') {
        //ATRAS()
    } else if (e.code === 'Space') {
        e.stopPropagation();
        return false      
    }
    console.log(e.code)

}
window.onbeforeunload = () => {
    index.cierra_salida()
}
const prueva = () => {
    // final Miercoles, 1 de Enero de 2025
    let final = 1735686000000
    let ahora = new Date().getTime()
    let diferencia = ahora - final
    let s = `<div>La prueba termina el ${new Date(final).toLocaleDateString('es-ES')}<br>
            ${quedan(diferencia)}</div><div id="contador_prueba"></div>`
    document.getElementById("quedan").innerHTML = s
    setTimeout(() => {
        document.getElementById("contador_prueba").style.width = '872px'
    }, 1000)

    if (ahora < final) {
        setTimeout(() => {
            document.getElementsByTagName('body')[0].removeChild(document.getElementById("quedan"))
            arranca()
        }, 5000)
    }
}/**/