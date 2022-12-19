import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';
import { useState, useRef, useEffect,forwardRef,useImperativeHandle } from 'react';
import { observer } from "mobx-react";
import service from './service';
import Spinner from 'react-bootstrap/Spinner';
import foodfightService, { iLog, iStats } from './foodfightService';

const RND=100;
// Health  = energyKcal   = Health Points eli kestopisteet.
// Attack  = carbohydrate = Hyökkäysvoima
// Defence = protein     = Puolustusvoima (voidaan käyttää esim. prosentuaalisesti, koska maksimi on tietty 100)
// Delay = Hiilarit + proteiini + rasva

const Foodfight = forwardRef((props,ref) => {
    
    const [foodInput,setFoodInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      updateGame: () => {
         // console.log("Update foodfight!");
         // Tälle ei käyttöä mutta annetaan olla.
      },
    }));

    useEffect ( () => { 
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [foodfightService.log]); 
   

    useEffect ( () => { 
        foodfightService.armyNotReady();
    }, [foodfightService.foodArmy]); 

    return <>
      <div className="center"><strong>Ruokarähinä </strong></div>
      <div className="center"><a href="https://koodihaaste.solidabis.com/" target="_blank"> koodihaaste.solidabis.com</a></div>
      Luo ruokajengisi elintarvikkeista!
        <div style={{paddingTop:"2px"}}>
        <InputGroup>
        <FloatingLabel controlId="floatingInput" label="Hae jengiisi elintarvike" >
        <Form.Control maxLength={20} value={foodInput} 
          onKeyPress={e => {
            if (e.code=="Enter")
              foodfightService.fetchFood(foodInput)
           } } 
          onChange={(e)=>{ setFoodInput(e.target.value);}} placeholder=""/>
        </FloatingLabel>
        <Button variant="warning" onClick={()=>{ setFoodInput(""); foodfightService.clearData(); }}>Tyhjennä</Button>
        <Button 
        onClick={()=>foodfightService.fetchFood(foodInput)}> Hae </Button>
        </InputGroup>
        {
          foodfightService.data && foodfightService.data.length == 0 && <div>Haulla ei löytynyt ruokaa.</div>
        }
        <a href="http://www.fineli.fi">Finelin</a> apia käytetään elintarviketietojen hakemiseen.
        <div><strong>Ruokajengi (valitse max 3 eri ruokaa)</strong></div>
        {
          foodfightService.foodArmy && foodfightService.foodArmy.map((e:iStats,index:number)=><div style={{paddingTop:"2px"}} key={index}><Button style={{width:"100%"}} onClick={()=>foodfightService.removeArmyUnit(index)}>{index+1}. {e.name} [Poista]</Button></div>)
        }
        {
         foodfightService.foodArmy.length > 0 &&
         <div style={{paddingTop:"2px"}}> 
         <Button disabled={!foodfightService.isOn} style={{width:"100%"}}  variant={foodfightService.ready?"success":"danger"} 
                  onClick={()=>
                   { 
                    if (!foodfightService.ready )
                      foodfightService.armyReady()
                    else
                      foodfightService.armyNotReady()
                   }
                  }> {foodfightService.isOn?"Valmis rähinään!":"Odotetaan vastustajaa"}</Button>
         </div>
        }

        {
          foodfightService.opponentReady && <div className="center"><strong>Vastustaja odottaa sinua rähinään!!!</strong></div> 
        }
        {
          !foodfightService.opponentReady  &&  <div className="center">Vastustaja ei ole valmis.</div>
        }

        {
          foodfightService.data && foodfightService.data.filter( (e:any)=>e.type.code=="FOOD").map( (e:any)=><FoodEntry key={e.id} {...e}/> )
        }
        {
          foodfightService.loadingData && <div className="center"><Spinner animation="border" variant="primary" /></div>
        }
   

        { foodfightService.log.length > 0 &&
          <div className="messagesWrapper2">
            <ul >
            {
            foodfightService.log.map((e:iLog,index:number)=>
            {
              if ( e.event == "death")
                return <li key={index}><strong>{e.time}s {e.msg}</strong></li>
              else
                return <li key={index}>{e.time}s {e.msg}</li>
            }
            )
            }
            </ul>
          <div ref={messagesEndRef}/>
          </div>
        }

        {
          foodfightService.winner !="" && 
          <>
            { foodfightService.winner == service.username && <div className="center"><strong>Jengisi voitti rähinän! { foodfightService.score }</strong></div> }
            { foodfightService.winner != service.username && <div className="center"><strong>Jengisi hävisi rähinän! { foodfightService.score }</strong></div> }
         </>
        }

        {
          foodfightService.winner != "" && foodfightService.oppArmy &&
          <>
            <strong>Vastustajan jengi</strong>

            <ul style={{display:"InlineBlock"}}>
              {
                foodfightService.oppArmy.map((e:iStats,index:number)=>
                {
                if ( e.health < 0 )
                  return <li key={index}><div style={{color:"maroon"}}>{e.name} ({Math.max(Math.round(e.health*10),0)/10}/{Math.round(e.healthF*10)/10}) - <strong>tuupertui</strong></div> <Stats stats={e}/></li>
                else 
                  return <li key={index}><div style={{color:"DarkGreen"}}>{e.name} ({Math.round(e.health*10)/10}/{Math.round(e.healthF*10)/10})</div> <Stats stats={e}/></li>
                })
              }
              </ul>
          </>
        }

        {
          foodfightService.winner != "" && foodfightService.army &&
          <>
            <strong>Oma jengisi</strong>
            <ul style={{display:"InlineBlock"}}>
              {
                foodfightService.army.map((e:iStats,index:number)=>
                {
                if ( e.health < 0 )
                  return <li key={index}><div style={{color:"maroon"}}>{e.name} ({Math.max(Math.round(e.health*10),0)/10}/{Math.round(e.healthF*10)/10}) - <strong>tuupertui</strong></div> <Stats stats={e}/></li>
                else 
                  return <li key={index}><div style={{color:"DarkGreen"}}>{e.name} ({Math.round(e.health*10)/10}/{Math.round(e.healthF*10)/10})</div> <Stats stats={e}/></li>
                })
              }
            </ul>
          </>
        }

        </div>
    </>
})

const Stats = ({stats}:{stats:iStats}) => 
{
return <ul style={{paddingLeft: "0", listStyle:"none"}}><li><i>Hyökkäys:{stats.attack} Puolustus:{stats.defence} Hitaus:{stats.delay}</i></li></ul>
}

export default observer(Foodfight)


const FoodEntry = (props:any) => {


  let stats:iStats ={
    id: props.id,
    name: props.name.fi,
    health: Math.round(props.energyKcal*RND)/RND,
    healthF: Math.round(props.energyKcal*RND)/RND,
    attack: Math.round(props.carbohydrate*RND)/RND,
    defence: Math.round(props.protein*RND)/RND,
    delay: Math.round((props.fat+props.carbohydrate+props.protein)*RND)/RND
  } 

  return <>
    <li><a href={`https://fineli.fi/fineli/api/v1/foods/${stats.id}`} target="_blank"> {stats.id }</a>.  {stats.name}
        <ul>
          <li>Energia: {stats.health} Kcal</li>
          <li>Hiilarit: {stats.attack } g</li>
          <li>Proteiini: {stats.defence} g</li>
          <li>Rasva: {Math.round(props.fat*RND)/RND} g</li>
          <li>Hela: { stats.health }, 
          {
          stats.attack==0 ? 
          <div style={{color:"red",display:"inline"}}> Hyökkäys: { stats.attack }</div> : 
          <div style={{color:"black",display:"inline"}}> Hyökkäys: { stats.attack }</div>
          }
          , 
          
          Puolustus : {stats.defence}, Hitaus: {stats.delay}s </li>
            {
            !foodfightService.hasFoodInArmy(stats.id) && <Button onClick={()=>foodfightService.addToArmy(stats)}>Lisää ruoka jengiisi</Button>
            }
        </ul>
    </li>
  </>
}
//<Button onClick={()=>foodfightService.addToArmy(stats)}>Lisää ruoka jengiisi</Button>
//!foodfightService.hasFoodInArmy(stats.id) && <Button onClick={()=>foodfightService.addToArmy(stats)}>Lisää ruoka jengiisi</Button>

