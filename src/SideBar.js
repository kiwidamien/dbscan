import React from 'react';
import Checkbox from './Checkbox';
import NumericSlider from './NumericSlider';

const ShowNeighborhoodControl = (props) => {
  return (
    <div className='NeighborhoodControl'>
      Show neighborhood for
      <Checkbox
        name='.... core points'
        isChecked={props.showNeighborhoods.core}
        onCheckToggle={(value) => props.setShowNeighborhoods({...props.showNeighborhoods, core: value.target.checked})}
      />
      <Checkbox
        name='.... border points'
        isChecked={props.showNeighborhoods.border}
        onCheckToggle={(value) => props.setShowNeighborhoods({...props.showNeighborhoods, border: value.target.checked})}
      />
      <Checkbox
        name='.... noise points'
        isChecked={props.showNeighborhoods.noise}
        onCheckToggle={(value) => props.setShowNeighborhoods({...props.showNeighborhoods, noise: value.target.checked})}
      />
      <div className='NeighborhoodButtonContainer'>
        <button
          onClick={() => props.setShowNeighborhoods({border: true, core: true, noise: true})}
        >Show all</button>
        <button
          onClick={() => props.setShowNeighborhoods({border: false, core: false, noise: false})}
        >{"Show none"}</button>
      </div>
    </div>
  )
}
const SideBar = (props) => {
  return (
    <div className='SideBar'>
      <NumericSlider
        name='Minimum points in a cluster'
        value={props.minPoints}
        min={2}
        max={20}
        onValueChange={props.onPointsChange}
      />
      <NumericSlider
        name='Radius of neighborhood (&epsilon;)'
        value={props.epsilon}
        min={0}
        max={10}
        step={0.1}
        onValueChange={props.onRadiusChange}
      />
      <Checkbox
        name='Show numbers'
        isChecked={props.showNumbers}
        onCheckToggle={(value) => props.setShowNumbers(value)}
      />

      <Checkbox
        name='Symbols for different point types'
        isChecked={props.showDifferentTypes}
        onCheckToggle={(value) => props.setDifferentTypes(value)}
      />
      <Checkbox
        name='Show color for different clusters'
        isChecked={props.colorClusters}
        onCheckToggle={(value) => props.setClusterColor(value)}
      />

      <ShowNeighborhoodControl {...props} />
    </div>
  );
};

const StepBar = (props) => {
  const additionalElements = ['Larger circles are CORE points',
                              'Small circles are BORDER points',
                              'Rectangles are NOISE points'].map((msg) => <li>{msg}</li>);
  return (
    <div>
    <ul>
      <li> Number labels are of the form X/Y, where X is the number of neighbors, and Y is the cluster number.</li>
      <li> Cluster number not shown for noise. </li>
      {props.highlightTypes && additionalElements}
    </ul>
    </div>
  );
}
export {
  SideBar,
  StepBar
};
