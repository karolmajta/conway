import {assert} from 'chai';
import * as I from 'immutable';
import {default as immstruct} from 'immstruct';

import * as actions from '../src/js/actions';
import {
    newGame
} from '../src/js/data';


describe('actions.play', function () {
    it('should set an interval for a period injected in `TICK_LEN`', function () {
        let tickLen = null;
        let injections = {TICK_LEN: 300, setInterval: ((x) => tickLen = 1234)};
        let store = immstruct(newGame());
        actions.play(injections, store);
        assert.equal(1234, tickLen);
    });
    it('should set `intervalId` to whatever the `TICK_LEN` was set before', function () {
        let injections = {TICK_LEN: 300, setInterval: ((x) => 123)};
        let store = immstruct(newGame());
        actions.play(injections, store);
        assert.equal(123, store.cursor().get('intervalId'));
    });
});

describe('actions.pause', function () {
    it('should call injected `clearInterval` function with whatever is current `intervalId`', function () {
        let intervalId = null;
        let injections = {clearInterval: (x) => intervalId = x};
        let store = immstruct(newGame().set('intervalId', 15));
        actions.pause(injections, store);
        assert.equal(15, intervalId);
    });
    it('should reset the `intervalId` to null', function () {
        let injections = {clearInterval: (x) => x};
        let store = immstruct(newGame().set('intervalId', 15));
        actions.pause(injections, store);
        assert.isNull(store.cursor().get('intervalId'));
    })
});

describe('actions.reset', function() {
    it('should call injected `clearInterval` function with whatever is current `intervalId`', function () {
        let intervalId = null;
        let injections = {clearInterval: (x) => intervalId = x};
        let store = immstruct(newGame().set('intervalId', 30));
        actions.reset(injections, store);
        assert.equal(30, intervalId);
    });
    it('should reset the `intervalId` to null', function () {
        let injections = {clearInterval: (x) => x};
        let store = immstruct(newGame().set('intervalId', 30));
        actions.reset(injections, store);
        assert.isNull(store.cursor().get('intervalId'));
    });
    it('should bring the state back to vanilla (new game) state', function () {
        let injections = {clearInterval: (x) => x};
        let store = immstruct(
            newGame().set('intervalId', 30).set('iteration', 100).set('board', I.Set(I.fromJS([[10, 30]])))
        );
        actions.reset(injections, store);
        assert.isTrue(newGame().equals(store.cursor().deref()));
    });
});

describe('actions.toggle', function() {
    it('if given coordinate is present in board should remove it', function () {
        let store = immstruct(newGame().set('board', I.Set(I.fromJS([[0, 0], [0, 1], [1, 1]]))));
        actions.toggle({}, store, I.List.of(0, 0));
        assert.isTrue(I.Set(I.fromJS([[0, 1], [1, 1]])).equals(store.cursor().deref().get('board')));
    });
    it('if given coordinate is not present in board should remove add', function () {
        let store = immstruct(newGame().set('board', I.Set(I.fromJS([[0, 0], [0, 1]]))));
        actions.toggle({}, store, I.List.of(1, 1));
        assert.isTrue(I.Set(I.fromJS([[0, 0], [0, 1], [1, 1]])).equals(store.cursor().deref().get('board')));
    });
});