import React from 'react';

const Checkbox = (props) => {
  return (
    <div className='checkbox'>
      <label>
        <input
          type='checkbox'
          value={props.name}
          checked={props.isChecked}
          onChange={props.onCheckToggle}/> {props.name}
        </label>
    </div>
  );
}

export default Checkbox;
