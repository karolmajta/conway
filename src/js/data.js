import * as I from 'immutable';


/*
 Returns a blank game state. A game consists of current iteration number, and a board.
 Board is represented by a set of two element lists (each standing for coordinates of
 a live cell) and is initially empty.
 */
export function newGame () {
    return I.fromJS({
        iteration: 0,
        intervalId: null,
        board: I.Set()
    });
}

/*
 Given coordinates returns a set of coordinates representing it's neighboorhood.
 */
export function neighborhood (coords) {
    let x = coords.get(0), y = coords.get(1);
    return I.Set.of(
        I.List.of(x-1, y-1),
        I.List.of(x, y-1),
        I.List.of(x+1, y-1),
        I.List.of(x-1, y),
        I.List.of(x+1, y),
        I.List.of(x-1, y+1),
        I.List.of(x, y+1),
        I.List.of(x+1, y+1)
    ).filter((x) => x);
}

/*
 Given minimal/maximal boundaries for x axis (xmin, xmax), and minimal/maximal boundaries for
 y axis (ymin, ymax), given a board, will return a version of board that has all elements that
 are not inside boundaries removed (considered dead).
 Lower boundaries are inclusive, upper boundaries are exclusive.
 */
export function worldBoundaries(xmin, xmax, ymin, ymax, board) {
    return board.filter((cell) => {
        let x = cell.get(0), y = cell.get(1);
        return x >= xmin && x < xmax && y >= ymin && y < ymax;
    });
}

/*
 Given particular coordinates, and a board return true if the cell in coords
 should be considered alive in the next generation, false otherwise. If given coords are
 by any means "falsy" (null, undefined, false, etc).
 */
export function willLive (coords, board) {
    let liveNeighborCount = neighborhood(coords).intersect(board).count();
    if (!board.contains(coords)) {
        return liveNeighborCount == 3;
    } else {
        return liveNeighborCount == 2 || liveNeighborCount == 3;
    }
}

/*
 Given neighborhood function, boundaries function and a current board
 will return the next state of board.
 - neighborhood function should be a function that takes coords and returns
   a set of coordinates that are considered it's neighboorhood
 - boundaries function should be a function that takes a board and returns
   it's subset based on if elements are inside or not
 - willLiveFn should be a function that takes coordinates and board ant
   returns true if the cell should live to further generation, false otherwise
 */
export function nextBoard (neighborhoodFn, boundariesFn, willLiveFn, board) {
    // cells that are possibly changing are either alive (are in board), or lie in the
    // neighborhood of alive cell (others are, and will remain dead, so no need
    // to consider them at all), hence:
    let allPossiblyChanging = I.Set(board.map(neighborhoodFn).flatten(true));
    // once we have the ones that can change we can filter them into a new collection
    // of future board
    let survivedAndBorn = allPossiblyChanging.filter((coords) => willLiveFn(coords, board));
    // we want to limit the new generation to world boundaries, so that nothing gets born
    // outside of the board
    return boundariesFn(survivedAndBorn);
}