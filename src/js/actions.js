import {
    newGame,
    nextBoard,
    neighborhood,
    worldBoundaries,
    willLive
} from './data';


const boundariesFn = (board) => worldBoundaries(XMIN, XMAX, YMIN, YMAX, board);

/*
 Actions are given a full access to mutable store, because i didn't want to write
 a full fledged action dispatcher in style of flux/redux. However, they are still
 testable, using immstruct in tests (you can just create new store, run the action
 and inspect the store contents).
 */

export function play (_, store) {
    let intervalId = _.setInterval(() => {
        store.cursor().update((oldState) => {
            return oldState
                .update('board', (oldBoard) => nextBoard(neighborhood, boundariesFn, willLive, oldBoard))
                .update('iteration', (i) => i+1);
        });
    }, _.TICK_LEN);
    store.cursor().set('intervalId', intervalId);
}

export function pause (_, store) {
    _.clearInterval(store.cursor().get('intervalId'));
    store.cursor().set('intervalId', null);
}

export function reset (_, store) {
    _.clearInterval(store.cursor().get('intervalId'));
    store.cursor().set(newGame()) ;
}

export function toggle (_, store, coord) {
    store.cursor().update('board', (oldBoard) => {
        if (oldBoard.contains(coord)) {
            return oldBoard.remove(coord);
        } else {
            return oldBoard.add(coord);
        }
    });
}