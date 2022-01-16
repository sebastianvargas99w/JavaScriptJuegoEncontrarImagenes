# JavaScriptJuegoEncontrarImagenes
Aplicación web desarrollada con nodejs. Para ejecutar la aplicación, primero, debe ejecutar el archivo "servidorEncuentralo" en la dirección "\website_files\javascript" y luego ejecutar "index.xhtml"

# appweb20bweb-proy-lince
Desarrolladores  
Juan David Díaz Marchena / B72584  
Sebastián Vargas Soto / B47431  
Kevin Obando Molina / B55121


### Descripción del problema a resolver
El problema que se debe resolver en el presente proyecto es la construcción de una adaptación del juego de mesa Lince, que consiste en encontrar objetos en una manta llena de diversos objetos, este debe funcionar de manera distribuida mediante una aplicación web, todo esto con propósitos pedagógicos.  
Además para completar este proyecto es necesario tomar en cuenta los siguientes modos de juego:

 - A cada jugador se le asignan 3 dibujos de manera aleatoria en cada ronda y los busca en el área de juego, la ronda termina cuando un jugador encuentra los 3 dibujos.
 - Se le asignan a los jugadores las mismas 3 figuras elegidas aleatoriamente en cada ronda y el primero en encontrar las 3 es el ganador de la ronda.

### Adaptaciones

#### Obligatorias
 - El anfitrión elige antes de iniciar cada partida la cantidad de objetos con los que se jugarán en dicha partida, siendo el mínimo 9 y el máximo la cantidad de objetos que el equipo logre juntar.
 - La zona de juego no debe ser circular, sino que debe adaptar a la pantalla del dispositivo y no se debe poder desplazarse horizontalmente.
 - Los objetos se ordenan aleatoriamente al comienzo de cada partida.

 #### Adicionales
 Adicionales que se van a implementar:
 - Las cartas se revelan una cantidad de veces preasignada por el anfitrión antes de iniciar cada partida, siendo 0 infinitas oportunidades.
 - Las cartas son mostradas a los jugadores por una cantidad de segundos elegida por el anfitrión antes de iniciar la partida, siendo 0 una cantidad de tiempo infinita.
 - La cantidad de rondas en cada partida es elegida por el anfitrión antes de iniciar cada partida.
 - Se agrega una opción para que las cartas en la manta tomen un efecto de escala de grises.
 #### Modos de juego
 Se agregaron dos modos de juego:
 - Tradicional: Todos los jugadores en la partida buscan cartas diferentes.
 - Compartida: Todos los jugadores en la partida buscan las mismas cartas en la manta.
 #### Idea a futuro
 Como idea a tomar en cuenta como posible trabajo a futuro el profesor sugirió la siguiente adaptación:
 - Proveer en la sala de espera una opción: "Encontrar parejas de [ n ] cartas" donde n es la cantidad de objetos que conforman una pareja, para obtener los puntos de una carta tiene que encontrar las ocurrencias del objeto en la manta. El juego podría indicar en la carta cuántas ocurrencias faltan de encontrar y cuando este contador llega a cero, la carta desaparece de la lista de cartas como de costumbre.
 #### Créditos
Enunciado del proyecto  
[Proyecto Lince](http://jeisson.ecci.ucr.ac.cr/appweb/2020b/proyecto/)

Las imágenes las tomamos de las siguientes páginas:
- https://thenounproject.com/
- https://www.flaticon.com/


Los audios del juego los tomamos de la siguiente pagina: 
- https://www.zapsplat.com/
