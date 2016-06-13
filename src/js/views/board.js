import * as React from 'react';
import * as I from 'immutable';


export default class Board extends React.Component {
    componentDidMount () {
        this.draw();
        this._canvas.addEventListener('click', (e) => {
            this.props.onChange(I.List.of(
                Math.floor(e.layerX / (4+1)),
                Math.floor(e.layerY / (4+1))
            ));
        });
    }
    componentDidUpdate () {
        this.draw();
    }
    render () {
        // assumes 4x4 tiles with 2px spacing
        let w = 4*(this.props.xMax-this.props.xMin) + 1*(this.props.xMax-this.props.xMin-1);
        let h = 4*(this.props.yMax-this.props.yMin) + 1*(this.props.yMax-this.props.yMin-1);
        return <canvas ref={(canvas) => this._canvas = canvas} width={w} height={h} />
    }
    draw () {
        if (!this._canvas) { return; }
        let ctx = this._canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.fillStyle = "black";
        I.List(I.Range(this.props.yMin, this.props.yMax)).forEach((y) => {
            I.List(I.Range(this.props.xMin, this.props.xMax)).forEach((x) => {
                ctx.fillStyle = this.props.board.contains(I.List.of(x, y)) ? "black" : "lightgray";
                ctx.fillRect(x*(4+1), y*(4+1), 4, 4);
            });
        });
    }
};