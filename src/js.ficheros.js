const carga_json = () => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Texto plano', extensions: ['json'] }]
    }).then(result => {
        if (!result.canceled) {
            fs.readFile(result.filePaths[0], (err, data) => {
                let TMPD = JSON.parse(data.toString())
                if (TMPD.ID == 'nextevent 2022') {
                    pasos = TMPD.pasos
                    config = TMPD.config
                    cierra_form()
                    guarda_datos()
                    carga_config()
                    crea_lista_pasos()
                    select_paso(id_select)
                } else {
                    contenedor.innerHTML = '<header><div>¡ Formato JSON no válido !</div></header>'
                }
            })
        }
    }).catch(err => {
        console.log(err)
    })
}
const guarda_json = () => {
    let d = new Date()
    let nom_fihero = AMDHMS(d)
    let url = dialog.showSaveDialog({
        properties: ['openFile'],
        filters: [{ name: 'Texto plano', extensions: ['json'] }],
        defaultPath: nom_fihero
    }).then(result => {
        if (!result.canceled) {
            console.log(result.filePath)
            let objeto = { ID: 'nextevent 2022', pasos: pasos, config: config }
            fs.writeFile(result.filePath, JSON.stringify(objeto), error => {
                if (error) { alerta({ estado: true, texto: error, accion: false }) }
            })
            cierra_form()
        }
    }).catch(err => {
        console.log(err)
    })
}
const AMDHMS = t => {
    let d = new Date(t);
    let M = Number(d.getMonth()) + 1; let D = Number(d.getDate()); let h = Number(d.getHours());
    let m = Number(d.getMinutes()); let s = Number(d.getSeconds());
    let nm = d.getFullYear() + '.' + ((M < 10) ? '0' + M : M) + '.' + ((D < 10) ? '0' + D : D) + '-' + ((h < 10) ? '0' + h : h) + '.' + ((m < 10) ? '0' + m : m) + '.' + ((s < 10) ? '0' + s : s);
    return nm
}