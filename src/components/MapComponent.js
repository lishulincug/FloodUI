import React from 'react';
import { Map } from 'react-amap';

export class MapComponent extends React.Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Map amapkey={'788e08def03f95c670944fe2c78fa76f'} />
      </div>
    );
  }
}
