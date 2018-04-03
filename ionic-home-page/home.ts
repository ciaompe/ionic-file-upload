import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public files = [];
  private fileCount = 0;
  public server_url = "http://192.168.1.100:8888/ionic-upload/"; //change your server ip
   
  constructor(private transfer: FileTransfer,private camera: Camera, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private http: HTTP) {
  }

  upload():void {

    let camOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
  
    this.camera.getPicture(camOptions).then((imageData) => {

      let loader = this.loadingCtrl.create({
        content: "Uploading..."
      });
      loader.present();

      const fileTransfer: FileTransferObject = this.transfer.create();
    
      let fileOptions: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'name.jpg',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }
    
      fileTransfer.upload(imageData, this.server_url+'upload.php', fileOptions)
        .then((data) => {
        var fileData = JSON.parse(data.response);
        //add uploaded file data to files
        this.files[this.fileCount] = {
            id : this.fileCount,
            name : fileData.name
        };
        //increment file count
        this.fileCount = this.fileCount + 1;

        loader.dismiss();
        this.presentToast("Image uploaded successfully");

      }, (err) => {
        loader.dismiss();
        this.presentToast(err);
      });

    }, (err) => {
      this.presentToast(err);
    });
  }

  remove(file):void {
    let index = this.files.indexOf(file);

    this.http.get(this.server_url+'/delete.php?name='+file.name, {}, {}).then(data => {
      this.presentToast('File Deleted');
    }).catch(err => { 
      this.presentToast(err);
    });

    if(index > -1){
      this.files.splice(index, 1);
      //decrement file count
      this.fileCount = this.fileCount - 1;
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

}
