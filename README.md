Reproductor de secuencias multimedia <h2>nextevent</h2>

<ol><li>Puede reproducir cualquier fichero multimedia soportado por HTML5.
<li>Control de volumen de cada paso.
<li>Control acción cuando acaba un paso [ stop | siguiente | bucle ].
<li>Control general tiempo de desvanecimiento de los ficheros de imagen/video [ 0s > 10s ].
<li>Elección entre un solo flujo de todo o audio por separado.
<li>Guardado de proyectos en formato JSON. </ol>

Funcionamiento:
<ol>Para  reproducir audio, video e imagenes: 
<li>Ponemos el PC en modo pantalla extendida.
<li>Hacemos click en el boton [>] para abrir la ventana de salida.
<li>Arrastramos la ventana el escritorio extendido y hacemos click en "Maximizar ventana".</ol>

<ol>Para reproducir solo audio :
<li>Hacemos click en el boton [>] para abrir la ventana de salida.
<li>Hacemos click en "Minimizar ventana ventana".</ol>

Modos ASINC:
<p>Se puede elegir dos modos de funcionamimiento:<br>
<ol><li>Modo ASINC : SINK<br>
En este modo todos los pasos se reproducen sincronicamante.
<br>Los pasos no se pueden solapar, cuando se pulsa GO el paso actual es eliminado y se muestra el siguiente.
<li>Modo ASINC : Audio<br>
En este modo se crean dos flujos uno con imagenes y videos y otro solo con los audios.<br>
Si se esta reproduciendo una imagen y el siguiente paso es un audio la imagen quedara en la salida mientras el sonido se reproduce, y no desaparecera hasta que el siguiente paso sea una imagen o un video.
<br>De igual manera el audio sonara asta terminar o hasta que el siguiente paso sea otro audio.
* Si lo que se quiere hacer es terminar antes de tiempo un paso se pueden usar ficheros vacios. 
 </ol></p>
