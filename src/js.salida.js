const index = require('electron').remote.require('./index')
let salida, config, ES, PA, motor_audio //Elemento Seleccionado,  Paso Actual
PA = false
require('electron').ipcRenderer.on('GO', (e, ob) => {
    config = JSON.parse(localStorage.getItem('NEXTEVENTSIMPLECONFIG'))
    if (PA.tipo == 'audio') {
        console.log('Paso anterior' + PA)
        console.log(PA)
        let ele = document.getElementById('audio' + PA.id)
        //fade_audio_out(ele)
    }
    //------------------------------
    PA = ob
    console.log('Paso Actual' + PA)
    console.log(PA)
    if (PA.tipo != 'audio') {
        salida.style.transition = 'opacity ' + config.fade + 's'
        salida.style.opacity = "0"
    }
    let miliseg = (PA.tipo == 'audio') ? 0 : (Number(config.fade) * 1000)
    setTimeout(() => {
        if (config.flujo == 1) {
            if (PA.tipo == 'audio') {
                salida_audio.innerHTML = ''
            } else {
                salida.innerHTML = ''
            }
        } else {
            salida.innerHTML = salida_audio.innerHTML = ''
        }
        //if (PA.tipo == 'audio') { clearInterval(motor_audio) }
        eval('carga_' + PA.tipo + '()')
    }, miliseg)
})

require('electron').ipcRenderer.on('pause:salida', (e) => {
    if (typeof (ES) === 'object') { ES.pause() }
})
require('electron').ipcRenderer.on('play:salida', (e) => {
    if (typeof (ES) === 'object') { ES.play() }
})


const fade_in = () => { salida.style.opacity = "1" }
const fade_audio_out = ele => {
    let vol = ele.volume
    motor_audio = setInterval(() => {
        vol -= Number(config.fade) / 100
        vol = (vol < 0) ? 0 : vol
        ele.volume = vol
    }, 100)
}

const asigna_eventos = (ob) => {
    ob.addEventListener("timeupdate", (e) => {
        index.reproduccion(ob.currentTime, ob.duration, ob.firstChild.src)
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

const carga_video = () => {
    var el = document.createElement('video')
    el.onloadstart = fade_in
    asigna_eventos(el)
    var el2 = document.createElement("source")
    el2.src = PA.ruta
    el2.type = PA.mime
    el.appendChild(el2)
    ES = salida.appendChild(el)
}

const carga_audio = () => {
    var el = document.createElement('audio')
    el.controls = false
    el.id = 'audio' + PA.id
    var el2 = document.createElement("source")
    el2.src = PA.ruta
    el2.type = PA.mime
    el.appendChild(el2)
    ES = (config.flujo == 1) ? salida_audio.appendChild(el) : salida.appendChild(el)
    asigna_eventos(el)
}

const carga_img = () => {
    var el = document.createElement('img')
    el.src = PA.ruta
    el.type = PA.mime
    el.onload = fade_in
    ES = salida.appendChild(el)
}
//////////////////////////////////////////////////////////////////////////
const info_salida = () => {
    index.info_salida([window.innerWidth, window.innerHeight])
}
const maximiza = () => {
    window.ondblclick = () => {
        document.webkitExitFullscreen()
        location.reload()
    }
    salida.innerHTML = ''
    document.body.webkitRequestFullScreen()
    document.body.style.cursor = "none"
    info_salida()

}
const minimiza = () => {
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