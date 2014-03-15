var map;
var markers=[];
var host= 'http://taman.yolo.co.id/';
var namaTaman, alamatTaman, telpTaman, desTaman, namaTanaman, kerajaan, kelas, filum, ordo, famili, genus, spesies, namaBinomial, desTanaman; 

var adapter = new LocalStorageAdapter();
adapter.initialize();
//LIST TAMAN
$("#page-index a:jqmData(id=btn-cari)").bind ("click", function (event){
	loadListTaman();
	$.mobile.changePage($("#page-cari"));
});

$("#txt-cariTaman").live("change", function(event, ui){
	loadListTaman();
});

function loadListTaman(){
	var datapost = $("#page-cari input:jqmData(id=txt-cari)").val();
	var data = adapter.cariTaman(datapost);
	$("#list-cari").html("");
	$.each(data, function(i,item){ 
		var taman = '<tr>'+
		'<td width="150px">'+
		'<img src="image/taman/'+item.ID_TAMAN+'.jpg" width=150px height=150px/>'+
		'</td>'+
		'<td>'+
		'<a href="#" rel="'+item.ID_TAMAN+'" class="taman"><h1>'+item.NAMA_TAMAN+'</a></h1><br/>'+
		item.ALAMAT+'<br/>'+
		'Ratings'+
		'<td>'+
		'<tr>';
		
		$("#list-cari").append(taman);
	});
};

//DETAIL TAMAN
$(".taman").live("click",function(event)
{
	var id = $(this).attr("rel");
	var data = adapter.detailTaman(id);
	$.each(data, function(i, item){
		var taman= '<tr style="background-color:#3F3">'+
			'<td colspan = "2"><center><b>Informasi</b></center></td>'+
		'</tr>'+
		'<tr><td>Map</td><td>'+item.ALAMAT+'</td></tr>'+
		'<tr><td><img src="img/icon/icon-phone.png" width="25" height="25"/></td><td>'+item.TELP+'</td></tr>'+
		'<tr>'+
			'<td><img src="img/icon/icon-point.png" width="25" height="25"/></td>'+
			'<td><a href="#">Point Me There</a></td>'+
		'</tr>';
		$("#detailTaman").html(taman);
		$("#gambarTaman").attr("src", 'image/taman/'+item.ID_TAMAN+'.jpg');
		$("#txt-desTaman").html(item.DESKRIPSI_TAMAN);
		$("#txt-namaTaman").html(item.NAMA_TAMAN);
		$("#page-taman a:jqmData(id=galleryTaman)").attr("rel", item.ID_TAMAN);
		$.mobile.changePage ($("#page-taman"));
		namaTaman = item.NAMA_TAMAN;
		alamatTaman= item.ALAMAT;
		telpTaman = item.TELP;
		desTaman = item.DESKRIPSI_TAMAN;
	});
});

$("#page-taman a:jqmData(id=galleryTaman)").live("click", function(){
	var id = $("#page-taman a:jqmData(id=galleryTaman)").attr("rel");
	var data = adapter.galleryTaman(id);
	$("#page-gallery a:jqmData(id=txt-namaGallery)").html($("#txt-namaTaman"));
	$("#content-gallery").html('');
	$("#txt-namaGalery").html(namaTaman);
	$.each(data, function(i, item){
		var taman= '<div class="gallery-item">'+
		'<a href="image/taman/gallery/'+item.ID_GALLERY_TAMAN+'.jpg" rel="external">'+
			'<img src="image/taman/gallery/'+item.ID_GALLERY_TAMAN+'.jpg" alt="'+item.NAMA_GALLERY_TAMAN+'" >'+
		'</a></div>';
		$("#content-gallery").append(taman);
		
	});
	$.mobile.changePage ($("#page-gallery"));
	$("div.gallery a").photoSwipe();
});


//GOOGLE MAP
$("#page-index a:jqmData(id=btn-map)").bind ("click", function (event)
{
  var latlng = new google.maps.LatLng (-7.260074, 112.746962);
  var options = { 
    zoom : 15, 
    center : latlng, 
    mapTypeId : google.maps.MapTypeId.ROADMAP 
  };
  var $content = $("#page-map div:jqmData(role=content)");
  $content.height (screen.height - 175);
  map = new google.maps.Map ($content[0], options);
  $.mobile.changePage ($("#page-map"));
  
  google.maps.event.addListenerOnce(map, 'idle', function(){
		google.maps.event.trigger(map, 'resize');
		map.setCenter(latlng);
	});
	
	findMarker();
   
});

function findMarker(){
	deleteMarkers();
	var datapost = $("#page-map input:jqmData(id=txt-cari)").val();
	var data = adapter.cariTaman(datapost);
	$.each(data, function(i,item){ 
		var location = new google.maps.LatLng(item.LATITUDE, item.LONGITUDE);
		var nama = item.NAMA_TAMAN;
		var alamat = item.ALAMAT;
		addMarker(location, nama, alamat);
	});
}

function addMarker(location, nama, alamat) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
	animation: google.maps.Animation.DROP,
	clickable: true
  });
  
	marker.info = new google.maps.InfoWindow({
	  content: '<h1>'+nama+'</h1> <br/>' + 
	  '<h3>'+alamat+'</h3>'
	});
	
	google.maps.event.addListener(marker, 'click', function() {
	  marker.info.open(map, marker);
	});
  markers.push(marker);
}

function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setAllMap(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

$("#page-map input:jqmData(id=txt-cari)").live("change", function(event, ui){
	findMarker();
});

//DETAIL TANAMAN+QRCODE
$("#page-index a:jqmData(id=btn-scan)").bind("click", function(event){
	var scanner = cordova.require("com.phonegap.plugins.barcodescanner.BarcodeScanner");
	scanner.scan( function (result) { 
		if(!result.cancelled)
		findDetailTanaman(result.text);
		/*alert("We got a barcode\n" + 
		"Result: " + result.text + "\n" + 
		"Format: " + result.format + "\n" + 
		"Cancelled: " + result.cancelled);*/  
	}, function (error) { 
		console.log("Scanning failed: ", error); 
	} );
});

function findDetailTanaman(qr){
	var ketemu = false;
	var data = adapter.detailTanaman(qr);
	$.each(data, function(i,item){ 
		$.mobile.changePage ($("#page-tanaman"));
		ketemu = true;
		var tanaman= '<tr style="background-color:#3F3">'+
			'<td colspan = "2"><center><b>Klasifikasi Ilmiah</b></center></td>'+
		'</tr>'+
		'<tr><td>Kerajaan</td><td>'+item.KERAJAAN+'</td></tr>'+
		'<tr><td>Filum</td><td>'+item.FILUM+'</td></tr>'+
		'<tr><td>Kelas</td><td>'+item.KELAS+'</td></tr>'+
		'<tr><td>Ordo</td><td>'+item.ORDO+'</td></tr>'+
		'<tr><td>Famili</td><td>'+item.FAMILI+'</td></tr>'+
		'<tr><td>Genus</td><td>'+item.GENUS+'</td></tr>'+
		'<tr><td>Spesies</td><td>'+item.SPESIES+'</td></tr>'+
		'<tr style="background-color:#3F3">'+
			'<td colspan="2"><center><b>Nama Binomial</b></center></td>'+
		'</tr>'+
		'<tr>'+
			'<td colspan="2"><center>'+item.BINOMIAL+'</center></td>'+
		'</tr>';
		$("#detailTanaman").html(tanaman);
		$("#gambarTanaman").attr("src",'image/tanaman/'+item.ID_TUMBUHAN+'.jpg');
		$("#txt-desTanaman").html(item.DESKRIPSI_TUMBUHAN);
		$("#txt-namaTanaman").html(item.NAMA_TUMBUHAN);
		$("#page-tanaman a:jqmData(id=galleryTanaman)").attr("rel", item.ID_TUMBUHAN)
		namaTanaman = item.NAMA_TUMBUHAN;
		kerajaan = item.KERAJAAN;
		filum = item.FILUM;
		kelas = item.KELAS;
		ordo = item.ORDO;
		famili = item.FAMILI;
		genus = item.GENUS;
		spesies = item.SPESIES;
		namaBinomial = item.BINOMIAL;
		desTanaman = item.DESKRIPSI_TUMBUHAN;
	});
	if (!ketemu)alert("QRCODE TIDAK DITEMUKAN DALAM DATABASE");
};

$("#page-tanaman a:jqmData(id=galleryTanaman)").live("click", function(){
	var id = $("#page-tanaman a:jqmData(id=galleryTanaman)").attr("rel");
	alert(id);
	var data = adapter.galleryTanaman(id);
	
	$("#page-gallery a:jqmData(id=txt-namaGallery)").html($("#txt-namaTanaman"));
	$("#content-gallery").html('');
	$("#txt-namaGalery").html(namaTanaman);
	$.each(data, function(i, item){
		var tanaman= '<div class="gallery-item">'+
		'<a href="image/tanaman/gallery/'+item.ID_GALLERY_TUMBUHAN+'.jpg" rel="external">'+
			'<img src="image/tanaman/gallery/'+item.ID_GALLERY_TUMBUHAN+'.jpg" alt="'+item.NAMA_GALLERY_TUMBUHAN+'" >'+
		'</a></div>';
		$("#content-gallery").append(tanaman);
		
	});
	$.mobile.changePage ($("#page-gallery"));
	$("div.gallery a").photoSwipe();
});

//SHARE
$("#page-taman a:jqmData(id=shareTaman)").live("click", function(){
	socialsharing("taman");
});

$("#page-tanaman a:jqmData(id=shareTanaman)").live("click", function(){
	socialsharing("tanaman");
});


function socialsharing(type) {
	//window.plugins.socialsharing.share("testing", null, null, null);
window.plugins.socialsharing.available(function(isAvailable) {
	if (isAvailable) {
		if(type=="taman")
		{
			var txt = namaTaman+'\n'+
			'Alamat: '+alamatTaman+'\n'+
			'No Telepon: '+telpTaman+'\n'+
			'Deskripsi Taman:\n'+desTaman;
			var image= 'www/'+$("#gambarTaman").attr("src");
			window.plugins.socialsharing.share(txt, null, image, null);
		}
		if(type == "tanaman")
		{
			var txt = namaTanaman+'\n'+
			'Kerajaan: '+kerajaan+'\n'+
			'Filum: '+filum+'\n'+
			'Kelas: '+kelas+'\n'+
			'Ordo: '+ordo+'\n'+
			'Famili: '+famili+'\n'+
			'Genus: '+genus+'\n'+
			'Spesies: '+spesies+'\n'+
			'Nama Binomial: '+namaBinomial+'\n'+
			'Deskripsi Tanaman: \n'+desTanaman;
			var image= 'www/'+$("#gambarTanaman").attr("src");
			window.plugins.socialsharing.share(txt, null, image, null);
		}
	
	}
});
	
};