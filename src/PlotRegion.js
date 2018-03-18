import React from 'react';
import {scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import {axisBottom, axisLeft} from 'd3-axis';

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

const getClusterColor = (clusterNumber) => {
  const colorNames = ['#000000', '#66c2a4', '#2ca25f', '#006d2c'];
  return colorNames[clusterNumber % colorNames.length];
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

const DisplayPoint = (datum, type, clusterNumber, props) => {

  // are we coloring the point?
  let stroke = (props.colorClusters && getClusterColor(clusterNumber)) || '#000000';
  let fill = stroke;

  if (!props.highlightTypes || (type === 'CORE')) {
    return DrawSingleCircle(datum, -1, {...props, fill, stroke, r: 5});
  }

  if (type === 'BORDER'){
    return DrawSingleCircle(datum, -1, {...props, fill, stroke, r: 3});
  }

  return DrawSingleRectangle(datum, -1, props);
}

const DisplayGlyphs = (props) => {
  return props.data.map((datum, index) => {
    return DisplayPoint(datum.point,
                        datum.type,
                        datum.clusterNumber,
                        props);
  });
};

const DrawNeighborhood = (processedData, type, {xScale, yScale, colorClusters, r, opacity}) => {
  return processedData.filter((datum) => (datum.type === type)).map((datum) => {
    return DrawSingleCircle(datum.point, -1, {
      xScale,
      yScale,
      r,
      fill: (colorClusters && getClusterColor(datum.clusterNumber)) || '#000000',
      opacity: 0.3
    })
  });
}

const DisplayAsNumbers = (props) => {
  const {xScale, yScale} = props;
  const elements = props.data.map( (datum, index) => {
    const labelProps = {
      x: xScale(datum.point[0]),
      y: yScale(datum.point[1]),
      fontFamily: 'sans-serif',
      fontSize: '20px',
      fill: 'blue'
    }
    const clusterNumber = datum.clusterNumber;
    const label = datum.numNeighbors + ((clusterNumber) ? ('/' + clusterNumber) : '');
    return (
      <g><text {...labelProps}>{label}</text></g>
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

  const processedData = props.data.map((datum, index) => {
    const numNeighbors = props.neighborList[index].length;
    const type = (props.clusterNumber[index] === 0) ? 'NOISE' : (numNeighbors < props.minPoints) ? 'BORDER' : 'CORE';

    return {
      point: datum,
      numNeighbors: props.neighborList[index].length,
      clusterNumber: props.clusterNumber[index],
      type
    }
  });

  const neighborhoodProps = {
    xScale,
    yScale,
    r: xScale(epsilon) - xScale(0),
    opacity: 0.3,
    colorClusters: props.colorClusters
  };

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

    {props.showNeighborhoodCore && DrawNeighborhood(processedData, 'CORE', neighborhoodProps)}

    {props.showNeighborhoodBorder && DrawNeighborhood(processedData, 'BORDER', neighborhoodProps)}

    {props.showNeighborhoodNoise && DrawNeighborhood(processedData, 'NOISE', neighborhoodProps)}

    <DisplayGlyphs
      data={processedData}
      xScale={xScale}
      yScale={yScale}
      highlightTypes={props.highlightTypes}
      colorClusters={props.colorClusters}
    />
    {props.showNumbers &&
      <DisplayAsNumbers
        data={processedData}
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
