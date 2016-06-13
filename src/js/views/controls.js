import * as React from 'react';


export default function Controls ({iteration, isPaused, onPlay, onPause, onReset}) {
    return (
        <div className="controls">
            <span>
                <button onClick={onReset}>Reset</button>
            </span>
            <span>
                {isPaused
                    ? <button onClick={onPlay}>Play</button>
                    : <button onClick={onPause}>Pause</button>}
            </span>
            <span>Iteration #: {iteration}</span>
        </div>
    );
};