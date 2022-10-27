# Minipelit

Minipelit sivun frontti<br/>
Pelejä tällä hetkellä<br/>
-ristinolla <br/>
-ruokarähinä (Solidabiksen koodihaaste)<br/>
Pelit ovat netin välityksellä pelattavia kaksinpelejä<br/>
Frontti tehty Reactilla käyttäen mobx-tilanhallintaa.<br/>
Tiedonsiirto NodeJs (websocket) serverin välityksellä<br/>
<br/>
Ruokarähinä (lyhyt kuvaus)<br/>
-Ruokarähinään voi osallistua kaksi pelaaja josta kukin valitsee maximissaan 3 eri ruokaa<br/>
-Frontissa lasketaan ravintoarvojen perusteella statsit jotka lähetetään backendille.<br/>
-Backendi suorittaa laskutoimitukset frontilta saatujen tietojen perusteella<br/>
-Kummallekkin pelaajalle lähetetään loki rähinästä sekä muuta tietoa. <br/>
<br/>
Front: http://minipelit.netlify.app <br/>
Backend (Nodejs): https://github.com/reeppi/ws<br/>
<br/>
Avainsanat : typescript, react, mobx, websocket, canvas, react-bootstrap<br/>
