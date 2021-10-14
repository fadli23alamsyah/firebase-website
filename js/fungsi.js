let fStore = firebase.firestore()
let firebaseRef = firebase.database().ref()
let fStorage = firebase.storage().ref()

function signIn(){
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    
    if(email==="" || password===""){
        Swal.fire({
            icon: 'error',
            title: 'Email atau password kosong',
            showConfirmButton: false,
            timer: 2000
        })
    }else{
        firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {
            fStore.doc(`users/${success.user.uid}`).get().then((data)=>{
                if(data.data().level == 'admin'){
                    Swal.fire({
                        type: 'successfull',
                        title: 'Succesfully signed in', 
                        showConfirmButton: false,
                        timer: 2000
                    }).then((value) => {
                        // setTimeout(function(){
                        window.location.replace("./dashboard.html");
                        // }, 1000)
                    });
                }else{
                    Swal.fire({
                        type: 'error',
                        title: `Anda bukan admin`, 
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            })
        }).catch((error) => {
            Swal.fire({
                type: 'error',
                title: 'Gagal',
                text: "Autentikasi Gagal",
            })
        });
    }
}

function signOut(){
    firebase.auth().signOut().then(() => {
        Swal.fire({
            type: 'successfull',
            title: `Anda logout`, 
            showConfirmButton: false,
            timer: 2000
        }).then((val)=>{
            window.location.replace("./index.html");
        })
    }).catch((error) => {
        console.log(error)
    });
}

function getDashboard(){
    fStore.collection(`users`).where('level','==','courier').get().then((datas)=>{
        let jKurir = 0
        datas.forEach((data)=>{
            jKurir += 1
        })
        document.getElementById("jKurir").innerHTML = jKurir
    })
    fStore.collection(`users`).where('level','==','user').get().then((datas)=>{
        let jKustomer = 0
        datas.forEach((data)=>{
            jKustomer += 1
        })
        document.getElementById("jKustomer").innerHTML = jKustomer
    })
}

function getKurir(){
    new swal({
        title: 'Get Data Kurir',
        allowOutsideClick: false,
        didOpen: function () {
            swal.showLoading()
        },timer:1000
    }).then(function () {
        let tabel = $('#dataTable').DataTable();

        fStore.collection(`users`).get().then((datas)=>{
            datas.forEach((data)=>{
                if(data.data().level == 'courier'){
                    let no = (data.data().nomor == '' || data.data().nomor == undefined) ? '-' : data.data().nomor
                    let alamat = (data.data().alamat == '' || data.data().alamat == undefined) ? '-' : data.data().alamat
                    tabel.row.add([
                        data.data().nama,
                        no,
                        alamat,
                        `<img src="${data.data().imageURL}" width="50%">`,
                        `<a href="javascript:void(0)" onclick="aksiKurir('${data.data().uid}')" class="btn btn-info btn-circle btn-sm">
                        <i class="fas fa-edit"></i>
                        `,
                    ]).draw();
                }
            })
            // document.getElementById("data-kurir").appendTo = dataKurir
        })
    })
}

function aksiKurir(id = ''){
    let judul = 'Tambah Kurir'
    let email = ''
    let nama = ''
    let nomor = ''
    let alamat = ''
    if(id){
        judul = 'Edit Kurir'
        fStore.doc(`users/${id}`).get().then((data)=>{
            let modalKurir = 
            `
                <div class="modal fade" id="kurirModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">${judul}</h5>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form class="user">
                                <input type="hidden" id="fotolama" value="${data.data().imageURL}" disabled>
                                    <div class="form-group">
                                        <input type="email" class="form-control" id="email"
                                            placeholder="Email Address" value="${data.data().email}" disabled>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="nama"
                                            placeholder="Nama" value="${data.data().nama}">
                                    </div>
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="nohp"
                                            placeholder="Nomor Hp" value="${data.data().nomor}">
                                    </div>
                                    <div class="form-group">
                                        <input type="text" class="form-control" id="alamat"
                                            placeholder="Alamat" value="${data.data().alamat}">
                                    </div>
                                    <div class="form-group">
                                        <input type="file" accept="image/*" class="form-control" id="foto">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <a class="btn btn-primary" href="javascript:void(0)" onclick="simpan('${id}')">Simpan</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
            document.getElementById("modal-kurir").innerHTML = modalKurir
            $("#kurirModal").modal()
        })
    }else{
        let modalKurir = 
        `
            <div class="modal fade" id="kurirModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">${judul}</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form class="user">
                                <div class="form-group">
                                    <input type="email" class="form-control" id="email"
                                        placeholder="Email Address" value="${email}">
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control" id="nama"
                                        placeholder="Nama" value="${nama}">
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control" id="nohp"
                                        placeholder="Nomor Hp">
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control" id="alamat"
                                        placeholder="Alamat">
                                </div>
                                <div class="form-group">
                                    <input type="file" accept="image/*" class="form-control" id="foto">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <a class="btn btn-primary" href="javascript:void(0)" onclick="simpan('${id}')">Simpan</a>
                        </div>
                    </div>
                </div>
            </div>
        `
        document.getElementById("modal-kurir").innerHTML = modalKurir
        $("#kurirModal").modal()
    }
}

function simpan(id = ''){
    let email = document.getElementById("email").value
    let nama = document.getElementById("nama").value
    let nohp = document.getElementById("nohp").value
    let alamat = document.getElementById("alamat").value
    let foto = document.getElementById("foto")
    let fotolama = document.getElementById("fotolama").value

    if(email==="" || nama==="" || nohp==="" || alamat===""){
        Swal.fire({
            icon: 'error',
            title: 'Terdapat input kosong',
            showConfirmButton: false,
            timer: 2000
        })
    }else if(id === '' && foto.value === ''){
        Swal.fire({
            icon: 'error',
            title: 'Silahkan upload foto',
            showConfirmButton: false,
            timer: 2000
        })
    }else{
        if(id === ''){            
            firebase.auth().createUserWithEmailAndPassword(email,'123456').then((success)=>{
                fStorage.child(`Profle image/${success.user.uid}`).put(foto.files[0]).then((oke)=>{
                    oke.ref.getDownloadURL().then((url)=>{
                        fStore.doc(`users/${success.user.uid}`).set({
                            imageURL: url,
                            level: "courier",
                            nama: nama,
                            nomor: nohp,
                            alamat: alamat,
                            email: email,
                            uid: success.user.uid
                        }).then((suksess)=>{
                            Swal.fire({
                                type: 'successfull',
                                title: 'Berhasil menambahkan kurir', 
                                showConfirmButton: false,
                                timer: 2000
                            }).then((value) => {
                                window.location.replace("./kurir.html")
                            });
                        })
                    })
                })
            }).catch((error) => {
                Swal.fire({
                    type: 'error',
                    title: 'Gagal',
                    text: error,
                })
            });
        }else{
            if(foto.value === ''){
                fStore.doc(`users/${id}`).set({
                    imageURL: fotolama,
                    level: "courier",
                    nama: nama,
                    nomor: nohp,
                    alamat: alamat,
                    email: email,
                    uid: id
                }).then((suksess)=>{
                    Swal.fire({
                        type: 'successfull',
                        title: 'Berhasil update kurir', 
                        showConfirmButton: false,
                        timer: 2000
                    }).then((value) => {
                        window.location.replace("./kurir.html")
                    });
                }).catch((error) => {
                    Swal.fire({
                        type: 'error',
                        title: 'Gagal',
                        text: error,
                    })
                })
            }else{
                // fStorage.child(`Profle image/${id}`).delete().then((del)=>{
                //     console.log('oke')
                // })
                fStorage.child(`Profle image/${id}`).put(foto.files[0]).then((oke)=>{
                    oke.ref.getDownloadURL().then((url)=>{
                        fStore.doc(`users/${id}`).set({
                            imageURL: url,
                            level: "courier",
                            nama: nama,
                            nomor: nohp,
                            alamat: alamat,
                            email: email,
                            uid: id
                        }).then((suksess)=>{
                            Swal.fire({
                                type: 'successfull',
                                title: 'Berhasil update kurir', 
                                showConfirmButton: false,
                                timer: 2000
                            }).then((value) => {
                                window.location.replace("./kurir.html")
                            });
                        })
                    })
                }).catch((error) => {
                    Swal.fire({
                        type: 'error',
                        title: 'Gagal',
                        text: error,
                    })
                })
            }
        }
    }
}

class User {
    constructor(nama, email, alamat, nomor) {
        this.nama = nama
        this.email = email
        this.alamat = alamat
        this.nomor = nomor
    }

    getNama(){
        return this.nama
    }
    getEmail(){
        return this.email
    }
    getAlamat(){
        return this.alamat
    }
    getNomor(){
        return this.nomor
    }
}