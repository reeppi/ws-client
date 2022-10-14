import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';

import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import { useSearchParams, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect,forwardRef,useImperativeHandle } from 'react';
import { observer } from "mobx-react";
import service from './service';
import tictactoeService from './tictactoeService';

const ROWS=14;
const COLS=14;
const SIZE=25;

const Tictactoe = forwardRef((props,ref) => {
    const canvasRef = useRef<HTMLCanvasElement |null>(null);
    const canvasClickRef = useRef(false);
    

    useImperativeHandle(ref, () => ({
      updateGame: () => {
         // console.log("Update tictactoe!");
      },
    }));

    useEffect(() => {
      console.log("updateBoard")
      drawBoard();
    }, [tictactoeService.board,tictactoeService.winner,tictactoeService.isOn])

    const drawBoard=()=>
    {
      const canvas = canvasRef.current
      var ctx;
      if ( !canvas ) return;
        ctx = canvas.getContext('2d')
      if (!ctx) return;
      draw(ctx);
    }

    const draw = (ctx:CanvasRenderingContext2D) =>
    {
      console.log("Draw");
     
      if (!tictactoeService.isOn)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      else
        {
          ctx.fillStyle ="#f7fcfc";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
      ctx.fillStyle = "#aaaaaa";


      for (let x=0;x<ROWS+1;x++)
      {
        ctx.beginPath();
        ctx.moveTo(x*SIZE,0);
        ctx.lineTo(x*SIZE,350);
        ctx.stroke();
      }
      for (let y=0;y<COLS+1;y++)
      {
        ctx.beginPath();
        ctx.moveTo(0,y*SIZE);
        ctx.lineTo(350,y*SIZE);
        ctx.stroke();
      }
      for(let y=0;y<ROWS;y++)
      {
        for(let x=0;x<COLS;x++)
        {
          if ( tictactoeService.board[y][x] == "X")
            {
              ctx.beginPath();
              ctx.moveTo(x*SIZE,y*SIZE);
              ctx.lineTo(x*SIZE+SIZE,y*SIZE+SIZE);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(x*SIZE+SIZE,y*SIZE);
              ctx.lineTo(x*SIZE,y*SIZE+SIZE);
              ctx.stroke();
            }
          if ( tictactoeService.board[y][x] == "0")
            {
              ctx.beginPath();
              ctx.arc(x*SIZE+SIZE/2,y*SIZE+SIZE/2,SIZE/2-2,0,2*Math.PI);
              ctx.stroke();
            }
        }
      }

      if ( tictactoeService.winner != "")
      {

     
        ctx.font = '30px arial';
        var txt = tictactoeService.winner.toString()+" voitti!";
        var w=ctx.measureText(txt).width;
      
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ctx.canvas.width/2-w/2,SIZE,w,35);

        ctx.fillStyle = '#000000';
        ctx.globalAlpha = 0.7;
        ctx.fillText(txt, ctx.canvas.width/2-w/2, 60);
      }
      ctx.globalAlpha = 1;

    }

    const onCanvasMouseDown = (e:any) =>
    {

      if ( canvasClickRef.current ) return;
      canvasClickRef.current=true;
      if ( !canvasRef.current) return;
      let rect = canvasRef.current.getBoundingClientRect();
      let x = (e.clientX-rect.left);
      let y = (e.clientY-rect.top);
      if ( x < 0  || y < 0 ) return;
      x = Math.floor(x / SIZE);
      y = Math.floor(y / SIZE);
      console.log("CLICK X:"+x +"  Y"+x);
      var gameId=tictactoeService.gameId
      if ( e.button == 0 )
        service.ws.send(JSON.stringify({event:"GAME","payload":{id:gameId,event:"SET",data:{x,y,p:service.player}}}));
   //   if ( e.button == 2 ) 
   //     service.ws.send(JSON.stringify({event:"GAME","payload":{id:"testi",event:"SET",data:{x,y,p:1}}}));
    }
 
    const onCanvasMouseUp = (e:any) =>
    {
      canvasClickRef.current = false;
    }

    return <>
      
      <div style={{display:"flex",justifyContent:"center"}}><strong>Ristinolla</strong></div>
    <div style={{display:"flex",justifyContent:"center"}}>

      <canvas style={{cursor:tictactoeService.isOn?"crosshair":"default"}} onMouseDown={onCanvasMouseDown} onMouseUp={onCanvasMouseUp}  width="350" height="350" ref={canvasRef} />
    </div>
      <div style={{display:"flex",justifyContent:"center"}}>{tictactoeService.msg}</div>
    </>
})
//    <button onClick={()=>tictactoeService.setOn(true)}>----</button>
// 

export default observer(Tictactoe)