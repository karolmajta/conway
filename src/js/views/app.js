import * as React from 'react';
import * as I from 'immutable';

import {default as Board} from './board';
import {default as Controls} from './controls';


export default function App ({data, injections, onPlay, onPause, onReset, onChange}) {
    return (
        <div>
            <Controls iteration={data.get('iteration')}
                      isPaused={!data.get('intervalId')}
                      onPlay={onPlay}
                      onPause={onPause}
                      onReset={onReset}/>
            <hr />
            <Board board={data.get('board')}
                   xMin={injections.XMIN}
                   xMax={injections.XMAX}
                   yMin={injections.YMIN}
                   yMax={injections.YMAX}
                   onChange={onChange} />
        </div>
    );
};