/************************************* ACCESO INICIAL - INSTALACIÓN ************************************/
/**
 * Acceso inicial a la aplicación y gestión de la actualización de los contenidos.
 */
function goto_home(){
	$("#loading_message").text("Actualizando....");
	initDB();
	shared_init();
}

/************************************* PÁGINA MENÚ PRINCIPAL ************************************/
function goto_listado_categorias_costadelsol(lang){
	/* Como esta es la entrada a la aplicación a partir del momento que el usuario selecciona el idioma, aprovechamos para guardar éste en la global current_lang.*/
	current_lang	= lang;
	transaction(
		function(tx){
			/* En la query indicamos que el código identificador de la categoría sea igual que el del padre de la categoría para asegurarnos que sólo recuperamos las categorías de primer nivel. */
			tx.executeSql('select code, nombre_'+lang+' as nombre from categorias where code=cat_padre', [], 
				function(tx, rs){
					$('#listado_categorias_costadelsol .content').empty();
					for(i=0;i<rs.rows.length;i++){
						item		= rs.rows.item(i);
						cat_div	 = "<a href='javascript:void(0)' id='enlace_"+item.code+"' onclick='goto_categoria_costadelsol(\""+item.code+"\", \""+item.nombre+"\")'>";
						cat_div	+= "	<div class='cat_div "+item.code+"'>";
						cat_div	+= "		<div class='cat_name'>";
						cat_div	+= 				item.nombre;
						cat_div	+= "		</div>";			
						cat_div	+= "	</div>";
						cat_div	+= "</a>";
						$('#listado_categorias_costadelsol .content').append(cat_div);
					}
				}
			);
		}, 
		errorDB, 
		function(){
			show_view('#listado_categorias_costadelsol');
		}
	);	
}

/**
 * Ir al contenido de una categoría determinada (que puede ser un listado de subcategorías, un listado de lugares o el widget del tiempo) filtrando por población
 */
function goto_categoria_poblacion(cat_padre_code, cat_padre_nombre, poblacion_nombre){
	if(cat_padre_code == 'eltiempo'){
		goto_eltiempo(poblacion_nombre);
	}
	poblacion_sanitized = sanitize(poblacion_nombre);
	lang	= current_lang;
	transaction(
		function(tx){
			tx.executeSql('select code, nombre_'+lang+' as nombre from categorias where cat_padre=? and code!=cat_padre', [cat_padre_code],
				function(tx, rs){
					if(rs.rows.length == 0){
						/* La categoría que nos han pasado por parámetro no tiene subcategorías, hay que mostrar los lugares de ésta */
						goto_listado_lugares_poblacion(cat_padre_code, cat_padre_nombre, poblacion_nombre, rs);
					}
					else{
						/* La categoría que nos han pasado por parámetro tiene subcategorías por lo que llamamos al método que las lista.*/
						goto_listado_subcat_poblacion(cat_padre_code, cat_padre_nombre, poblacion_nombre, rs);
					}
				}
			);
		}, 
		errorDB, 
		successDB
	);
}
/**
 * Método que carga el listado de categorías que cuelgan de cat_padre, filtrando por población. El motivo principal por el que se separa la gestión del listado de subcategorías en dos métodos, según si filtramos
 * o no por población es por claridad de código, principalmente por que en el caso de la población daremos un estilo u otro a botones y cabeceras en función de qué población se trate, mientras que cuando el
 * listado no filtre por población el estilo es fijo. 
 * 
 * @param cat_padre_code
 * @param cat_padre_nombre
 * @param poblacion_nombre
 * @param rs
 * @return
 */
function goto_listado_subcat_poblacion(cat_padre_code, cat_padre_nombre, poblacion_nombre, rs){
	/* Este método sustituye espacios en blanco por guiones bajos y elimina acentos, eñes, diéresis y demás caracteres especiales, que son susceptibles de genrar problemas en las rutas a ficheros.*/
	poblacion_sanitized	= sanitize(poblacion_nombre);
	
	/* Reinicio las clases que tenia el listado, añadiendo clases que le genera el jquery mobile (creo) para no perder algunos estilos que me interesan.*/
	$('#listado_subcategorias').removeClass().addClass("poblacion ui-page ui-body-c ui-page-active");
	nRows			= 6; /* En cuanto al diseño siempre habrá 6 filas, aunque el número de subcategorías del listado será inferior. Esta variable nos permite el manejo en el bucle.*/
	
	/* Rutas al directorio de iconos de la población y a la imagen de fondo de la cabecera.*/
	root_img_path	= "img/shared/iconos/"+poblacion_sanitized+"/";
	header_img		= "img/shared/degradados/"+poblacion_sanitized+"/"+"header.png";

	/* Estilos propios según la población con la que estemos trabajando.*/
	$("#listado_subcategorias .back_button").css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");
	$("#listado_subcategorias .back_button").html(poblacion_nombre);			

	$("#listado_subcategorias h1").empty().html(cat_padre_nombre);
	$('#listado_subcategorias .content').empty();
	$('#listado_subcategorias .header').css("background", "url("+header_img+") repeat-x");
	
	/* En este bucle construimos las 6 filas, distinguiendo las que tienen contenido de las que no.*/
	for(i=0;i<nRows;i++){
		if(i<rs.rows.length){
			item		= rs.rows.item(i);
			cat_code	= item.code;
			cat_nombre	= item.nombre;
			
			if(cat_padre_code == 'rutas'){
				thumb	= root_img_path+"icono-playas_y_rutas.jpg";
			}
			else{
				thumb	= root_img_path+"icono-"+cat_padre_code+".jpg";
			}			
			
			cat_div	 = "<a href='javascript:void(0)' id='enlace_"+cat_code+"' onclick='goto_categoria_poblacion(\""+cat_code+"\", \""+cat_nombre+"\",\""+poblacion_nombre+"\")'>";
			cat_div	+= "	<div class='cat_div'>";
			cat_div	+= "		<div class='icono' style='background:url("+thumb+")'>";
			cat_div	+= "		</div>";													
			cat_div	+= "		<div class='nombre'>";
			cat_div	+= 				cat_nombre;
			cat_div	+= "		</div>";
			cat_div	+= "		<div class='flecha'></div>";
			cat_div	+= "	</div>";
			cat_div	+= "</a>";
		}
		else{
			cat_div	 = "<div class='void_row'></div>";
		}
		$('#listado_subcategorias .content').append(cat_div);											
	}
	show_view('#listado_subcategorias');
}

/**
 * Muestra el listado de subcategorías, si las tienes, o los lugares de dicha categoría en caso contrario, sin filtro por poblacion.
 * 
 * @param cat_padre_code
 * @param cat_padre_nombre
 * @return
 */
function goto_categoria_costadelsol(cat_padre_code, cat_padre_nombre){
	lang	= current_lang;
	transaction(
		function(tx){
			tx.executeSql('select code, nombre_'+lang+' as nombre from categorias where cat_padre=? and code!=cat_padre', [cat_padre_code],
				function(tx, rs){
					if(rs.rows.length == 0){
						/* La categoría que nos han pasado por parámetro no tiene subcategorías, hay que mostrar los lugares de ésta */
						goto_listado_lugares_costadelsol(cat_padre_code, cat_padre_nombre);
					}
					else{
						goto_listado_subcat_costadelsol(cat_padre_code, cat_padre_nombre, rs);
					}
				}
			);

		}, 
		errorDB, 
		successDB
	);
}

function goto_listado_subcat_costadelsol(cat_padre_code, cat_padre_nombre, rs){
	/* Le añadimos la categoría 'costadelsol' para que adapte el estilo de la vista compartida con el listado de subcategorías de 'poblacion'.*/
	$('#listado_subcategorias').removeClass().addClass("costadelsol ui-page ui-body-c ui-page-active");
	nRows			= 10; /* Se mostrarán 10 filas aunque siempre el número de subcategorías del listado siempre será inferior. Esta variable nos permite la gestión del lsitado mediante un bucle.*/
	
	/* Rutas al directorio con los iconos y la imagen de fondo de la cabecera*/
	root_img_path	= "img/shared/iconos/costadelsol/";
	header_img		= "img/shared/degradados/costadelsol/header.png";
	
	/* Asignación de estilos a la vista.*/
	$('#listado_subcategorias .header').css("background", "url("+header_img+") repeat-x");
	$("#listado_subcategorias .back_button").empty().css("background", "url(img/shared/botones/costadelsol/back_to_listado_categorias.png)");
	$("#listado_subcategorias h1").empty().html(cat_padre_nombre);
	$('#listado_subcategorias .content').empty();
	
	
	for(i=0;i<nRows;i++){
		if(i<rs.rows.length){
			item		= rs.rows.item(i);
			cat_code	= item.code;
			cat_nombre	= item.nombre;
			
			if(cat_padre_code == 'rutas'){
				thumb	= root_img_path+"icono-playas_y_rutas.jpg";
			}
			else{
				thumb	= root_img_path+"icono-"+cat_padre_code+".jpg";
			}
			
			cat_div	 = "<a href='javascript:void(0)' id='enlace_"+cat_code+"' onclick='goto_categoria_costadelsol(\""+cat_code+"\", \""+cat_nombre+"\")'>";
			cat_div	+= "	<div class='cat_div'>";
			cat_div	+= "		<div class='icono' style='background:url("+thumb+")'>";
			cat_div	+= "		</div>";													
			cat_div	+= "		<div class='nombre'>";
			cat_div	+= 				cat_nombre;
			cat_div	+= "		</div>";
			cat_div	+= "		<div class='flecha'></div>";
			cat_div	+= "	</div>";
			cat_div	+= "</a>";
		}
		else{
			cat_div	 = "	<div class='void_row'></div>";
		}
		$('#listado_subcategorias .content').append(cat_div);											
	}
	show_view('#listado_subcategorias');
}

/* Se encarga de recuperar y mostrar los lugares pertenecientes a una determinada categoría, sin filtrar por población.*/
function goto_listado_lugares(cat_padre_code, cat_padre_nombre, poblacion_nombre){
	if(poblacion_nombre	== ""){
		goto_listado_lugares_costadelsol(cat_padre_code, cat_padre_nombre);
	}
	else{
		goto_listado_lugares_poblacion(cat_padre_code, cat_padre_nombre, poblacion_nombre)
	}
}

/**
 * Método que prepara el contenido del mapa de a costa del sol, básicamente para recuperar la descripción en el idioma seleccionado por el usuario.
 * 
 * @return
 */
function goto_mapa_costadelsol(){
	lang			= current_lang;
	/* El método get_multilang_label se usa para recuperar cadenas de texto traducidas en el idioma que se le pase por parámetro. Estas traducciones están como arrays en functions.js*/
	descripcion_costadelsol	= get_multilang_label(lang, "descripcion_costadelsol");
	
	$("#mapa_costadelsol .descripcion").empty().html(descripcion_costadelsol);
	show_view("#mapa_costadelsol");
	
}

/* Variables para adaptar dinámicamente la altura de capas contenedores al contenido que, en cada caso, contengan.*/
var original_page_height_lugares_poblacion			= "";
var original_content_height_lugares_poblacion		= "";
/**
 * Dada una población y una categoría, recuperamos el listado de lugares que hay en la base de datos.
 * @param cat_padre_code
 * @param cat_padre_nombre
 * @param poblacion_nombre
 * @return
 */
function goto_listado_lugares_poblacion(cat_padre_code, cat_padre_nombre, poblacion_nombre){
	if(cat_padre_code == 'eltiempo'){
		goto_eltiempo(poblacion_nombre);
	}
	else{
		/* Eliminamos las tildes y convertimos en minúsculas el nombre de la población. */
		poblacion_sanitized	= sanitize(poblacion_nombre);
			
		/* Título con el nombre de la población*/
		$('#listado_lugares_poblacion .header h1').text(cat_padre_nombre);
	
		/* Clase que define el degradado del título propio de cada población*/
		$('#listado_lugares_poblacion .header').css("background", "url(img/shared/degradados/"+poblacion_sanitized+"/header.png) repeat-x");
		
		/* Estilo para el botón "atrás" con el que se vuelve al mapa de la Costa del Sol*/
		$('#listado_lugares_poblacion .back_button').css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");			
		$('#listado_lugares_poblacion .back_button').text(poblacion_nombre);		
	
		transaction(
			function(tx){
				if(cat_padre_code == 'playas'){
					sql =  "select code, nombre, foto_listado as thumb from playas where poblacion_fk='"+poblacion_sanitized+"'";
				}
				else{
					sql =  "select code, nombre, foto_listado as thumb from lugares where poblacion_fk='"+poblacion_sanitized+"' and cat_fk='"+cat_padre_code+"'";
				}
				tx.executeSql(sql, [],
					function(tx, rs){
						$('#listado_lugares_poblacion .content').empty();
						if(rs.rows.length != 0){
							height	= 0;
							rootPath	= get_root_path();						
							for(i=0;i<rs.rows.length;i++){
								item			= rs.rows.item(i);
								lugar_code		= item.code;
								lugar_nombre	= item.nombre;
								lugar_thumb		= rootPath+"/"+item.thumb;
	
								/* Enlace al detalle del lugar*/
								if(cat_padre_code == 'playas'){
									lugar_div	 = "<a href='javascript:void(0)' id='enlace_lugar' onclick='goto_playas_detalle(\""+lugar_nombre+"\", \""+poblacion_nombre+"\", \"poblacion\")'>";								
								}
								else{
									lugar_div	 = "<a href='javascript:void(0)' id='enlace_lugar' onclick='goto_lugar_detalle(\""+cat_padre_code+"\", \""+cat_padre_nombre+"\", \""+lugar_nombre+"\", \""+poblacion_nombre+"\", \"poblacion\")'>";
								}
	
								lugar_div	+= "	<div class='lugar_div'>";
								lugar_div	+= "		<img class='thumb' src='"+lugar_thumb+"'/>";
								lugar_div	+= "		<div class='nombre'>";
								lugar_div	+= 				lugar_nombre;
								lugar_div	+= "		</div>";
								lugar_div	+= "		<div class='flecha large'></div>";
								lugar_div	+= "	</div>";
								lugar_div	+= "</a>";
								$('#listado_lugares_poblacion .content').append(lugar_div);
								height += get_height('#listado_lugares_poblacion .content .lugar_div');
							}
							
							if(original_page_height_lugares_poblacion == ""){
								original_page_height_lugares_poblacion			= get_height('#listado_lugares_poblacion');
								original_content_height_lugares_poblacion		= get_height('#listado_lugares_poblacion .content');
							}						
	
							new_page_height		= original_page_height_lugares_poblacion + height;
							$('#listado_lugares_poblacion').css("height", new_page_height+"px");
	
							new_content_height	= original_content_height_lugares_poblacion + height;
							$('#listado_lugares_poblacion .content').css("height", new_content_height+"px");
						}
						else{
							alert("No hay info para la categoría: '"+cat_padre_code+"' del municipio: '"+poblacion_sanitized+"'");
						}
					}
				);
	
			}, 
			errorDB, 
			function(){
				show_view('#listado_lugares_poblacion');
			}
		);		
	}	
}

/**
 * Método que muestra el detalle específico de los lugares de tipo playa. Para el resto de lugares (campos de glof, centros deportivos, ayuntamientos....) hay unmétodo común pero en este caso se muestran uns iconos
 * para indicar los servicios de que dispone la playa por lo que prefería crearle un método específico. 
 * 
 * @param playa_nombre
 * @param poblacion_nombre
 * @param listado_back
 * @return
 */
function goto_playas_detalle(playa_nombre, poblacion_nombre, listado_back){
	lang	= current_lang;
	
	/* Labels (ya traducidas) que se utilizan en esta vista*/
	playa_longitud_label_value			= get_multilang_label(lang, 'playa_longitud_label_key');
	tipo_arena_label_value				= get_multilang_label(lang, 'tipo_arena_label_key');
	n_hamacas_label_value				= get_multilang_label(lang, 'n_hamacas_label_key');
	puestos_de_salvamento_label_value	= get_multilang_label(lang, 'puestos_de_salvamento_label_key');
	tipo_acceso_label_value				= get_multilang_label(lang, 'tipo_acceso_label_key');
				
	/* Eliminamos las tildes y convertimos en minúsculas el nombre de la población. */
	poblacion_sanitized	= sanitize(poblacion_nombre);
	/* Eliminamos las tildes y convertimos en minúsculas el nombre de la población. */
	playa_code	= sanitize(playa_nombre);
		
	/******************* GESTIÓN CABECERA ********************/		
	$('#playas_detalle h1').text(playa_nombre);
	$('#playas_detalle .header').css("background", "url(img/shared/degradados/"+poblacion_sanitized+"/header.png) repeat-x");
	$('#playas_detalle .back_button').css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");			
	$('#playas_detalle .back_button').text(get_multilang_label(lang, 'playas'));
	$('#playas_detalle .map_button').text(get_multilang_label(lang, 'ver_mapa'));
	/******************* MÉTODO JAVASCRIPT A EJECUTAR EN EL BACK BUTTON ********************/
	
	$('#playas_detalle .map_button').css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");	
	
	transaction(
		function(tx){
			tx.executeSql('select * from playas where code=?', [playa_code], 
				function(tx, rs){
					if(rs.rows.length>0){
						item					= rs.rows.item(0);
						lugar_foto_detalle		= item.foto_detalle;
						lugar_descripcion		= eval("item.descripcion_"+lang);
						lugar_direccion			= item.direccion;
						lugar_latitude			= item.latitude;
						lugar_longitude			= item.longitude;						
						
						$('#playas_detalle a#map_button').bind('click', 
							function(){			
								goto_mapa_lugar(poblacion_nombre, lugar_nombre, lugar_direccion, lugar_latitude, lugar_longitude)
							}
						);						

						var rootPath	= get_root_path();
						$('#playas_detalle .foto_detalle').empty().append("<img src='"+rootPath+"/"+lugar_foto_detalle+"' />");

						$('#playas_detalle .descripcion').empty().html("<p>"+parsea_br(lugar_descripcion)+"</p>");


						$('#playas_detalle .iconos').empty();
						for(i=0;i<campos_iconos_playas.length;i++){
							columna_bd_nombre	= campos_iconos_playas[i];
							
							if(eval("item."+columna_bd_nombre)==1){
								$('#playas_detalle .iconos').append("<img src='img/shared/iconos/iconos_playas/"+columna_bd_nombre+".jpg' class='icono' />");
							}
						}
						
					}
				}
			);	
		}, 
		errorDB, 
		function(){
			show_view('#playas_detalle');
		}		
	);	
}

/* Variables que uso para calcular dinámicamente la altura que tienen que tener las capas contenedores en función del contenido que en cada caso contengan. */
var original_page_height_poblacion_detalle			= 0;
var original_content_height_poblacion_detalle		= 0;
var original_categorias_height_poblacion_detalle	= 0;
/**
 * Método que carga los contenidos para la vista con el detalle de una determinada población.
 * 
 * @param poblacion_nombre
 * @return
 */
function goto_poblacion(poblacion_nombre){
	/* Eliminamos las tildes y convertimos en minúsculas el nombre de la población. */
	poblacion_sanitized	= sanitize(poblacion_nombre);
		
	/* Título con el nombre de la población*/
	$('#poblacion_h1').text(poblacion_nombre);
	
	/* Clases propias de jquery */
//	$('#poblacion_detalle .header').removeClass().addClass('');
	/* Clase que define el degradado del título propio de cada población*/
	$('#poblacion_detalle #header').css("background", "url(img/shared/degradados/"+poblacion_sanitized+"/header.png) repeat-x");
	
	/* Estilo para el botón "atrás" con el que se vuelve al mapa de la Costa del Sol*/
	$('#poblacion_detalle .back_button').css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");			
	$('#poblacion_detalle .back_button').text('Costa del Sol');

	/* Estilo pra la cabecera "Categorías que aparece debajo de la descripción."*/
	$('#poblacion_detalle #descripcion_poblacion').removeClass().addClass(poblacion_sanitized+'_border descripcion_poblacion');
	$('#poblacion_detalle #descripcion_poblacion').css("background", "url(img/shared/degradados/"+poblacion_sanitized+"/b_descripcion.png) repeat-x");
	$('#poblacion_detalle #categorias_h2').css("background", "url(img/shared/degradados/"+poblacion_sanitized+"/cat_header.png) repeat-x");
	
	/* En el detalle de una población se muestra un texto sobre ésta y debajo un listado con las categorías de la población. En esta transacción se realizan los accesos necesarios para ambos listados.*/
	transaction(
		function(tx){
			tx.executeSql('select code, nombre, descripcion_'+current_lang+' as descripcion from poblaciones where code=?', [poblacion_sanitized], 
				function(tx, rs){
					if(rs.rows.length>0){
						item	= rs.rows.item(0);
						descripcion_poblacion	= item.descripcion;
						$('#descripcion_poblacion').html(descripcion_poblacion);
					}
					else{
						alert("No se ha encontrado descripcion en el idioma: '" +current_lang + "' para la población: '"+ poblacion_nombre + "'");
					}
				}
			);
			tx.executeSql('select code, nombre_'+current_lang+' as nombre from categorias where code=cat_padre and code!="costadelsol"', [], 
				function(tx, rs){
					poblacion_sanitized	= sanitize(poblacion_nombre);
					$('#poblacion_detalle #categorias_poblacion').empty();
					new_categorias_poblacion_height	= 0;
					for(i=0;i<rs.rows.length;i++){	/* Voy a probar hacer 10 iteraciones para crear diez filas aunque no en todas esté el nombre de una subcategoría*/
						item		= rs.rows.item(i);
						cat_code	= item.code;
						cat_nombre	= item.nombre;
		
						cat_div	 = "<a href='javascript:void(0)' id='enlace_"+cat_code+"' onclick='goto_categoria_poblacion(\""+cat_code+"\", \""+cat_nombre+"\", \""+poblacion_nombre+"\")'>";
						cat_div	+= "	<div class='cat_div'>";
						cat_div	+= "		<div class='icono "+cat_code+"' style='background:url(img/shared/iconos/"+poblacion_sanitized+"/icono-"+cat_code+".jpg)'>";
						cat_div	+= "		</div>";													
						cat_div	+= "		<div class='nombre'>";
						cat_div	+= 				cat_nombre;
						cat_div	+= "		</div>";
						cat_div	+= "		<div class='flecha small'></div>";
						cat_div	+= "	</div>";
						cat_div	+= "</a>";
						$('#poblacion_detalle #categorias_poblacion').append(cat_div);
						new_categorias_poblacion_height	+= get_height('#poblacion_detalle #categorias_poblacion .cat_div');
					}
				}
			);			
		}, 
		errorDB,
		function(){
			show_view('#poblacion_detalle');
		} 
	);
}

/**
 * Método que me resulta más cómodo para hacer el cambio de vista que usar la instrucción $.mobile.changePage(page_id) 
 * 
 * @param page_id
 * @return
 */
function show_view(page_id){
	$.mobile.changePage(page_id);
}

/**
 * Mostramos el mapa de google con la ubicación del lugar. Los métodos auxiliares shoMap(...) y addMarkersToMap(...) son copiados y pegados de un artículo que encontré con alguna modificación para cambiar el marker
 * que se utiliza y meterle texto. Usan un js adicional marker_label.js
 *  
 * @param poblacion_nombre
 * @param lugar_nombre
 * @param direccion
 * @param latitude
 * @param longitude
 * @return
 */
function goto_mapa_lugar(poblacion_nombre, lugar_nombre, direccion, latitude, longitude){
	var poblacion_sanitized	= sanitize(poblacion_nombre);
	/******************* GESTIÓN CABECERA ********************/		
	$('#mapa_lugar h1').text(lugar_nombre);
	$('#mapa_lugar .header').css("background", "url(img/shared/degradados/"+poblacion_sanitized+"/header.png) repeat-x");
	$('#mapa_lugar .back_button').css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");			
	$('#mapa_lugar .back_button').text(get_multilang_label(current_lang, volver));	
	
	map	= showMap(latitude, longitude);
	addMarkersToMap(poblacion_nombre, lugar_nombre, direccion, map, latitude, longitude);
	 
	show_view('#mapa_lugar');
}

		function showMap(latitude, longitude){
			var mapOptions = {
				zoom: 15,
				center: new google.maps.LatLng(latitude, longitude),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			} 
			var map = new google.maps.Map(document.getElementById("mapa_lugar_content"), mapOptions);
			return map;
		}
		
		function addMarkersToMap(poblacion_nombre, lugar_nombre, direccion, map, latitude, longitude){
			var poblacion_sanitized	= sanitize(poblacion_nombre);
			var point = new google.maps.LatLng(latitude, longitude);
			
			var image = new google.maps.MarkerImage(
			  new google.maps.Size(300,40),
			  new google.maps.Point(0,0),
			  new google.maps.Point(75,40)
			);
			

			var shape = {
			  coord: [0,0,150,40],
			  type: 'rect'
			};
			
			var marker = new google.maps.Marker({
			  draggable: false,
			  raiseOnDrag: false,
			  icon: '',
			  shape: shape,
			  map: map,
			  position: point,
			  clickable:false,
			  visible:false
			});	
			

			var label = new Label({
				map: map,
				style: 'background:url(img/shared/bocadillos/'+poblacion_sanitized+'/bocadillo.png);'
			});
			label.bindTo('position', marker, 'position');
			label.set('text', "<div class='nombre_lugar'>"+lugar_nombre+"</div><div class='direccion_lugar'>"+direccion+"</div>");
			
//			google.maps.event.addListener(marker, 'click', function() {
//				show_view('#detalle_playa');
//		  	});		
		 }		

/**
 * En la cabecera hay botones con los que volver a la página de la que se viene. Éste es uno para volver a la página inicial, pero si no recuerdo mal los cambie todos por un window.history.back(-1) por que me
 * daba bastantes problemas en la navegación usar llamadas algo más 'inteligentes'. 
 * 
 * @return
 */
function backto_home(){
	$('.header').removeClass().addClass('header ui-header ui-bar-a ui-header-fixed fade ui-fixed-overlay');				
	$.mobile.changePage('#home');
}

function errorDB(tx){
	console.error('Error!!!', tx);
	alert('Error en la consulta: ' + tx.message);
}

function successDB(tx, err){
	console.log('Grande!!!', tx, err);
}			

/* Variables con las que calcular dinámicamente la altura de capas contendoras en función del contenido que le metamos en cada caso.*/
var original_page_height_lugares_costadelsol				= "";
var original_content_height_lugares_costadelsol				= "";
var original_listado_lugares_height_costadelsol		= "";
var original_listado_poblaciones_height_costadelsol	= "";

/**
 * Muestra el listado de lugares de una determinada categoría sin filtrar por población. En la vista aparecerá un listado con lo lugares y debajo un listado con las poblaciones. Al pinchar sobre una de éstas se
 * accede al listado de la categoría en la que nos encontramos en este momento, pero ya filtrando por categoría.
 * 
 * @param cat_padre_code
 * @param cat_padre_nombre
 * @return
 */
function goto_listado_lugares_costadelsol(cat_padre_code, cat_padre_nombre){
	/* Si la categoría que nos llega es 'costadelsol' o 'eltiempo' mostraremos el mapa de la costadelsol o un widget con el tiempo en la ubicación actual (en realidad no es de la ubicación actual pero como si lo 
	 * fuera) respectivamente*/
	if(cat_padre_code == 'costadelsol'){
		goto_mapa_costadelsol();
	}
	else if(cat_padre_code == 'eltiempo'){
		goto_eltiempo("costadelsol");
	}
	else{
		/* Para el resto de categorías recuperamos el listado de lugares y de poblaciones en la misma transaction.*/
		new_listado_lugares_height_costadelsol	= 0;
		lang									= current_lang;
		
		/* Título con el nombre de la población*/
		$('#listado_lugares_costadelsol .header h1').text(cat_padre_nombre);
		
		$('#listado_lugares_costadelsol .back_button').text(get_multilang_label(lang, "categorias_key"));
		transaction(
			function(tx){
				if(cat_padre_code == 'playas'){
					/* Dado que los lugares de tipo 'playas' tienen una tabla propia usaremos una query específica cuando los estemos listando.*/
					sql =  "select playas.code, playas.nombre, playas.foto_listado as thumb, p.nombre as poblacion_nombre from playas, poblaciones p where playas.poblacion_fk=p.code";
				}
				else{
					sql =  "select l.code, l.nombre, l.foto_listado as thumb, p.nombre as poblacion_nombre from lugares l, poblaciones p where l.poblacion_fk=p.code and cat_fk='"+cat_padre_code+"'";					
				}		
				tx.executeSql(sql, [],
					function(tx, rs){
						rootPath	= get_root_path();						
						$('#listado_lugares_costadelsol .listado_lugares').empty();
						if(rs.rows.length != 0){
							height	= 0;
							for(i=0;i<rs.rows.length;i++){
								item					= rs.rows.item(i);
								lugar_code				= item.code;
								lugar_nombre			= item.nombre;
								lugar_thumb_url			= rootPath+"/"+item.thumb;
								lugar_poblacion_nombre	= item.poblacion_nombre;
								if(cat_padre_code == 'playas'){
									lugar_div	 = "<a href='javascript:void(0)' id='enlace_lugar' onclick='goto_playas_detalle(\""+lugar_nombre+"\", \""+lugar_poblacion_nombre+"\", \"costadelsol\")'>";									
								}
								else{
									lugar_div	 = "<a href='javascript:void(0)' id='enlace_lugar' onclick='goto_lugar_detalle(\""+cat_padre_code+"\", \""+cat_padre_nombre+"\", \""+lugar_nombre+"\", \""+lugar_poblacion_nombre+"\", \"costadelsol\")'>";	
								}
								
								lugar_div	+= "	<div class='lugar_div'>";
								lugar_div	+= "		<img class='thumb' src='"+lugar_thumb_url+"' />";
								lugar_div	+= "		<div class='nombre'>";
								lugar_div	+= 				lugar_nombre;
								lugar_div	+= "		</div>";
								lugar_div	+= "		<div class='flecha large'></div>";
								lugar_div	+= "	</div>";
								lugar_div	+= "</a>";
								$('#listado_lugares_costadelsol .listado_lugares').append(lugar_div);
								height += get_height('#listado_lugares_costadelsol .lugar_div');
							}
							new_listado_lugares_height_costadelsol	= height;
							$('#listado_lugares_costadelsol .listado_lugares').css("height", new_listado_lugares_height_costadelsol+"px");
						}
						else{
							alert("No results");
						}					
					}
				);
				tx.executeSql('select code, nombre from poblaciones', [],
					function(tx, rs){
						height	= 0;
						$('#listado_lugares_costadelsol .listado_poblaciones').empty();
						$('#listado_lugares_costadelsol .listado_poblaciones').append("<h2>"+get_multilang_label(lang, "municipios_key")+"</h2>");						
						for(i=0;i<rs.rows.length;i++){
							item				= rs.rows.item(i);
							poblacion_code		= item.code;
							poblacion_nombre	= item.nombre;
							poblacion_sanitized = sanitize(poblacion_nombre);
							poblacion_div	 = "<a href='javascript:void(0)' id='enlace_poblacion' onclick='goto_categoria_poblacion(\""+cat_padre_code+"\", \""+cat_padre_nombre+"\", \""+poblacion_nombre+"\")'>";
							poblacion_div	+= "	<div class='poblacion_div'>";
							poblacion_div	+= "		<div class='nombre' style='background:url(img/shared/botones/"+poblacion_sanitized+"/boton.png) no-repeat'>";
							poblacion_div	+= 				poblacion_nombre;
							poblacion_div	+= "		</div>";
							poblacion_div	+= "		<div class='flecha large'></div>";
							poblacion_div	+= "	</div>";
							poblacion_div	+= "</a>";		
							$('#listado_lugares_costadelsol .listado_poblaciones').append(poblacion_div);
							/* Variable donde vamos acumulando la altura que ocupan los elementos que vamos incluendo en la capa contenedora.*/
							height += get_height('#listado_lugares_costadelsol .poblacion_div');																								
						}

						new_listado_poblaciones_height_costadelsol	= height + get_height('#listado_lugares_costadelsol .listado_poblaciones h2');
						$('#listado_lugares_costadelsol .listado_poblaciones').css("height", new_listado_poblaciones_height_costadelsol+"px");												

						new_content_height	= new_listado_lugares_height_costadelsol + new_listado_poblaciones_height_costadelsol;
						$('#listado_lugares_costadelsol .content').css("height", new_content_height+"px");												
						
						new_page_height		= new_content_height + get_height('#listado_lugares_costadelsol .header');;
						$('#listado_lugares_costadelsol').css("height", new_page_height+"px");
						
						$('#listado_lugares_costadelsol .listado_poblaciones').css("margin-top", new_listado_lugares_height_costadelsol+" px");
					}
				);					
			}, 
			errorDB, 
			function(){
				show_view('#listado_lugares_costadelsol');	
			}
			
		);
	}

}

/**
 * Cargamos la info para la vista con el detalle de un determinado lugar (salvo que sea de tipo playa, que tiene su propio método)
 * 
 * @param cat_code
 * @param cat_nombre
 * @param lugar_nombre
 * @param poblacion_nombre
 * @param listado_back
 * @return
 */
function goto_lugar_detalle(cat_code, cat_nombre, lugar_nombre, poblacion_nombre, listado_back){
	/* El parámetro "listado_back" valdrá "costadelsol" o "poblacion" y nos servirá para formar el nombre de la función que hay que llamar con el botón "back"*/
	lang	= current_lang;

	/* Eliminamos las tildes y convertimos en minúsculas el nombre de la población. */
	poblacion_sanitized	= sanitize(poblacion_nombre);
	/* Eliminamos las tildes y convertimos en minúsculas el nombre de la población. */
	lugar_code	= sanitize(lugar_nombre);	
	

	
	/******************* GESTIÓN CABECERA ********************/		
	$('#'+cat_code+'_detalle').addClass("detalle_lugar_generico");
	$('#'+cat_code+'_detalle h1').text(lugar_nombre);
	$('#'+cat_code+'_detalle .header').css("background", "url(img/shared/degradados/"+poblacion_sanitized+"/header.png) repeat-x");
	
	$('#'+cat_code+'_detalle .back_button').css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");
	$('#'+cat_code+'_detalle .back_button').text(cat_nombre);
		
	$('#'+cat_code+'_detalle .map_button').css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");	
	$('#'+cat_code+'_detalle .map_button').text(get_multilang_label(lang, ver_mapa));		


	transaction(
		function(tx){
			tx.executeSql('select * from lugares where code=?', [lugar_code], 
				function(tx, rs){
					if(rs.rows.length>0){
						item					= rs.rows.item(0);
						lugar_foto_detalle		= item.foto_detalle;
						lugar_descripcion		= eval("item.descripcion_"+lang);
						lugar_direccion			= item.direccion;
						lugar_latitude			= item.latitude;
						lugar_longitude			= item.longitude;						
						
						$('#'+cat_code+'_detalle a#map_button').bind('click', 
							function(){			
								goto_mapa_lugar(poblacion_nombre, lugar_nombre, lugar_direccion, lugar_latitude, lugar_longitude)
							}
						);						

						var rootPath	= get_root_path();
						$('#'+cat_code+'_detalle .foto_detalle').empty().append("<img src='"+rootPath+"/"+lugar_foto_detalle+"' />");

						$('#'+cat_code+'_detalle .descripcion').empty().html("<p>"+parsea_br(lugar_descripcion)+"</p>");
					}
				}
			);	
		}, 
		errorDB, 
		function(){
			show_view('#'+cat_code+'_detalle');
		}
	);
}

/**
 * Método que muestra el widget del tiempo para la población que recibe por parámetro. También tiene en cuenta la resolución del dispositivo en el que se está ejecutando para cargar un widget u otro, con diferentes
 * anchuras.
 * 
 * @param poblacion_nombre
 * @return
 */
function goto_eltiempo(poblacion_nombre){
	poblacion_sanitized	= sanitize(poblacion_nombre);
	
	$('#eltiempo .back_button').css("background", "url(img/shared/botones/"+poblacion_sanitized+"/boton.png)");
	$('#eltiempo .back_button').text(get_multilang_label(current_lang, 'volver'));
	
	if(poblacion_nombre != 'costadelsol'){
		$('#eltiempo h1').text(poblacion_nombre);
	}
	else{
		$('#eltiempo h1').text(get_multilang_label(current_lang, ubicacion_actual));
	}

	$('#eltiempo .header').css("background", "url(img/shared/degradados/"+poblacion_sanitized+"/header.png) repeat-x");	

	oculta_capa("#eltiempo .ldpi");
	oculta_capa("#eltiempo .mdpi");
	oculta_capa("#eltiempo .hdpi");
	oculta_capa("#eltiempo .xhdpi");
	muestra_capa("#eltiempo ."+responsive_size);
	
	for(i=0; i<widgets_eltiempo.length; i++){
		eltiempo_div_id	= widgets_eltiempo[i];
		oculta_capa("#eltiempo ."+responsive_size+" #"+eltiempo_div_id);
	}	
	muestra_capa("#eltiempo ."+responsive_size+" #eltiempo_"+poblacion_sanitized);			

	show_view("#eltiempo");
}