
import { makeAutoObservable } from "mobx"
import service from './service'

const ROWS=14;
const COLS=14;

class tictactoe_service {
    board:any[][];
    winner:String="";
    gameId:String="";
    msg:String="";
    isOn:Boolean=false;

    constructor ()
    {
        this.board = Array(ROWS).fill(0).map(x => Array(COLS).fill(' '));
        makeAutoObservable(this);
    }

    setOn(isOn_:Boolean)
    {
        this.isOn = isOn_;
    }


    setMsg(msg_:String)
    {
        this.msg = msg_;
    }

    setWinner(winner_:String)
    {
        this.winner = winner_;
    }

    setBoard(x:number,y:number,mark:String)
    {
        this.board[y][x] = mark;
        this.board = this.board.slice();
        console.log(this.board);
    }
    
    startGame(gameId_: String)
    {
        if ( service.player == 0){
            this.isOn =true;
            this.setMsg("Sinun vuorosi.");
        }
        else
        {
            this.isOn =false;
            this.setMsg("Vastustajan vuoro.");
        }
        this.winner = "";
        this.gameId=gameId_;
        this.board = Array(ROWS).fill(0).map(x => Array(COLS).fill(' '));
    }   

    event(data:any)
    {
        console.log("Event happened tictactoe"+data.event2);
        switch(data.event2)
        {
            case "SET": 
            if ( data.data.p == 0)
                this.setBoard(data.data.x,data.data.y,"X");
            if ( data.data.p == 1)
                this.setBoard(data.data.x,data.data.y,"0"); 
            break;

            case "GAMEOVER": 
                if ( data.data.username == service.username )
                    this.setMsg("Voitit pelin!");
                else
                     this.setMsg("Hävisit pelin!");
                service.setMsg("");
                this.isOn =false;
                this.setWinner(data.data.username);
            break;

            case "TURN": 

            var tmp="";
                if ( service.player==0) tmp="X";
                if ( service.player==1) tmp="0";        

            if ( data.data.username == service.username )
            {
                this.setOn(true);
                this.setMsg("Sinun vuorosi. ("+tmp+") ");
            }
            else
            {
                this.setOn(false);
                this.setMsg("Vastustajan vuoro.");
            }

        break;
        }
    }
}

export default new tictactoe_service();