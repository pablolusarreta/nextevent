const index = require('electron').remote.require('./index')
var salida, config, ES, PA, Ptmp //Elemento Seleccionado,  Paso Actual

require('electron').ipcRenderer.on('GO', (e, ob) => {
    console.log(ob)
    config = JSON.parse(localStorage.getItem('NEXTEVENTSIMPLECONFIG'))
    Ptmp = PA
    PA = ob
    if (PA.tipo != 'audio') {
        salida.style.transition = 'opacity ' + config.fade + 's'
        salida.style.opacity = "0"
    }
    let miliseg = (PA.tipo == 'audio') ? 0 : (Number(config.fade) * 1000)

    setTimeout(() => {
        if (config.flujo == 1) {
            if (PA.tipo == 'audio' ) {
                salida_audio.innerHTML = ''
            } else {
                salida.innerHTML = ''
            }
        } else {
            salida.innerHTML = salida_audio.innerHTML = ''
        }
        eval('carga_' + PA.tipo + '()')
    }, miliseg)
})

require('electron').ipcRenderer.on('pause:salida', (e) => {
    if (typeof (ES) === 'object') { ES.pause() }
})
require('electron').ipcRenderer.on('play:salida', (e) => {
    if (typeof (ES) === 'object') { ES.play() }
})


var fade_in = () => { salida.style.opacity = "1" }
var asigna_eventos = (ob) => {
    ob.addEventListener("timeupdate", (e) => {
        index.reproduccion(ob.currentTime, ob.duration,  ob.firstChild.src)
        //console.log(document.getElementById('contenedor').firstChild.firstChild.getAttribute('src'),ob.currentTime,' | ',ob.duration)
        if (PA.fin == 1) {
            ob.loop = true
        } else {
            ob.loop = false
            if (!(ob.currentTime < ob.duration)) {
                salida.style.opacity = "0"
                if (PA.fin == 2) index.GOGO()
            }
        }

    }, true);
    ob.addEventListener("paused", (e) => {
        index.PAUSE()
    }, true);
    ob.addEventListener("playing", (e) => {
        index.PLAY()
    }, true);
    ob.addEventListener("loadedmetadata", (e) => {
        ob.play()
        ob.volume = Number(PA.vol) / 100
    }, true);
}

var carga_video = () => {
    var el = document.createElement('video')
    el.onloadstart = fade_in
    asigna_eventos(el)
    var el2 = document.createElement("source")
    el2.src = PA.ruta
    el2.type = PA.mime
    el.appendChild(el2)
    ES = salida.appendChild(el)
}

var carga_audio = () => {
    var el = document.createElement('audio')
    el.controls = false
    var el2 = document.createElement("source")
    el2.src = PA.ruta
    el2.type = PA.mime
    el.appendChild(el2)
    ES = (config.flujo == 1) ? salida_audio.appendChild(el) : salida.appendChild(el)
    asigna_eventos(el)
}

var carga_img = () => {
    var el = document.createElement('img')
    el.src = PA.ruta
    el.type = PA.mime
    el.onload = fade_in
    ES = salida.appendChild(el)
}
//////////////////////////////////////////////////////////////////////////
var info_salida = () => {
    index.info_salida([window.innerWidth, window.innerHeight])
}
var maximiza = () => {
    window.ondblclick = () => {
        document.webkitExitFullscreen()
        location.reload()
    }
    salida.innerHTML = ''
    document.body.webkitRequestFullScreen()
    document.body.style.cursor = "none"
    info_salida()

}
var minimiza = () => {
    let context = new AudioContext()
    info_salida()
    index.mimimiza_salida()
}
window.onload = () => {
    salida = document.getElementById("contenedor")
    salida_audio = document.getElementById("contenedor_audio")
    audio = document.getElementById("audio")
    info_salida()
}
window.onclick = () => {
    let context = new AudioContext()
    //context.resume().then(() => { console.log('Playback resumed successfully') })
}
window.onresize = info_salida