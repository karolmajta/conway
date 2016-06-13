import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {default as immstruct} from 'immstruct';

import {default as App} from './views/app';
import {newGame} from './data';
import * as actions from './actions';

const TICK_LEN = 500;
const XMIN = 0, XMAX = 100;
const YMIN = 0, YMAX = 100;

function rootComponent (store) {
    let injections = {
        setInterval: window.setInterval.bind(window),
        clearInterval: window.clearInterval.bind(window),
        TICK_LEN: TICK_LEN,
        XMIN: XMIN,
        XMAX: XMAX,
        YMIN: YMIN,
        YMAX: YMAX
    };
    return <App data={store.cursor().deref()}
                injections={injections}
                onPlay={() => actions.play(injections, store)}
                onPause={() => actions.pause(injections, store)}
                onReset={() => actions.reset(injections, store)}
                onChange={(coord) => actions.toggle(injections, store, coord)} />
}

const store = immstruct(newGame());

ReactDOM.render(
    rootComponent(store),
    document.getElementById('application')
);

store.on('swap', function (is, was, path) {
    ReactDOM.render(
        rootComponent(store),
        document.getElementById('application')
    );
});