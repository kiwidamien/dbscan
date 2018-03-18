import React, {Component} from 'react';
import PlotRegion from './PlotRegion';
import {SideBar, StepBar} from './SideBar';
import {range} from 'd3';
import {getMetricSquare, getNumberOfNeighbors, getIndexOfNeighbors, getClusterNumber} from './dbscan';
const settings = {
  width: 500,
  height: 500,
  maxRange: 10,
  numDataPoints: 20
};

class ClusterApp extends Component{
  constructor(props) {
    super(props);
    this.state = {
      epsilon: 1.0,
      minPoints: 3,
      isLoading: true,
      data: [],
      metric: [[]],
      neighborList: [[]],
      clusterNumber: [],
      showNumbers: false,
      showNeighborhood: false,
      highlightTypes: true,
      colorClusters: false,
      step: 0,
    }
  }

  componentWillMount() {
    this.randomizeData();
  }

  randomizeData() {
    const randomData = range(settings.numDataPoints).map(() => [Math.random() * settings.maxRange,
                                                                   Math.random() * settings.maxRange] );

    const metric = getMetricSquare(randomData)
    this.setState({
      data: randomData,
      metric,
      neighborList: getIndexOfNeighbors(metric, this.state.epsilon),
      clusterNumber: getClusterNumber(metric, this.state.epsilon, this.state.minPoints),
      isLoading: false});
  }

  onRadiusChange(newRadius) {
    const metric = this.state.metric;
    this.setState({
      epsilon: newRadius,
      neighborList: getIndexOfNeighbors(metric, newRadius),
      clusterNumber: getClusterNumber(metric, newRadius, this.state.minPoints)
    });
  }

  onMinPointsChange(newMinPoints) {
    this.setState({
      minPoints: newMinPoints,
      clusterNumber: getClusterNumber(this.state.metric, this.state.epsilon, newMinPoints)
    });
  }

  render() {
    console.log(this.state);
    return (
    <div>
    <div style={{textAlign:'center'}}>
      <h3>DBSCAN: Interactive visualization of parameters</h3>
    </div>
    <div className='ClusterApp'>
      <div className='SideAndPlot'>
        <SideBar
          epsilon={this.state.epsilon}
          minPoints={this.state.minPoints}
          showDifferentTypes={this.state.highlightTypes}
          colorClusters={this.state.colorClusters}
          onRadiusChange={(num) => this.onRadiusChange(num)}
          onPointsChange={(num) => this.onMinPointsChange(num)}
          setShowNumbers={(value) => {this.setState({showNumbers: !this.state.showNumbers})}}
          setShowNeighborhood={(value) => this.setState({showNeighborhood: !this.state.showNeighborhood})}
          setDifferentTypes={(value) => this.setState({highlightTypes: !this.state.highlightTypes})}
          setClusterColor={(value) => this.setState({colorClusters: !this.state.colorClusters})}
        />
        <div className='PlotRegion'>
          <PlotRegion
            minPoints={this.state.minPoints}
            epsilon={this.state.epsilon}
            data={this.state.data}
            neighborList={this.state.neighborList}
            clusterNumber={this.state.clusterNumber}
            showNumbers={this.state.showNumbers}
            showNeighborhoodCore={this.state.showNeighborhood}
            showNeighborhoodBorder={this.state.showNeighborhood}
            showNeighborhoodNoise={this.state.showNeighborhood}
            highlightTypes={this.state.highlightTypes}
            colorClusters={this.state.colorClusters}
          />
        </div>
      </div>
      <div className='StepBar'>
        <StepBar
          highlightTypes={this.state.highlightTypes}
        />
      </div>
    </div>
    </div>
    )
  }
}

export default ClusterApp;
