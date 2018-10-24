import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

interface ImageObj {
  img: Image,
  displayed: boolean;
}

interface Image {
  author: string;
  author_id: number;
  date_taken: Date;
  description: string;
  link: string;
  media: {
    m: string;
  }
  published: string;
  tags: string;
  title: string;
}
export interface DataResponse {
  items: any;
}
@Component({
  selector: 'app-flickr',
  templateUrl: './flickr.component.html',
  styleUrls: ['./flickr.component.scss']
})
export class FlickrComponent implements OnInit {
  allImages: any[];
  usedImages: boolean[];
  copyImages: ImageObj[];
  selectedImage: ImageObj;
  timeOut: any[] = [];
  interval: any;
  resp: DataResponse;
  headers: any;

  constructor(private httpService: HttpService) { }

  removeDuplicates() {
    // checking if we have items on allImage
    if (this.allImages.length < 1) {
      this.allImages = new Array();
      return void [0];
    }
    //copy allImages in to copyImages array and reset allImages to new array
    this.copyImages = Object.assign(this.allImages);
    this.allImages = new Array();
    /* looping over copyImages to check if specific imahe is exist
     * Assuming that there is no image with the same author_id and title
     * if not exise, push the image to allImages array
     **/
    this.copyImages.map(img => {
      if (!this.isExistImage(img.img.author_id, img.img.title)) {
        this.allImages.push(img);
      }
    });
    this.usedImages = new Array(this.allImages.length);
  }
  /* looping over the copyImages array to check the existimg of specific image
    * by author_id and title
    **/
  isExistImage(imgId: number, name: string): boolean {
    if (this.copyImages.length < 1) return false;
    this.copyImages.forEach(img => {
      if (img.img.author_id === imgId && img.img.title === name) {
        return true;
      }
      return false;
    });
  }

  doRefreshImage() {
    let self = this;
    self.interval = setInterval(() => {
      this.timeOut.push(self.interval);
      self.setImage();
      self.clearIntervals();
    }, 5000);

  }

  setImage() {
    // check if there is interval and clear it
    this.clearIntervals();
    let isFirstTimeCall: boolean = false;
    /* check if the selectedImage is not null, meening thet it's not the first time
    *  and reset the displayed propetry to false, else, it's the first time
    **/
    if (this.selectedImage) this.selectedImage.displayed = false;
    else if (this.allImages.length > 0) {
      isFirstTimeCall = true;
      /* first time call. 
      * set the selectedImages to allImages array in first element 
      * and display the selected image.
      * also, update the usedImages array to true
      **/
      this.selectedImage = this.allImages[0];
      this.allImages[0].displayed = true;
      this.usedImages[0] = true;
    }
    /*
    *
    **/
    /*
    * if it's not the first time call,  we start with a random images
    * while we used the randoImage in usedImages array, we set a new rando image
    **/
    if (!isFirstTimeCall && this.allImages.length > 0) {
      let randomImage = Math.floor(Math.random() * this.allImages.length);
      let size = this.allImages.length;
      while (this.usedImages[randomImage] && size >= 0) {
        size--;
        randomImage = Math.floor(Math.random() * this.allImages.length);
      }
      /* if the size is 0, meening all the images in usedImages array is true
      *  start the allImages array again
      *  Otherwiseת choose the random image
      */
      if (size == 0) {
        this.resetImages();
        this.selectedImage = this.allImages[0];
        this.allImages[0].displayed = true;
        this.usedImages[0] = true;
      }
      else {
        //אחרת אני בוחר את התמונה שיש לי
        this.selectedImage = this.allImages[randomImage];
        this.usedImages[randomImage] = true;
        this.allImages[randomImage].displayed = true;
      }
    }
    if (this.allImages.length > 0)
      this.doRefreshImage();
  }
  /* after looping over the array, and dislpayed all.
    * it's needed to start looping over again 
    * but first, reseting all images displayed property to false
    * and the usedImage to false
    */
  resetImages() {
    this.allImages.forEach(img => {
      img.displayed = false;
    });
    this.copyImages.forEach(img => {
      img.displayed = false;
    });
    this.usedImages.forEach(bool => {
      bool = false;
    });
  }

  clearIntervals() {
    var self = this;
    if (self.timeOut.length < 1) return void [0];
    self.timeOut.forEach(interval => {
      clearInterval(interval);
    });
  }

  setImagesData() {
    this.allImages = [];
    this.httpService.getAllImages()
      // resp is of type `HttpResponse<DataResponse>`
      .subscribe(resp => {
        // access the response body directly, which is typed as `DataResponse`.
        this.resp = { ...resp.body };
        console.log("response", this.resp);
        //check if the response body is undefined and .resp.items.length > 0
        // checking if the data has returned from the response
        if (this.resp !== undefined) {
          if (this.resp.items.length > 0) {
            let images = this.resp.items;
            //loopung over the items and add property displayed for evey image in allImages array
            images.forEach(img => {
              this.allImages.push({ img: img, displayed: false });
            });
            this.removeDuplicates();
            this.setImage();
          }
        }
      });

  }

  ngOnInit() {
    this.setImagesData();
  }


}