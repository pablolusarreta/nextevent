const cierra_form = () => {
    setTimeout(() => { FA.style.display = TL.style.display = "none" }, 400)
    FA.style.opacity = TL.style.opacity = "0";
}
const abre_form = () => {
    FA.style.display = TL.style.display = "block";
    FA.childNodes[1].focus()
    setTimeout(() => { FA.style.opacity = TL.style.opacity = "1" }, 100)
}

const dimensiones_img = (id) => {
    //console.log(id)
}
let form_edit
let mime = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'wav': 'audio/wav',
    'mp3': 'audio/mpeg',
    'oga': 'audio/ogg',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png'
}
//////////////////////////////////////////////////////////////////
const abre_form_paso = (id) => {
    PA = PAtmp = pasos[id];
    FA.innerHTML = ''
    form_edit = new Array()

    form_edit.push(crea_input_text(FA, 'Fichero', '82%', '0', [PA.ruta, true, PA.ruta]))


    form_edit.push(crea_input_text(FA, 'Descripción', '82%', '0', [PA.text, false], () => {
        PAtmp.text = form_edit[1].value;
    }))

    if (PA.tipo != "img") {
        form_edit.push(crea_input_range(FA, 'Volumen', '60%', '0', [0, 100, 1, PA.vol, [' %']], () => {
            PAtmp.vol = Number(form_edit[2].value);
        }))
        form_edit.push(crea_input_select(FA, 'Al finalizar', '80px', '80px', [0, 2, 1, PA.fin, ['Stop', 'Bucle', 'Siguiente']], () => {
            PAtmp.fin = form_edit[3].value;
        }))
        crea_button(FA, 'GUARDAR', '20%', '0', [], () => { PA = PAtmp; guarda_paso() })
        FA.style.height = '240px'
    } else {
        crea_button(FA, 'GUARDAR', '20%', '0', [], () => { PA = PAtmp; guarda_paso() })
        FA.style.height = '190px'
    }

    crea_button(FA, 'ELIMINAR', '20%', '10%', [], elimina_paso)
    crea_button(FA, 'CANCELAR', '20%', '22%', [], cierra_form)

    FA.setAttribute('data-id', 'PASO ' + PAtmp.id)

    FA.setAttribute('data-nom', PAtmp.nom)
    dimensiones_img(id)
    abre_form()
}


const flujo = ['SINCRONO','AUDIO ASINC']
///////////////////////////////////////////////////////////////////////////
const abre_form_config = () => {
    FA.innerHTML = ''
    form_edit = new Array()
    form_edit.push(crea_input_select(FA, 'SINCRONISMO ', '20%', '0%', [0, 2, 1, config.flujo, ['SINCRONO', 'AUDIO ASINC']], () => {
        config.flujo = Number(form_edit[0].value);
        document.getElementById('flujo').innerHTML= flujo[config.flujo]
    }))
    crea_button(FA, 'CARGA PROYECTO', '20%', '10%', [], carga_json)
    crea_button(FA, 'GUARDA PROYECTO', '20%', '13%', [], guarda_json)
    crea_salto(FA, '0px')
    form_edit.push(crea_input_range(FA, 'Volumen', '60%', '0', [0, 100, 1, config.vol, [' %']], () => {
        config.vol = form_edit[1].value;
    }))
    crea_button(FA, 'APLICAR A TODOS', '20%', '140px', [], () => {
        for (var i in pasos) {
            if (pasos[i].tipo != 'img') {
                pasos[i].vol = config.vol
            }
        }
        crea_lista_pasos()
        cierra_form()
    })
    crea_salto(FA, '2px')

    form_edit.push(crea_input_select(FA, 'Al finalizar', '20%', '0', [0, 2, 1, config.fin, ['Stop', 'Bucle', 'Siguiente']], () => {
        config.fin = Number(form_edit[2].value);
        guarda_config()
    }))

    crea_button(FA, 'APLICAR A TODOS', '20%', '380px', [], () => {
        for (var i in pasos) {
            if (pasos[i].tipo != 'img') {
                pasos[i].fin = config.fin
            }
        }
        crea_lista_pasos()
        cierra_form()
    })
    crea_salto(FA, '2px')
    form_edit.push(crea_input_range(FA, 'Fade visual', '88%', '0', [0, 10, 0.1, config.fade, [' seg']], () => {
        config.fade = form_edit[3].value;
        guarda_config()
    }))
    crea_salto(FA, '20px')
    crea_button(FA, 'ELIMINAR LISTA', '20%', '0', [], limpia_memoria)
    crea_button(FA, 'CERRAR', '20%', '60%', [], cierra_form)


    FA.style.height = '360px'
    FA.setAttribute('data-id', 'CONFIGURACION')
    FA.setAttribute('data-nom', 'GLOBAL')
    abre_form()
    console.log(config)
}

//////////////////////////////////////////////////////////////////////////
var cont = 0
const establece_fichero = ruta => {
    if (ruta == "") return false
    var tn = ruta.split('\\'); tn = tn[(tn.length - 1)]
    var ex = tn.split('.'); ex = ex[(ex.length - 1)]; ex = ex.toLowerCase()
    PA.IDU = new Date().getTime() + (cont++)
    PA.nom = tn
    PA.text = ""
    PA.ruta = ruta.replace(/\\/g, "/")
    PA.tipo = detecta_tipo(tn)
    PA.mime = mime[ex]
    PA.vol = (PA.tipo != 'img') ? config.vol : '0'
    PA.fin = (PA.tipo != 'img') ? config.fin : ''
}
///////////////////////////////////////////////////////////////////////////
const crea_input_range = (ele, tx, anc, sep, param, func) => {
    if (!ele || !tx || !anc || !sep || !param) return false
    let m = document.createElement('input')
    m.type = 'range'
    m.min = param[0]
    m.max = param[1]
    m.step = param[2]
    m.setAttribute('value', param[3])
    m.setAttribute('title', (param[4].length > 1) ? param[4].join(' | ') : '')
    m.setAttribute('data-estado', 'false')
    m.setAttribute('data-etiqueta', tx)
    m.setAttribute('data-valor', (param[4].length > 1) ? param[4][Number(param[3])] : param[3] + param[4][0])
    m.style.width = anc
    m.style.height = '6px'
    m.style.marginLeft = sep
    m.style.webkitAppearance = 'none';
    m.style.backgroundColor = 'rgba(0,0,0,0.5)'
    m.addEventListener('mousemove', e => {
        if (e.target.getAttribute('data-estado') == 'true') {
            e.target.setAttribute('data-valor',
                (param[4].length > 1) ? param[4][Number(e.target.value)] : e.target.value + param[4][0])
        }
    }, false)
    m.addEventListener('mousedown', (e) => {
        e.target.setAttribute('data-estado', 'true')
    }, false)
    m.addEventListener('change', (e) => {
        e.target.setAttribute('data-estado', 'false')
        e.target.setAttribute('data-valor',
            (param[4].length > 1) ? param[4][Number(e.target.value)] : e.target.value + param[4][0])
        func()
    }, false)
    ele.appendChild(m)
    return m
}
const crea_input_select = (ele, tx, anc, sep, param, func) => {
    if (!ele || !tx || !anc || !sep || !param) return false
    let m = document.createElement('span')
    m.innerHTML = tx
    m.style.paddingLeft = sep
    m.setAttribute('class', 'etiqueta')
    ele.appendChild(m)
    m = document.createElement('select')
    m.setAttribute('value', 0)
    m.setAttribute('title', (param[4].length > 1) ? param[4].join(' | ') : '')
    m.setAttribute('data-etiqueta', tx)
    for (let i in param[4]) {
        let o = document.createElement('option')
        o.setAttribute('value', i)
        if (param[3] == i) { o.setAttribute('selected', true) }
        o.innerHTML = param[4][i]
        m.appendChild(o)
    }
    m.style.width = anc
    m.style.height = '20px'
    m.style.marginLeft = '20px'

    m.addEventListener('change', () => { console.log(form_edit[1].value); func() }, false)
    ele.appendChild(m)
    return m
}
///////////////////////////////////////////////////////
const crea_input_text = (ele, tx, anc, sep, param, func) => {
    if (!ele || !tx || !anc || !sep || !param) return false
    let m = document.createElement('div')
    m.setAttribute('data-etiqueta', tx)
    m.setAttribute('class', 'input_text')
    m.setAttribute('data-valor', param[0])
    m.style.width = 'calc(' + anc + ' + 110px)'
    let t = document.createElement('input')
    t.type = 'text'
    t.setAttribute('value', param[0])
    t.style.paddingLeft = '10px'
    t.style.width = 'calc(100% - 90px)'
    t.style.height = '20px'
    t.style.border = 'none'
    t.style.marginLeft = sep
    t.style.backgroundColor = 'rgba(0,0,0,0.5)'
    t.style.color = '#ccc'
    if (param[1]) {
        t.setAttribute('title', param[2])
        t.setAttribute('disabled', true)
        t.style.backgroundColor = 'rgba(0,0,0,0.2)'
        t.style.color = '#666'
    }
    t.addEventListener('change', func, false)
    m.appendChild(t)
    ele.appendChild(m)
    return t
}
///////////////////////////////////////////////////////
const crea_button = (ele, tx, anc, sep, param, func) => {
    if (!ele || !tx || !anc || !sep || !param || !func) return false
    let m = document.createElement('button')
    m.innerText = tx
    m.style.width = anc
    m.style.border = 'none'
    m.style.marginLeft = sep
    m.addEventListener('click', func, false)
    ele.appendChild(m)
}
const crea_salto = (ele, alt) => {
    let m = document.createElement('div')
    m.display = 'block'
    m.style.width = '100%'
    m.style.height = alt
    ele.appendChild(m)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
