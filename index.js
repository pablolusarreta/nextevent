const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
let vcontrol, vsalida
// F U N C I O N E S   R E M O T A S
exports.ventanaSalida = f => {
	vsalida = creaVentana(f, [800, 600, 700, 500])
	vsalida.webContents.on('did-finish-load', () => {
		vcontrol.webContents.send('boton_go_pause', { op: '1', f: 'GO', fp: 'PAUSE' })
		vcontrol.webContents.send('boton_out', { op: '0.3', f: 'null' })
	})
	vsalida.on('closed', () => {
		vcontrol.webContents.send('boton_go_pause', { op: '0.3', f: 'null', fp: 'null' })
		vcontrol.webContents.send('boton_out', { op: '1', f: 'ventanaSalida' })
		vcontrol.webContents.send('barra_progreso_off')
	});
}
exports.GO = ob => {
	vsalida.webContents.send('GO', ob)
}
exports.GOGO = () => {
	vcontrol.webContents.send('GOGO')
}
exports.PAUSE = () => {
	vcontrol.webContents.send('pause:control')
	vsalida.webContents.send('pause:salida')
}
exports.PLAY = () => {
	vcontrol.webContents.send('play:control')
	vsalida.webContents.send('play:salida')
}
exports.cierra_salida = () => {
	vsalida.close()
}
exports.mimimiza_salida = () => {
	vsalida.minimize()
}
exports.info_salida = d => {
	vcontrol.webContents.send('info_salida', d)
}
exports.reproduccion = (t, d, s) => {
	vcontrol.webContents.send('reproduccion', { t: t, d: d, s: s })
}
//////////////////////////////////////////////////////////////////////////////
const creaVentana = (f, d) => {
	var ventana = new BrowserWindow({
		width: d[0],
		height: d[1],
		minWidth: d[2],
		minHeight: d[3],
		backgroundColor: '#000',
		show: true,
		icon: path.join(__dirname, 'assets/icons/win/icon.ico'),
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			nodeIntegrationInWorker: true
		}
	})

	ventana.loadURL(url.format({
		pathname: path.join(__dirname, f),
		protocol: 'file',
		slashes: true
	}))
	ventana.setMenu(null)
	//ventana.webContents.openDevTools()
	return ventana
}
//////////////////////////////////////////////////////////////////////////////

app.on('ready', () => {

	const { session } = require('electron');
	session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
		if (permission === 'media') {
			callback(true);
		} else {
			callback(false);
		}
	})

	vcontrol = creaVentana('control.htm', [1240, 800, 910, 750])
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});
app.on('activate', () => {
	if (vcontrol === null) {
		vcontrol = creaVentana('control.htm', [1240, 800, 800, 750])
	}
});
/*if (process.env.NODE_ENV !== 'production') {
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
	});
}*/
ipcMain.on('herramientas', () => { vcontrol.webContents.openDevTools() })