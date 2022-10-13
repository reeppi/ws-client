
import { makeAutoObservable } from "mobx"
import { makeObservable, observable, action } from "mobx"

import tictactoeService from "./tictactoeService";

type chatMsg = {
    username: String;
    msg: String;
}

class service {
   ws:any;
   username:String="";
   msg:String="";
   time:String= "";
   users:String[]= [];
   logged:Boolean=false;
   chat:chatMsg[]=[];
   invites: any = {};
   sentInvite:String="";
   game:String="tictactoe";
   gameMsg:any;
   startGame:Boolean=false;
   player:number=0;

   constructor() {
    makeObservable(this, {
        users: observable,
        time: observable,
        logged: observable,
        chat: observable,
        gameMsg: observable,
        sentInvite: observable,
        invites: observable,
        startGame: observable,
        msg:observable,
        setSentInvite: action,
        setInvite:action,
        setGameMsg: action,
        setGame: action,
        setTime: action,
        setUsers: action,
        setUsername: action,
        setMsg: action,
        addChatMsg: action,
        setStartGame: action,
   
    })
    }
    setPlayer(player_:number) { this.player = player_; }
    setStartGame(startGame_:Boolean) { this.startGame = startGame_; }
    setGame(game_:any) { this.game = game_; }
    setGameMsg(gameMsg_:any) { this.gameMsg = gameMsg_; }
    setTime(time_:String) { this.time = time_;}
    setUsers(users_:String[]) { this.users = users_; }
    setUsername(username_:String) { this.username = username_; }
    setMsg(msg_:String) { this.msg = msg_; }
    setSentInvite(username_:String) { this.sentInvite = username_; }
    setLogged(logged_:Boolean) { this.logged = logged_; }
    setInvite(username_:string, game_:string){ this.invites[username_]=game_;  }
    deleteInvite(username_:string){delete this.invites[username_]; }
    addChatMsg(username_:String, msg_:String) {this.chat.push({username:username_,msg:msg_});  this.chat=this.chat.slice();}

   connect()
    {
        console.log("connecting websocket");   
        var url=""
        console.log("Url: "+window.location.hostname);
        
        if (  window.location.hostname == "localhost" ) 
            url= "ws://localhost:3001";
        else 
            url= "ws://vast-falls-13808.herokuapp.com";

        this.ws=new WebSocket(url);
        this.ws.onmessage = (e:any) => {
            var data = JSON.parse(e.data);
            switch ( data.event )
            {
                case "TIME" :this.setTime(data.payload); break;
                case "MSG" :this.setMsg(data.payload.msg); break;
                case "CHAT" : this.addChatMsg(data.payload.username,data.payload.msg); break;
                case "LOGINOK" :this.setLogged(true); break;
                case "INVITE" : this.setInvite(data.payload.username,data.payload.game);  break; //Sait pelikutsun lisätään se invite-listaan.
                case "CANCELINVITE" : this.deleteInvite(data.payload.username); break; //Lähettäjä ei halunnutkaan pelata kanssasi ja perui kutsun.
                case "ACCEPTINVITE" :  this.acceptInvite(data.payload.username); break;
                case "REJECTINVITE" : this.setSentInvite(""); break;
                case "LOGOUTOK" :this.setLogged(false); break;
                case "USERS" :console.log(data.payload); this.setUsers(data.payload); break;
                case "GAME" :  this.gameEvent(data);
            }     
          };
    }

    acceptInvite(username:String)
    {
        //Pelikutsusi hyväksyttiin 
        //Aloitetaan peli (game muuttuja).
        //console.log(data.payload.username+" pelaaja hyväksyi kutsun peliin"); 
        console.log("Aloitetaan peli "+this.game);
        this.setSentInvite(""); 
        this.setPlayer(0);
        this.setMsg("Peli on käynnissä pelaajan "+username+" kanssa.");
        console.log("Pelaaja hyväksyi kutsun peliin"); 
        switch (this.game)
        {
            case "tictactoe": tictactoeService.startGame(this.username); break; //gameId on oma usernamesi
        }
    }

    sendAcceptInvite(toUsername:string, game_:string|null) // Lähetään hyväksyntä pelistä. (valitaan invite-listalta)
    {
        // Aloitetaan peli
        if ( game_)
        {
            this.setMsg("Peli on käynnissä pelaajan "+toUsername+" kanssa.");
            this.setPlayer(1);
            this.setGame(game_);
            this.deleteInvite(toUsername);
            console.log("send Accept Invite to "+ toUsername);
            this.ws.send(JSON.stringify({event:"ACCEPTINVITE",payload:{username:toUsername}}));
            switch (this.game)
            {
                case "tictactoe": tictactoeService.startGame(toUsername);  break; //GameId on kutsun lähettäjän username
            }
        } 
    }

    gameEvent(data:any)
    {
        switch ( this.game )
        {
            case "tictactoe": tictactoeService.event(data);
        }

    }


    sendInvite(toUsername:String,game:String) //Pelikutsun lähetys, asetetaan pelattava peli game muuttujaan
    {
        console.log("send Invite to "+ toUsername);
        this.ws.send(JSON.stringify({event:"INVITE",payload:{username:toUsername,game}}));
        this.setGame(game);
        this.setSentInvite(toUsername);
    }

    sendCancelInvite()
    {
        console.log("send Cancel Invite to "+ this.sentInvite);
        this.ws.send(JSON.stringify({event:"CANCELINVITE",payload:{username:this.sentInvite}})); 
        this.setSentInvite("");
    }

    sendRejectInvite(toUsername:string)
    {
        console.log("send Reject Invite to "+ toUsername);
        this.deleteInvite(toUsername);
        this.ws.send(JSON.stringify({event:"REJECTINVITE",payload:{username:toUsername}})); 
    }

    sendChatMessage(msg:String)
    {
        console.log("send " + msg);
        this.ws.send(JSON.stringify({event:"CHAT",payload:{msg}}));
    }

    sendmsg(dmsg:String)
    {
        console.log("send " + dmsg);
        this.ws.send(dmsg);
    }

    login()
    {
        console.log("login " + this.username);
        this.ws.send(JSON.stringify({event:"LOGIN",payload:{username:this.username}}));
    }

    logout()
    {
        console.log("loginOut " + this.username);
        this.ws.send(JSON.stringify({event:"LOGOUT",payload:{username:this.username}}));
    }

}

const cc = new service();
cc.connect();
export default cc;
