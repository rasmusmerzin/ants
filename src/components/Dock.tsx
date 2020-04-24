import React, { useState, Fragment } from 'react';
import './Dock.scss';

interface Props {
  fields: {
    label?: string,
    key: string,
    value: number,
    min?: number,
    max?: number,
    step?: number
  }[],
  update(feild: string, value: number): void
}

const Dock: React.FC<Props> = ({ fields, update }) => {
  const [visible, setVisibility] = useState(false);

  return <div id='dock'>
    <div
      className={'ctrl' +(visible ? ' open' : ' closed')}
    >
      {fields.map((obj, i) => <Fragment key={i}>
        <label>{obj.label || obj.key} <span className='value'>{obj.value}</span></label>
        <input
          type='range'
          value={obj.value}
          min={obj.min}
          max={obj.max}
          step={obj.step}
          onChange={e => update(obj.key, Number(e.target.value))}
        />
      </Fragment>)}
    </div>
    <button
      className={'door' +(visible ? ' open' : ' closed')}
      onClick={() => setVisibility(v => !v)}
    >≡</button>
  </div>;
};

export default Dock;
