import React from 'react';
import { scaleLinear } from 'd3-scale';
import {select} from 'd3-selection';
import {axisBottom, axisLeft  } from 'd3-axis';

const styles = {
  width   : 700,
  height  : 700,
  padding : 30,
  backgroundColor: 'white'
};

const makeHorizontalScale = (props) => {
  return scaleLinear()
    .domain([0, 10.0])
    .range([props.padding, props.width - props.padding * 2]);
};

const makeVerticalScale = (props) => {
  return scaleLinear()
    .domain([0, 10.0])
    .range([props.height - props.padding * 2, props.padding]);
};

const Axis = (props) => {
  const {axis, translateHorizontal, translateVertical} = props;

  return (
    <g
      ref={(element) => select(element).call(axis)}
      transform={`translate(${translateHorizontal} ,${translateVertical})`}
      className='histogram-axis'
    />
  );
}

const DrawSingleCircle = (datum, index, props) => {
  const {xScale, yScale} = props;
  const pointProps = {
    cx: xScale(datum[0]),
    cy: yScale(datum[1]),
    r: props.r || 4,
    opacity: props.opacity || 1.0,
    fill: props.fill || '#000000',
    key: index
  };

  return (<g><circle {...pointProps}/></g>);
}

const DrawSingleRectangle = (datum, index, props) => {
  const {xScale, yScale} = props;
  const side = props.side || 8;
  const rectProps = {
    x: xScale(datum[0]) - side / 2,
    y: yScale(datum[1]) - side / 2,
    width: side,
    height: side,
    opacity: props.opacity || 1.0,
    stroke: props.stroke || '#000000',
    fill: props.fill || '#000000'
  };
  return (<g><rect {...rectProps}/></g>);
}

const DisplayAsCircles = (props) => {
  return props.data.map( (datum, index) => DrawSingleCircle(datum, index, props));
}

const DisplayAsRectangles = (props) => {
  return props.data.map( (datum, index) => DrawSingleRectangle(datum, index, props));
}

const DisplayPoint = (datum, numNeighbors, clusterNumber, props) => {
  const colorNames = ['#000000', '#66c2a4', '#2ca25f', '#006d2c'];

  // are we coloring the point?
  let stroke = (props.colorClusters && colorNames[clusterNumber % colorNames.length]) || '#000000';
  let fill = stroke;

  // what type of point is it?
  if (!props.highlightTypes || (numNeighbors >= props.minPoints)) {
    // core point
    return DrawSingleCircle(datum, -1, {...props, fill, stroke, r: 5});
  }

  if (clusterNumber){
    // border point
    return DrawSingleCircle(datum, -1, {...props, fill, stroke, r: 3});
  }

  return DrawSingleRectangle(datum, -1, props);
}

const DisplayGlyphs = (props) => {
  return props.data.map((datum, index) => {
    return DisplayPoint(datum,
                        props.neighborList[index].length,
                        props.clusterNumber[index],
                        props);
  });
};

const DisplayAsNumbers = (props) => {
  const {xScale, yScale} = props;
  const elements = props.data.map( (datum, index) => {
    const labelProps = {
      x: xScale(datum[0]),
      y: yScale(datum[1]),
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fill: 'blue'
    }
    return (
      <g><text {...labelProps}>{props.neighborList[index].length}/{props.clusterNumber[index] || '-'}</text></g>
    )
  });

  return elements;
}

const ScatterPlot = (props) => {
  const {xScale, yScale, epsilon} = props;
  const xAxis = axisBottom(xScale)
    .tickSize(3)
    .ticks([5]);

  const yAxis = axisLeft(yScale)
    .tickSize(3)
    .ticks([5]);

  return (
    <svg
      width={props.width}
      height={props.height}
    >

    <Axis
      axis={xAxis}
      translateHorizontal={0}
      translateVertical={props.height - 2*props.padding}
    />
    <Axis
      axis={yAxis}
      translateHorizontal={props.padding}
      translateVertical={0}
    />

    {props.showNeighborhood && <DisplayAsCircles
      data={props.data}
      xScale={xScale}
      yScale={yScale}
      r={xScale(epsilon) - xScale(0)}
      fill='#A5A5FF'
      opacity={0.6}
    />}

    <DisplayGlyphs
      data={props.data}
      xScale={xScale}
      yScale={yScale}
      clusterNumber={props.clusterNumber}
      neighborList={props.neighborList}
      highlightTypes={props.highlightTypes}
      colorClusters={props.colorClusters}
      minPoints={props.minPoints}
    />
    {props.showNumbers &&
      <DisplayAsNumbers
        data={props.data}
        neighborList={props.neighborList}
        clusterNumber={props.clusterNumber}
        xScale={xScale}
        yScale={yScale}
      />}
    }
    </svg>
  );
};

const PlotRegion = (props) => {
  const xScale = makeHorizontalScale(styles);
  const yScale = makeVerticalScale(styles);

  return (
    <div>
      <ScatterPlot
        xScale={xScale}
        yScale={yScale}
        {...props}
        {...styles}
      />
    </div>
  );
}

export default PlotRegion;
