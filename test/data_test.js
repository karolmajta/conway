import {assert} from 'chai';
import * as I from 'immutable';

import {
    neighborhood,
    worldBoundaries,
    willLive,
    nextBoard
} from './../src/js/data';


describe('data.neighborhood', function() {
    it('should not contain the given coordinate', function () {
        assert.isFalse(neighborhood(I.List.of(21, 30)).contains(I.List.of(21, 30)));
    });
    it('should contain 8 neighbors', function () {
        assert.equal(8, neighborhood(I.List.of(-31, 100)).count());
    });
    it('neighbors should be all adjacent coords', function () {
        assert.isTrue(
            I.Set(I.fromJS([
                [-1, -1], [0, -1], [1, -1],
                [-1,  0],          [1,  0],
                [-1,  1], [0,  1], [1,  1]
            ])).equals(neighborhood(I.List.of(0, 0)))
        );
    });
});

describe('data.worldBoundaries', function () {
    let xmin = -10, xmax = 30;
    let ymin = -20, ymax = 45;
    let inner = I.Set(I.fromJS([
        [0, 0], [0, 30], [-10, 44], [29, 15]
    ]));
    let outer = I.Set(I.fromJS([
        [100, 100], [-11, 2], [30, 2], [30, 45], [2, 45],
        [-100, -30]
    ]));
    let all = inner.add(outer);

    it('should leave all elements that are inside boundaries', function () {
        assert.isTrue(inner.equals(worldBoundaries(xmin, xmax, ymin, ymax, all)));
    });
    it('should filter out all elements that are outside boundaries', function () {
        assert.isTrue(outer.intersect(worldBoundaries(xmin, xmax, ymin, ymax, all)).isEmpty());
    });
});

describe('data.willLive', function () {
    it('should return true if cell at given record is dead, and neighbor count is 3', function () {
        assert.isTrue(willLive(I.List.of(2, 2), I.Set(I.fromJS([[1, 1], [2, 1], [3, 1]]))));
    });
    it('should return false if cell at given coord is dead, and neighbor count is different than 3', function () {
        // the cell being dead just means, that board does not contain it
        assert.isFalse(willLive(I.List.of(0, 0), I.Set(I.fromJS([]))));
        assert.isFalse(willLive(I.List.of(0, 0), I.Set(I.fromJS([[0, 1]]))));
        assert.isFalse(willLive(I.List.of(0, 0), I.Set(I.fromJS([[0, 1], [-1, 1]]))));
        assert.isFalse(willLive(I.List.of(0, 0), I.Set(I.fromJS([[0, 1], [-1, 1], [21, 3]]))));
    });
    it('should return true if cell at given record is alive, and neighbor count is 2', function () {
       assert.isTrue(willLive(I.List.of(3, 3), I.Set(I.fromJS([[3, 3], [2, 3], [4, 2]]))));
    });
    it('should return true if cell at given record is alive, and neighbor count is 3', function () {
        assert.isTrue(willLive(I.List.of(3, 3), I.Set(I.fromJS([[3, 3], [2, 3], [4, 2], [4, 4]]))));
    });
    it('should return false if cell at given coord is alive, and neighbor count is different than 3 or 2', function () {
        assert.isFalse(willLive(I.List.of(0, 0), I.Set(I.fromJS([0, 0]))));
        assert.isFalse(willLive(I.List.of(0, 0), I.Set(I.fromJS([[0, 0], [0, 1]]))));
        assert.isFalse(willLive(I.List.of(0, 0), I.Set(I.fromJS([[0, 0], [0, 1], [0, -1], [-1, 1], [1, 1]]))));
    });
});

describe('data.nextBoard', function () {
    it('should determine possible future live cells, based on neighborhood function', function () {
        let neighborhoodFn = (coord) => I.Set(I.fromJS([[0, 0], [0, 1]]));
        assert.isTrue(
            I.Set(I.fromJS([[0, 0], [0, 1]]))
                .equals(nextBoard(neighborhoodFn, (board) => board, (coords) => true, I.Set(I.fromJS([[20, 20]]))))
        );
    });
    it('should determine future live cells based on will-live predicate', function () {
        let willLiveFn = (coords, board) => coords.get(0) == 0;
        assert.isTrue(
            I.Set(I.fromJS([[0, 1], [0, 2]])).equals(
                nextBoard(
                    () => I.Set(I.fromJS([[0, 1], [0, 2], [1, 1]])),
                    (board) => board,
                    willLiveFn,
                    I.Set(I.fromJS([[0, 0]]))
                )
            )
        );
    });
    it('should limit the number of future live cells based on board size predicate', function () {
        let boardSizeFn = (board) => I.Set(I.fromJS([[0, 0]]));
        assert.isTrue(
            I.Set(I.fromJS([[0, 0]])).equals(
                nextBoard(
                    () => I.Set(I.fromJS([[0, 0], [0, 1], [1, 1]])),
                    boardSizeFn,
                    (coords) => true,
                    I.Set(I.List.of(10, 10))
                )
            )
        );
    });
});