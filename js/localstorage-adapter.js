var LocalStorageAdapter = function () {

    this.initialize = function() {
        var deferred = $.Deferred();
        // Store sample data in Local Storage
        window.localStorage.setItem("TAMAN", JSON.stringify(
            [{"ID_TAMAN":"1","NAMA_TAMAN":"Taman Bungkul","LATITUDE":"-7.290959","LONGITUDE":"112.739675","ALAMAT":"JL. Raya Darmo","DESKRIPSI_TAMAN":"TAMAN YANG DIBERI NAMA DARI TOKOH PENYEBARAN AGAMA ISLAM","TELP":"+62-31-5967387"},
			{"ID_TAMAN":"2","NAMA_TAMAN":"Taman Apsari","LATITUDE":"-7.264182","LONGITUDE":"112.742842","ALAMAT":"genteng","DESKRIPSI_TAMAN":null,"TELP":null}]
        ));
		window.localStorage.setItem("TUMBUHAN", JSON.stringify(
		[{"ID_TUMBUHAN":"1","ID_TAMAN":"1","NAMA_TUMBUHAN":"Pohon Pisang","KERAJAAN":"enggak tau","FILUM":"enggak tau","KELAS":"enggak tau","ORDO":"enggak tau","FAMILI":"enggak tau","GENUS":"enggak tau","SPESIES":"enggak tau","BINOMIAL":"enggak tau","THUMBNAIL":null,"DESKRIPSI_TUMBUHAN":"tanaman ini banyak di jumpai di mana pun berada.","QR_CODE":"ceb6566a25f238344b444ff7dff2f9a4"},{"ID_TUMBUHAN":"2","ID_TAMAN":"2","NAMA_TUMBUHAN":"Pohon Mangga","KERAJAAN":"test","FILUM":"test","KELAS":"test","ORDO":"test","FAMILI":"test","GENUS":"test","SPESIES":"test","BINOMIAL":"test","THUMBNAIL":null,"DESKRIPSI_TUMBUHAN":"Tanaman ini memiliki buah yang sangat lezat.","QR_CODE":"37c0cb987e8a10c462d6b558eb39194d"}]
		));
		window.localStorage.setItem("GALLERY_TAMAN", JSON.stringify(
		[{"ID_GALLERY_TAMAN":"1","ID_TAMAN":"1","NAMA_GALLERY_TAMAN":"Bungkul Malam Hari"},{"ID_GALLERY_TAMAN":"2","ID_TAMAN":"1","NAMA_GALLERY_TAMAN":"Halaman Tengah Bungkul"},{"ID_GALLERY_TAMAN":"3","ID_TAMAN":"1","NAMA_GALLERY_TAMAN":"Halaman Depan Bungkul"},{"ID_GALLERY_TAMAN":"4","ID_TAMAN":"2","NAMA_GALLERY_TAMAN":"Patung Apsari"}]
		));
		window.localStorage.setItem("GALLERY_TUMBUHAN", JSON.stringify(
		[{"ID_GALLERY_TUMBUHAN":"1","ID_TUMBUHAN":"1","NAMA_GALLERY_TUMBUHAN":"Pohon Pisang"},{"ID_GALLERY_TUMBUHAN":"2","ID_TUMBUHAN":"2","NAMA_GALLERY_TUMBUHAN":"Pohon Mangga"}]
		));
    }

    this.cariTaman = function (searchKey) {
        var taman = JSON.parse(window.localStorage.getItem("TAMAN"));
        var result = taman.filter(function (element) {
                return element.NAMA_TAMAN.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
            });
        return result;
    }
	
	this.detailTaman = function (searchKey) {
        var taman = JSON.parse(window.localStorage.getItem("TAMAN"));
        var result = taman.filter(function (element) {
                return element.ID_TAMAN == searchKey;
            });
        return result;
    }
	
	this.detailTanaman = function (searchKey) {
        var tanaman = JSON.parse(window.localStorage.getItem("TUMBUHAN"));
        var result = tanaman.filter(function (element) {
                return element.QR_CODE==searchKey ;
            });
        return result;
    }
	
	this.galleryTaman = function (searchKey) {
        var gallery = JSON.parse(window.localStorage.getItem("GALLERY_TAMAN"));
        var result = gallery.filter(function (element) {
                return element.ID_TAMAN == searchKey;
            });
        return result;
    }
	
	this.galleryTanaman = function (searchKey) {
        var gallery = JSON.parse(window.localStorage.getItem("GALLERY_TUMBUHAN"));
        var result = gallery.filter(function (element) {
                return element.ID_TUMBUHAN == searchKey;
            });
        return result;
    }

}