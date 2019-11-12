import React from 'react';

import colors from '../../constants/colors';
import hexToRgb from '../../utils/hexToRgb';


class Particles extends React.Component {

  constructor() {
    super(...arguments);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight / 5,
    };
  }

  componentDidMount() {
    const component = this;

    // From https://codepen.io/jaredstanley/pen/djyRxy
    var b_canvas,
      contxt,
      size = 4,
      dotCount = 200,
      lineWidth = 2,
      neigborDistance = 45,
      dotColor = colors.BRAND.PRIMARY,
      lineColor = `rgba(${hexToRgb(colors.BRAND.SECONDARY)}, .3)`,
      w = window.innerWidth,
      h = this.canvas.parentNode.offsetHeight,
      dotArray = [];

    if (this.state.width !== w || this.state.height !== h) {
      this.setState({ width: w, height: h });
    }

    var mode = 'neighbor';
    var urlParams = {};
    var logCount = 0;

    start();

    function start() {
      b_canvas = component.canvas;
      contxt = b_canvas.getContext("2d");
      contxt.lineWidth = lineWidth;
      contxt.strokeStyle = dotColor;
      createDots();

      interval();
    }

    function interval() {
      requestAnimationFrame(interval);
      update();
    }

    function update() {
      contxt.clearRect(0, 0, w, h);
      var item, chance, sum, i;
      dotArray.forEach(function(item) {
        move(item);
        contxt.fillStyle = item.color;
        contxt.beginPath();
        contxt.arc(item.x, item.y, item.rad, 0, 2 * Math.PI, false);
        contxt.fill();
      })

      if (mode == "neighbor") {
        drawLinesNeighbors();
      }
    }

    function move(itm) {
      itm.iteration++;

      if (itm.iteration < itm.totalIterations) {
        itm.x = easeInOutQuart(itm.iteration, itm.curSpot.x, itm.tgt.x-itm.curSpot.x, itm.totalIterations);
        itm.y = easeInOutQuart(itm.iteration, itm.curSpot.y, itm.tgt.y-itm.curSpot.y, itm.totalIterations);

      }else{
        itm.iteration=0;
        itm.curSpot.x = itm.tgt.x;
        itm.curSpot.y = itm.tgt.y;
        itm.tgt.x = randNum(400)+itm.tgt.x;
        itm.tgt.y = randNum(400)+itm.tgt.y;
      }
    }


    function drawLines() {
      var item, secondItem;
      var i, k;
      for (i = 0; i < dotArray.length; i++) {
        for (k = i + 1; k < dotArray.length; k++) {
          if (k > i) {
            item = dotArray[i];
            secondItem = dotArray[k];
            contxt.beginPath();
            contxt.moveTo(item.x, item.y);
            contxt.lineTo(secondItem.x, secondItem.y);
            contxt.lineWidth = lineWidth;
            contxt.strokeStyle = lineColor;
            contxt.stroke();
            contxt.closePath();
          }
        }
      }
    }

    function drawLinesNeighbors() {
      var i, k;
      var item, secondItem, curDist;
      for (i = 0; i < dotArray.length; i++) {
        for (k = i + 1; k < dotArray.length; k++) {
          item = dotArray[i];
          secondItem = dotArray[k];
          curDist = checkDist(item, secondItem);
          if (curDist < neigborDistance) {
            contxt.beginPath();
            contxt.moveTo(item.x, item.y);
            contxt.lineTo(secondItem.x, secondItem.y);
            contxt.lineWidth = lineWidth;
            contxt.strokeStyle = lineColor;
            contxt.stroke();
            contxt.closePath();
          }
        }
      }
    }

    function checkDist(itemA, itemB) {
      var x1 = itemA.x;
      var y1 = itemA.y;
      var x2 = itemB.x;
      var y2 = itemB.y;

      var d = Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
      return d;
    }

    function createDots() {
      var rad;
      var dot;
      for (var i = 0; i < dotCount; i++) {

        rad = size;
        dot = new Dot(
          i,
          rad,
          Math.random() * w,
          Math.random() * h
        )
        dotArray.push(dot)
      }
    }

    function Dot(i, rad, x, y) {
      this.i = i;
      this.rad = rad;
      this.x = x;
      this.y = y;

      this.iteration = Math.round(Math.random()*150)+2000;
      this.color = dotColor;

      this.totalIterations = Math.round(Math.random()*300)+400;
      this.curSpot = {
        x: this.x,
        y: this.y
      };
      this.tgt = {
        x: randNum(400)+this.curSpot.x,
        y: randNum(400)+this.curSpot.y,
      };
    }

    function easeInOutQuart(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }

    function randNum(n){
      var p = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
      return p*n;
    }
  }


  render() {
    const { width, height } = this.state;

    return (
      <canvas
        ref={el => this.canvas = el}
        width={width}
        height={height}
        className="component Particles"
      >
      </canvas>
    );
  }

}

export default Particles;
