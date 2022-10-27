
import { makeAutoObservable } from "mobx"
import service from './service'

// Health  = props.energyKcal   = Health Points eli kestopisteet.
// Attack  = props.carbohydrate = Hyökkäysvoima
// Defence = props.protein     = Puolustusvoima (voidaan käyttää esim. prosentuaalisesti, koska maksimi on tietty 100)
// props.fat
// Delay = Hiilarit + proteiini + rasva

export const ARMYCOUNT =  3;

export interface iStats {
    id: number,
    name: string,
    health: number,
    healthF: number,
    attack: number,
    defence: number,
    delay: number
}

export interface iLog {
    time: number,
    event: string,
    msg: string,
}
  
class foodfight_service {
    loadingData:boolean = false;
    isOn:boolean=false;
    gameId: String="";
    foodArmy: iStats[] = [];  // Lähetään palvelimelle
    oppArmy:iStats[] = []; //Resultteja varten
    army:iStats[]=[]; // Resultteja varten
    data: any[]|null=null; //Finelistä haettavat
    log: iLog[]=[];
    winner: string="";
    opponentReady: Boolean=false;
    ready:Boolean=false;
    score: String="";

    constructor ()
    {
        makeAutoObservable(this);
    }

    clearLog()
    {
        this.log = [];
    }

    clearData()
    {
        this.data = [];
    }

    async fetchFood(food: String)
    {

        try {
        this.data = [];
        this.loadingData=true;
        console.log("fetching foods!!!!!! "+ food);
        var url="";
            if (  window.location.hostname == "localhost" ) 
                url= "http://localhost:3001";
            else 
                url= "https://vast-falls-13808.herokuapp.com";
        
            const response = await window.fetch(url+"/foods?q="+food);
            if ( response.ok)
            {
            this.data  = await response.json();
            if ( !Array.isArray(this.data))
                this.data = [];
            console.log(this.data);
            } else {
                console.log("Response not valid");
            }
        } catch (error:any)
        {
            console.log(error.message);
        } finally {
            this.loadingData=false;
        }

    }

    hasFoodInArmy(id:number)
    {
      for (let i=0;i<this.foodArmy.length;i++)
      {
        if ( this.foodArmy[i].id == id)
            return true;
      }
      return false;
    }

    armyNotReady()
    {
        if ( this.isOn)
        {
            this.ready=false;
            service.ws.send(JSON.stringify({event:"GAME","payload":{id:this.gameId,event:"NOTREADY",data:{p:service.player}}}));
        }
    }

    armyReady()
    {
        if ( this.isOn)
        {
            this.oppArmy=[];
            this.army=[];
            this.data=null;
            this.log= [];
            this.winner="";
            this.ready=true;
            service.ws.send(JSON.stringify({event:"GAME","payload":{id:this.gameId,event:"READY",data:{p:service.player,foodArmy:this.foodArmy}}}));
            console.log("Army ready");
        }
    }

    addToArmy(unit:iStats){
        if ( this.foodArmy.length >= ARMYCOUNT ) return;
        let tmp = this.foodArmy.slice();
        tmp.push(unit);
        this.foodArmy= tmp;
        console.log(unit.name+" Liittyi armeijaan "+this.foodArmy.length );
    }

    removeArmyUnit(index:number)
    {
        let tmp = this.foodArmy.slice();
        tmp.splice(index,1);
        this.foodArmy= tmp;
    }

    event(data:any)
    {
        console.log("Event happened at foodfight service "+data.event2);
        switch(data.event2)
        {
            case "RESULT": 
                this.ready=false;
                this.opponentReady=false;
                this.log = data.data.log;
                this.winner = data.data.winner;
                this.score = data.data.score;
                this.oppArmy = data.data.oppArmy;
                this.army = data.data.army;
                break;
            case "IAMREADY":
                console.log("opponent ready")
                this.opponentReady=true;
                break;
            case "IAMNOTREADY":
                console.log("opponent not ready")
                this.opponentReady=false;
            break;
            
        }
    }

    startGame(gameId_: String)
    {
        this.isOn=true;
        this.gameId=gameId_;
        this.opponentReady=false;
        this.ready=false;
        this.winner="";
        this.log=[];
        this.data=null;
        this.score="";
        this.oppArmy=[];
        this.army=[];
    }   
}

export default new foodfight_service();