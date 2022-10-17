import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';

import React, { useState, useEffect, useRef } from 'react';
import { observer } from "mobx-react";
import service from './service';
import Tictactoe from './tictactoe';


type handles = {
    updateGame: () => void,
    restartGame: () => void;
  };
// {"event":"GAME","payload":{"id":"testi","event":"SET","data":{"x":"5","y":"2","p":"0"}}}
const Main = observer(() => {

    const tictactoeRef = useRef<handles>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [username,setUsername] = useState("");
    const [msg,setMsg] = useState("");
    const [dmsg,setDmsg] = useState('{"event":"GAME","payload":{"id":"testi","event":"SET","data":{"x":"5","y":"2","p":"0"}}}');

    useEffect ( () => { 
        console.log("Main aukesi");
    }, []); 


    useEffect ( () => { 
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [service.chat]); 
     
    return (
    <>
    <div style={{display:"flex",justifyContent:"center"}}>{ service.time }</div>

    <Tictactoe ref={tictactoeRef}/>

    <div style={{display:"flex",justifyContent:"center"}}>{ service.msg }</div>
    <strong>Pelaajat </strong>
    <div style={{display:"flex"}} >
    {
        service.users.map((e,index)=>
        service.username == e ? 
        <div key={index}><Button disabled={true} variant="primary">{e}</Button></div>
        : 
        <div key={index}><Button disabled={service.sentInvite != "" || !service.logged} variant="secondary" onClick={ ()=>{ service.sendInvite(e,"tictactoe"); }}>{e}</Button></div>
        )
    }
    </div>
    (Lähetä pelikutsu klikkaamalla pelaaja)
    {
     Object.entries(service.invites).map(([e,ee])=>
     <div style={{paddingTop:"2px"}}>
     <InputGroup>
        <Button style={{width:"80%"}} onClick={()=>
            {
            if (ee ) service.sendAcceptInvite(e.toString(),ee.toString())
            }
            } >
            Hyväksy pelikutsu {e.toString()} ( {ee?.toString()} )
        </Button>
        <Button style={{width:"20%"}} variant="danger" onClick={()=>service.sendRejectInvite(e.toString())}>Hylkää</Button>
    </InputGroup>
    </div>
    )
    }
    {
        service.sentInvite!="" && ( <div style={{paddingTop:"2px"}}><Button style={{width:"100%"}} variant="warning" onClick={()=>{service.sendCancelInvite()}}>Peruuta kutsu pelaajalle {service.sentInvite}</Button></div>)
    }

    <div className="messagesWrapper">
    <ol style={{listStyle: "none", paddingLeft:"10px"}}>
    {
        service.chat.map((e,index ) => <li key={index}> &lt;{e.username}&gt;  { e.msg }</li>)
    }
    </ol>
    <div ref={messagesEndRef} />
    </div>

    {
        !service.logged &&
        <>
        <div style={{paddingTop:"2px"}}>
        <InputGroup>
        <FloatingLabel controlId="floatingInput" label="Anna nimimerkkisi" >
        <Form.Control maxLength={20} value={username} onChange={(e)=>{ setUsername(e.target.value); service.setUsername(e.target.value);  }} placeholder="Anna nimimerkkisi"/>
        </FloatingLabel>
        <Button disabled={!service.connected} onClick={()=>service.login()}>{!service.connected?"Yhdistetään...":"Hyppää sisälle!"}</Button>
        </InputGroup>
        </div>
        </>
    }
    {
        service.logged &&
        <>
        <InputGroup>
        <FloatingLabel controlId="floatingInput" label="Kirjoita chat viesti" >
        <Form.Control  maxLength={100} value={msg} onChange={(e)=>{ setMsg(e.target.value); }} placeholder="Kirjoita viesti"/>
        </FloatingLabel>
        <Button variant="info" onClick={()=>{service.sendChatMessage(msg); setMsg("");}}>Lähetä</Button>
        </InputGroup>
        <div style={{paddingTop:"5px"}}>
        <Button style={{width:"100%"}} variant="warning" onClick={()=>service.logout()}>Hyppää pois</Button>
        </div>
        </>
    }
    </>
    )
});
        /*
        <InputGroup>
        <FloatingLabel controlId="floatingInput" label="JSON viesti" >
        <Form.Control value={dmsg} onChange={(e)=>{ setDmsg(e.target.value);  }} placeholder="JSON VIESTi"/>
        </FloatingLabel>
        <Button onClick={()=>service.sendmsg(dmsg)}>VIESTI</Button>
        </InputGroup>*/

export default Main;
