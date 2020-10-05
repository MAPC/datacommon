import React from 'react';
import hexToRgb from '../../utils/hexToRgb';
import colors from '../../constants/colors';

class Particles extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      width: window.innerWidth,
      height: 423,
      dotArray: [],
      randNum(measurement) {
        return Math.floor(Math.random() * Math.floor(measurement));
      },
      checkDist(itemA, itemB) {
        const x1 = itemA.x;
        const y1 = itemA.y;
        const x2 = itemB.x;
        const y2 = itemB.y;
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
      },
      easeInOutQuart(iteration, currentXY, diffXY, totalIterations) {
        if ((iteration /= totalIterations / 2) < 1) {
          return diffXY / 2 * iteration * iteration * iteration * iteration + currentXY;
        }
        return -diffXY / 2 * ((iteration -= 2) * iteration * iteration * iteration - 2) + currentXY;
      },
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    this.interval = this.interval.bind(this);
    this.moveDot = this.moveDot.bind(this);
    this.drawNearestNeighborLines = this.drawNearestNeighborLines.bind(this);
    this.createDots = this.createDots.bind(this);
    this.drawTriangle = this.drawTriangle.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    if (window.innerWidth <= 480) {
      this.setState({ height: 205 });
    } else if (window.innerWidth <= 770) {
      this.setState({ height: 220 });
    }
    const contxt = this.canvas.getContext('2d');
    contxt.lineWidth = 2;
    contxt.strokeStyle = 'rgba(111, 198, 142, .6)';
    this.createDots();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  createDots() {
    this.setState((prevState) => {
      for (let i = 0; i < 200; i += 1) {
        const x = prevState.randNum(prevState.width);
        const y = prevState.randNum(prevState.height);
        prevState.dotArray.push({
          i,
          rad: 5,
          x,
          y,
          iteration: Math.round(Math.random() * 150) + 2000,
          color: `rgba(${hexToRgb(colors.BRAND.PRIMARY)}, .6)`,
          totalIterations: Math.round(Math.random() * 300) + 400,
          curSpot: {
            x,
            y,
          },
          tgt: {
            x: (prevState.randNum(prevState.width) + x) % prevState.width,
            y: (prevState.randNum(prevState.height) + y) % prevState.height,
          },
        });
      }
      return { dotArray: prevState.dotArray };
    });
    this.interval();
  }

  interval() {
    const { width, height, dotArray } = this.state;
    const contxt = this.canvas.getContext('2d');
    requestAnimationFrame(this.interval);
    contxt.clearRect(0, 0, width, height);
    dotArray.forEach((dot) => {
      this.moveDot(dot);
      contxt.fillStyle = dot.color;
      contxt.beginPath();
      contxt.arc(dot.x, dot.y, dot.rad, 0, 2 * Math.PI, false);
      contxt.fill();
    });
    this.drawNearestNeighborLines();
    this.drawTriangle();
  }

  moveDot(dot) {
    const { easeInOutQuart, randNum, width, height } = this.state;
    const dotRef = dot;
    dotRef.iteration += 1;

    if (dotRef.iteration < dotRef.totalIterations) {
      dotRef.x = easeInOutQuart(dotRef.iteration, dotRef.curSpot.x, dotRef.tgt.x - dotRef.curSpot.x, dotRef.totalIterations);
      dotRef.y = easeInOutQuart(dotRef.iteration, dotRef.curSpot.y, dotRef.tgt.y - dotRef.curSpot.y, dotRef.totalIterations);
    } else {
      dotRef.iteration = 0;
      dotRef.curSpot.x = dotRef.tgt.x;
      dotRef.curSpot.y = dotRef.tgt.y;
      dotRef.tgt.x = (randNum(width) + dotRef.tgt.x) % width;
      dotRef.tgt.y = (randNum(height) + dotRef.tgt.y) % height;
    }
  }

  drawNearestNeighborLines() {
    const { dotArray, checkDist } = this.state;
    const contxt = this.canvas.getContext('2d');
    if (dotArray.length > 0) {
      for (let i = 0; i < 200; i += 1) {
        for (let k = 0; k < 200; k += 1) {
          const dot1 = dotArray[i];
          const dot2 = dotArray[k];
          const curDist = checkDist(dot1, dot2);
          if (curDist < 45) {
            contxt.beginPath();
            contxt.moveTo(dot1.x, dot1.y);
            contxt.lineTo(dot2.x, dot2.y);
            contxt.lineWidth = 2;
            contxt.strokeStyle = `rgba(${hexToRgb(colors.BRAND.SECONDARY)}, .1)`;
            contxt.stroke();
            contxt.closePath();
          }
        }
      }
    }
  }

  drawTriangle() {
    const { width, height } = this.state;
    const contxt = this.canvas.getContext('2d');
    let triangleHeight = height - 240;

    if (width <= 770) {
      triangleHeight = height;
    } else if (width <= 960) {
      triangleHeight = height - 140;
    } else if (width <= 1200) {
      triangleHeight = height - 180;
    }
    contxt.fillStyle = 'rgba(255,255,255,.1)';
    contxt.beginPath();
    contxt.rect(0, 0, width, height);
    contxt.fill();

    contxt.fillStyle = 'rgba(255,255,255,1)';
    contxt.beginPath();
    contxt.moveTo(0, height);
    contxt.lineTo(width, triangleHeight);
    contxt.lineTo(width, height);
    contxt.closePath();
    contxt.fill();
  }

  updateDimensions() {
    if (window.innerWidth <= 480) {
      this.setState({ width: window.innerWidth, height: 205 });
    } else if (window.innerWidth <= 770) {
      this.setState({ width: window.innerWidth, height: 220 });
    } else {
      this.setState({ width: window.innerWidth, height: 423 });
    }
  }

  render() {
    const { width, height } = this.state;
    const canvasStyles = {
      width,
      height,
      border: 0,
    };
    return (
      <canvas
        ref={(el) => this.canvas = el}
        width={width}
        height={height}
        className="component Particles"
        style={canvasStyles}
      />
    );
  }
}

export default Particles;
