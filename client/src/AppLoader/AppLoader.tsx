import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

const AppLoader: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        zIndex: 90,
      }}
    >
      <Dimmer active>
        <Loader />
      </Dimmer>
    </div>
  );
};

export default AppLoader;
