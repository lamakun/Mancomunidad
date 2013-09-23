/* Variables globales varias de apoyo*/
var min_id;	
var local_max_id	= 0;
var sentencia_sql	= "";
var remote_url 		= "http://www.mytests.es/phonegap-db/";
var	connection		= null;
var current_lang	= "";
var array_categorias = new Array();
var responsive_size;
var original_page_height	= "";
var original_content_height	= "";
var original_categorias_height	= "";


var campos_iconos_playas = new Array('aseos', 'aseos_minusvalidos', 'bandera_azul', 'policia_local', 'aparcamiento', 'balizamiento', 'fuentes', 'calidad_turistica', 'informacion', 'duchas', 'lavapies', 'limpieza', 'papeleras', 'pasarelas', 'acceso_minusvalidos', 'vegetacion', 'bandera_peligro', 'telefono_publico', 'hoteles', 'paseo_maritimo', 'submarinismo', 'chiringuitos', 'calle_nautica', 'alquileres_nauticos', 'torre_vigilancia', 'megafonia', 'club_nautico');

var playa_longitud_label_key		= "longitud";
var tipo_arena_label_key			= "tipo_arena";
var n_hamacas_label_key				= "n_hamacas";
var puestos_de_salvamento_label_key	= "puestos_de_salvamento";
var tipo_acceso_label_key			= "tipo_acceso";
var categorias_key					= "categorias";
var municipios_key					= "municipios";
var ver_mapa						= "ver_mapa";
var volver							= "volver";
var playas							= "playas";
var ubicacion_actual				= "ubicacion_actual";


var label_translations_es	= 	{
									playa_longitud_label_key:"Longitud: ", 
									tipo_arena_label_key:"Arena: ", 
									n_hamacas_label_key:"Nº de hamacas", 
									puestos_de_salvamento_label_key:"Puestos de salvamento", 
									tipo_acceso_label_key:"Tipo de acceso",
									descripcion_costadelsol:"<p>Costa del Sol, situada en el sur de España es conocida por sus 160 kilómetros de litoral mediterráneo, clima templado y 300 días al año de sol garantizado.</p><p>Se encuentra en una zona de asombrosa belleza natural y ofrece complejos turísticos y actividades que se adaptan a todos los gustos.</p>",
									categorias_key:"Categorías",
									municipios_key:"Municipios",
									ver_mapa:"Mapa",
									volver:"Volver",
									playas:"Playas",
									ubicacion_actual:"Ubicación actual"
								};
								
var label_translations_en	= 	{
									playa_longitud_label_key:"Length: ", 
									tipo_arena_label_key:"Sand: ", 
									n_hamacas_label_key:"Nº de hamacas (en)", 
									puestos_de_salvamento_label_key:"Puestos de salvamento (en)", 
									tipo_acceso_label_key:"Tipo de acceso(en)",
									descripcion_costadelsol:"<p>Costa del Sol, situada en el sur de España es conocida por sus 160 kilómetros de litoral mediterráneo, clima templado y 300 días al año de sol garantizado.</p><p>Se encuentra en una zona de asombrosa belleza natural y ofrece complejos turísticos y actividades que se adaptan a todos los gustos.(en)</p>",
									categorias_key:"Categories",
									municipios_key:"Municipios (en)",
									ver_mapa:"Map",
									volver:"Back",
									playas:"Beaches",
									ubicacion_actual:"Current location"
								};

var label_translations_fr	= 	{
									playa_longitud_label_key:"Longitud (fr): ", 
									tipo_arena_label_key:"Arena (fr): ", 
									n_hamacas_label_key:"Nº de hamacas (fr)", 
									puestos_de_salvamento_label_key:"Puestos de salvamento(fr)", 
									tipo_acceso_label_key:"Tipo de acceso(fr)",
									descripcion_costadelsol:"<p>Costa del Sol, situada en el sur de España es conocida por sus 160 kilómetros de litoral mediterráneo, clima templado y 300 días al año de sol garantizado.</p><p>Se encuentra en una zona de asombrosa belleza natural y ofrece complejos turísticos y actividades que se adaptan a todos los gustos.(fr)</p>",
									categorias_key:"Categorías(fr)",
									municipios_key:"Municipios(fr)",
									ver_mapa:"Map(fr)",
									volver:"Volver (fr)",
									playas:"Playas (fr)",
									ubicacion_actual:"Ubicación actual (fr)"									
								};

var label_translations_de	= 	{
									playa_longitud_label_key:"Longitud (de): ", 
									tipo_arena_label_key:"Arena (de): ", 
									n_hamacas_label_key:"Nº de hamacas (de)", 
									puestos_de_salvamento_label_key:"Puestos de salvamento(de)", 
									tipo_acceso_label_key:"Tipo de acceso(de)",
									descripcion_costadelsol:"<p>Costa del Sol, situada en el sur de España es conocida por sus 160 kilómetros de litoral mediterráneo, clima templado y 300 días al año de sol garantizado.</p><p>Se encuentra en una zona de asombrosa belleza natural y ofrece complejos turísticos y actividades que se adaptan a todos los gustos.(de)</p>",
									categorias_key:"Categorías(de)",
									municipios_key:"Municipios(de)",
									ver_mapa:"Map(de)",
									volver:"Volver (de)",
									playas:"Playas (de)",
									ubicacion_actual:"Ubicación actual (de)"									
								};								
								
var label_translations_ru	= 	{
									playa_longitud_label_key:"Longitud (ru): ", 
									tipo_arena_label_key:"Arena (ru): ", 
									n_hamacas_label_key:"Nº de hamacas (ru)", 
									puestos_de_salvamento_label_key:"Puestos de salvamento(ru)", 
									tipo_acceso_label_key:"Tipo de acceso(ru)",
									descripcion_costadelsol:"<p>Costa del Sol, situada en el sur de España es conocida por sus 160 kilómetros de litoral mediterráneo, clima templado y 300 días al año de sol garantizado.</p><p>Se encuentra en una zona de asombrosa belleza natural y ofrece complejos turísticos y actividades que se adaptan a todos los gustos.(ru)</p>",
									categorias_key:"Categorías(ru)",
									municipios_key:"Municipios(ru)",
									ver_mapa:"Mapa(ru)",
									volver:"Volver (ru)",
									playas:"Playas (ru)",
									ubicacion_actual:"Ubicación actual (ru)"									
								};								


var	widgets_eltiempo		= new Array("eltiempo_benahavis", "eltiempo_benalmadena", "eltiempo_casares", "eltiempo_costadelsol", "eltiempo_estepona", "eltiempo_fuengirola", "eltiempo_istan", "eltiempo_marbella", "eltiempo_manilva", "eltiempo_mijas", "eltiempo_ojen", "eltiempo_torremolinos");


function get_multilang_label(lang, key){
	labels_array	= eval("label_translations_"+lang);
	translation		= eval("labels_array."+key);	
	
	return translation;
}

function update_responsive_size(){
	var width = $(window).width();
	if (width <= 240) {
		responsive_size = "ldpi";
	}	
	else if (width > 240 && width < 480) {
		responsive_size = "mdpi";
	}
	else if (width >= 480 && width < 640) {
		responsive_size = "hdpi";
	}	
	else {
		responsive_size = "xhdpi";
	}
	//alert("responsive size: " + responsive_size);
}

/************************************* MÉTODOS DE INICIALIZACIÓN ************************************/
function wait(){
	if(navigator.userAgent.indexOf('Chrome')!==-1){
		goto_home();
	}
	else{
		document.addEventListener("deviceready", goto_home, false);
	}
}

	function shared_init(){
		update_responsive_size();	
	}
	
	
	/************************************* INICIALIZACIÓN PRODUCCIÓN ************************************/
	
		
		/************************************* INICIALIZACIÓN BD LOCAL ************************************/
		function initDB(){
			/* En desarrollo estoy poniendo a 0 esta variable persistente (que debe controlar el id de la última query ejecutada, para ejecutar sólo las posteriores) para forzar la ejecución de todas las queries que
			 * recupera de la bd remota.*/
			//window.localStorage.setItem("local_max_id", 0);
			// Used to see which has been the last sql_sentence id executed locally  
			local_max_id	= window.localStorage.getItem("local_max_id");
		
			if(local_max_id == null){
				local_max_id= 0;
			}
			
			//Call to retrieve the highest id in remote database
			$.post(remote_url+"get-db.php", {exec:"max_id"}, treat_max_id, "json").error(
						function(){
							alert("error");
							oculta_capa("#loading_div");
							oculta_capa("#loading_message");
							$("#home").css('background-image', 'url(img/shared/home/bg.jpg)');
							muestra_capa("#language_links");							
						});
		}
		
		
		//Method that decides what to do depending on returned remote_max_id value and local_max_id.
		function treat_max_id(remote_max_id){
			if(remote_max_id > local_max_id){
				$.post(remote_url+"get-db.php", {exec:"get_sentencias", "min_id":local_max_id}, 
					function(res) {
						if(res){
							transaction(
								function(tx){
									for(j=0;j<res.length;j++){
										sentencia_sql	= res[j].sentencia;
										lugar_code_id	= res[j].lugar_code_id;
										tx.executeSql(sentencia_sql);
										//alert(navigator.userAgent);
										//if(navigator.userAgent.indexOf('Chrome')===-1){
										if(navigator.userAgent.indexOf('Mozilla')===-1){
											if(res[j].foto_listado_actual){
												download_img(res[j].foto_listado_actual, res[j].foto_listado_anterior);
											}
											if(res[j].foto_detalle_actual){
												download_img(res[j].foto_detalle_actual, res[j].foto_detalle_anterior);
											}								
										}
									}
									window.localStorage.setItem("local_max_id", remote_max_id);
								},
								errorDB,
								function(){
									oculta_capa("#loading_div");
									oculta_capa("#loading_message");
									$("#home").css('background-image', 'url(img/shared/home/bg.jpg)');
									muestra_capa("#language_links");									
								}
							);
						}
						else{
							alert("No se ha recuperado resultado de get-db.php/get_sentencias");
							console.error("No se ha recuperado resultado de get-db.php/get_sentencias");
						}
					},"json"
				).error(
						function(){
							oculta_capa("#loading_div");
							oculta_capa("#loading_message");
							$("#home").css('background-image', 'url(img/shared/home/bg.jpg)');
							muestra_capa("#language_links");							
						});
				
			}	
			else{
				alert("remote_max_id <= local_max_id");
				oculta_capa("#loading_div");
				oculta_capa("#loading_message");
				$("#home").css('background-image', 'url(img/shared/home/bg.jpg)');
				muestra_capa("#language_links");			
			}
		}

		function download_img(imgToDownload, imgToRemove){
			var url = remote_url+imgToDownload; // image url
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
				function (fs) {
					var imageToDownloadPath = fs.root.fullPath + "/" + imgToDownload; // full file path
					var imageToRemovePath = fs.root.fullPath + "/" + imgToRemove; // full file path			
		
					try{				 
						var fileTransfer = new FileTransfer();
						fileTransfer.download(url, imageToDownloadPath, 
							function (entry) {
								if(imgToRemove != "" && imgToRemove != null){
									var entry = new FileEntry("foo", imageToRemovePath);
									entry.remove(function (){}, function (){});
								}
							}, 
							function (error) {
								alert("code: " + error.code + " --- source: " + error.source + " --- target: " + error.target + " --- httpcode: " + error.http_status);
							}
						);
					}catch(error){
						alert("Error capturado: "+error.message);
					}				
				},function(error){
					alert("error en requestFileSystem: " + error.code);
				}
			);			
		}
		
	/************************************* INICIALIZACIÓN TEST ************************************/
	function init_chrome(){
		initDB();
		shared_init();		
	}
	

		
/************************************* MANEJO BD ************************************/
function getDatabase(){
	
	connection	= window.openDatabase("Mancomunidad", "1.0", "mancomunidad", 200000);
	
	//connection = window.openDatabase("Mancomunidad", "", "mancomunidad", 25000000);
}

function transaction(fn, err, suc){
	if(connection == null){
		getDatabase();
	}		
	connection.transaction(fn, err, suc);
}

/************************************* FUNCIONES AUXILIARES ************************************/

function elimina_tildes(str){
	str = str.replace(/\á/g,'a');
	str = str.replace(/\é/g,'e');
	str = str.replace(/\í/g,'i');
	str = str.replace(/\ó/g,'o');
	str = str.replace(/\ú/g,'u');

	str = str.replace(/\&aacute;/g,'a');
	str = str.replace(/\&eacute;/g,'e');
	str = str.replace(/\&iacute;/g,'i');
	str = str.replace(/\&oacute;/g,'o');
	str = str.replace(/\&uacute;/g,'u');

	str = str.replace(/\A/g,'Á');
	str = str.replace(/\E/g,'É');
	str = str.replace(/\I/g,'Í');
	str = str.replace(/\O/g,'Ó');
	str = str.replace(/\U/g,'Ú');

	str = str.replace(/\&Aacute;/g,'Á');
	str = str.replace(/\&Eacute;/g,'É');
	str = str.replace(/\&Iacute;/g,'Í');
	str = str.replace(/\&Oacute;/g,'Ó');
	str = str.replace(/\&Uacute;/g,'Ú');

	str = str.replace(/\ñ/g,'n');
	str = str.replace(/\Ñ/g,'N');
	str = str.replace(/\&ntilde;/g,'n');
	str = str.replace(/\&ntilde;/g,'N');

	str = str.replace(/\ü/g,'u');
	str = str.replace(/\Ü/g,'U');
	str = str.replace(/\&uuml;/g,'u');
	str = str.replace(/\&Uuml;/g,'U');	
	
	return str;				
}

function sanitize(str){
	str = str.replace(/\ /g,'_');
	return elimina_tildes(str.toLowerCase());
}

function parsea_br(str){
	str = str.replace(/\&lt;br&gt;/g,'</p><p>');
	str = str.replace(/\&lt;/g,'<');
	str = str.replace(/\&gt;/g,'>');
	return str;
}

/**
 * Devuelve el valor numérico de la altura de un elemento identificado por selector, (sin las unidades). 
 * 
 * @param selector
 * @return
 */
function get_height(selector){
	if($(selector).css("height")){
		sHeight			= $(selector).css("height");
		sBorderBottom	= $(selector).css("border-bottom");
		sBorderTop		= $(selector).css("border-top");
			
		height			= parseInt(sHeight.split('px')[0]);	
		if(sBorderBottom){
			border_bottom	= parseInt(sBorderBottom.split('px')[0]);				
		}
		else{
			border_bottom	= 0;
		}

		if(sBorderTop){
			border_top		= parseInt(sBorderTop.split('px')[0]);				
		}
		else{
			border_top = 0;
		}
		full_height		= height + border_bottom + border_top+4;
	}
	else{
		full_height	= 0;
	}
	
	return full_height;
}

function get_root_path(){
	root_path	= "";
	if(navigator.userAgent.indexOf('Chrome')!==-1){
		root_path = "http://mytests.es/phonegap-db/";
	}
	else{
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function (fs) {
				root_path = fs.root.fullPath;
			}
		);
	}
	return root_path;		
}

function oculta_capa(div_id){
	$(div_id).css('visibility', 'hidden');
	$(div_id).css('display', 'none');	
}

function muestra_capa(div_id){
	$(div_id).css('visibility', 'visible');
	$(div_id).css('display', 'block');	
}