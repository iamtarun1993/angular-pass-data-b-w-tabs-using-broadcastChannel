import { Component, OnInit } from '@angular/core';

enum ColorType {
  r = 'red',
  g = 'green',
  b = 'blue',
}

const bgColorChannelName = 'bg-color-channel';
const bgColorChangeMessage = 'bg-color-changed';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})
export class AppComponent implements OnInit {
  colorType = ColorType;

  backGroundColorViaLocalStorage: ColorType;

  backGroundColorViaBroadcastChannel: ColorType;
  broadcastChannel = new BroadcastChannel(bgColorChannelName);

  constructor() {
    this.addBroadcastChannelListener();
  }

  ngOnInit() {
    this.backGroundColorViaLocalStorage = localStorage.getItem(
      'color'
    ) as ColorType;
  }

  //This method is responsible to change color via to localStorgae
  changeColorViaLocalStorage(color: ColorType) {
    localStorage.setItem('color', color);
    this.backGroundColorViaLocalStorage = color;
  }

  changeColor(color: ColorType) {
    this.changeColorViaLocalStorage(color);
    this.changeColorViaBroadcastChannel(color);
  }

  // This method is responsible to change color via broadcastChannel and
  // trigger event to change color.
  changeColorViaBroadcastChannel(color: ColorType) {
    this.backGroundColorViaBroadcastChannel = color;
    this.broadcastChannel.postMessage({ ev: bgColorChangeMessage, color });
  }

  // This method is responsible whenever any event triggerd via broadcastChannel
  private addBroadcastChannelListener() {
    this.broadcastChannel.addEventListener('message', (event) => {
      if (event.data.ev === bgColorChangeMessage) {
        this.backGroundColorViaBroadcastChannel = event.data.color;
      }
    });
  }
}
