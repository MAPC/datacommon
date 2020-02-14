import React from 'react';

class Particles extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight / 5,
      dotArray: [],
      randNum(n) {
        return (((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3) * n;
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
    const { width, height } = this.state;
    window.addEventListener('resize', this.updateDimensions);
    if (width !== window.innerWidth
      || height !== this.canvas.parentNode.offsetHeight) {
      this.setState({ width: window.innerWidth, height: this.canvas.parentNode.offsetHeight });
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
        const x = Math.random() * prevState.width;
        const y = Math.random() * prevState.height;
        prevState.dotArray.push({
          i,
          rad: 4,
          x,
          y,
          iteration: Math.round(Math.random() * 150) + 2000,
          color: 'rgba(111, 198, 142, .6)',
          totalIterations: Math.round(Math.random() * 300) + 400,
          curSpot: {
            x,
            y,
          },
          tgt: {
            x: prevState.randNum(400) + x,
            y: prevState.randNum(400) + y,
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
    const { easeInOutQuart, randNum } = this.state;
    const dotRef = dot;
    dotRef.iteration += 1;

    if (dotRef.iteration < dotRef.totalIterations) {
      dotRef.x = easeInOutQuart(dotRef.iteration, dotRef.curSpot.x, dotRef.tgt.x - dotRef.curSpot.x, dotRef.totalIterations);
      dotRef.y = easeInOutQuart(dotRef.iteration, dotRef.curSpot.y, dotRef.tgt.y - dotRef.curSpot.y, dotRef.totalIterations);
    } else {
      dotRef.iteration = 0;
      dotRef.curSpot.x = dotRef.tgt.x;
      dotRef.curSpot.y = dotRef.tgt.y;
      dotRef.tgt.x = randNum(400) + dotRef.tgt.x;
      dotRef.tgt.y = randNum(400) + dotRef.tgt.y;
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
            contxt.strokeStyle = 'rgba(68, 173, 137, .3)';
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

    if (width <= 670) {
      triangleHeight = height;
    } else if (width <= 960) {
      triangleHeight = height - 140;
    } else if (width <= 1200) {
      triangleHeight = height - 240;
    }
    contxt.fillStyle = 'rgba(255,255,255,1)';
    contxt.beginPath();
    contxt.moveTo(0, height);
    contxt.lineTo(width, triangleHeight);
    contxt.lineTo(width, height);
    contxt.closePath();
    contxt.fill();
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  render() {
    const { width, height } = this.state;
    return (
      <canvas
        ref={(el) => this.canvas = el}
        width={width}
        height={height}
        className="component Particles"
      />
    );
  }
}

export default Particles;
