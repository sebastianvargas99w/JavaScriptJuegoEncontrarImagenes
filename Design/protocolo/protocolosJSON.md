### crearPartida

ocurre cuando el usuario presiona el boton de crear

```
arreglos de elementos del sitio = obtener elementos de la clase deshabilitable
deshabilitar los los elementos del arreglo con los elementos del sitio
ocultar notificación de errores si los hay
enviar mensaje crear al servidor
notificar al usuario que la partida se está creando
ir a estado de espera por creación de partida


```

###  errorDeConexion

ocurre cuando hay un error de conexion con el servidor mientras esta en el estado de esperar por crear sesion

```
arreglos de elementos del sitio = obtener elementos de la clase deshabilitable
habilitar los los elementos del arreglo con los elementos del sitio
ocultar notificacion de que la partida se esta creando
notificar al usuario que ocurrio un error de conexion y que reintente más tarde
```

### sesionCreada

ocurre cuando llega el mensaje sesionCreada

```
detener temporizador de espera por mensaje de sesionCreada
extraer el codigo de partida
mostrar pantalla de configuracion de partida(crear.html)
mostrar codigo de partida en la pantalla
```


### empezarPartida

cuando el anfitrión termina de configurar el juego y presiona empezar partida

```
redireccionar a estado Partida (partida.html)
enviar mensaje a los jugadores para empezar partida
repite infinitamente
		el cliente espera la respuesta del servidor
	actualiza la pantalla con los ajustes que le indique el servidor
```

### unirse

cuando el jugador presiona el botón de unirse a partida

```
redireccionar a Unirse a partida (unirse.html)
cambiar estado a
```



###  errorDeConexionUnirse

ocurre cuando hay un error de conexión con el servidor mientras está en el estado de esperar por ingreso a sesión

```
habilitar boton de empezar
habilitar boton de cancelar
ocultar notificacion de que se esta uniendo a la partida
notificar al usuario que ocurrio un error de conexion y que reintente
```

###  IngresarASesión

ocurre cuando el usuario presiona el boton de empezar

```
deshabilitar el boton de empezar
deshabilitar el boton de empezar
ocultar notificación de errores si los hay
enviar mensaje unirse al servidor
notificar al usuario que se esta uniendo a la partida
ir a estado de espera por ingreso a sesión
```

### salir

ocurre cuando se presiona el botón de salir

```
ir a pantalla de paginaPrincipal
cambiar a estado de pagina principal

```

### volverAJugarAnfitrion

cuando se presiona el boton de volver a jugar en la pagina de fin de partida

```

si es invitado ir a página de esperando partida y cambiar de estado a esperando partida
si es anfitrión ir a página de crear partida y cambiar de estado a crear partida


```




### Ingresado a sesión

ocurre cuando llega el mensaje unidoASesión

```
extraer nombres de jugadores
mostrar pantalla de espera de partida(esperar.html)
mostrar nombres de jugadores
```




### revelarCarta
```
enviar revelar.json;
recibir revelar.json;
if (puedoRevelar()){
  showCard();
}
actualizarCantidadCartasRevelar();
```

### encontrarCarta
```
enviar ("E nombreCarta");
recibir ronda.json
actualizar(){
  actualizarPuntaje();
  actualizarManta();
}
```

### encontrarCarta

cuando un jugador elige un dibujo de la manta

```
compara la imagen elegida con las cartas buscadas y si es correcto
	si la imagen es correcta se envía al servidor la carta encontrada
```

### revelarCarta

cuando un jugador decida revelar las carta

```
revisa si al jugador le quedan revisiones de cartas
si le quedan revisiones, quita el difuminado de las cartas por un tiempo previamente definido
resta un punto a la cantidad de vistas restantes
al terminar el tiempo las cartas vuelven a difuminarse
```
