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
-Frontissa lasketaan ravintoarvoista saadut statsit ja lähetetään backendille.<br/>
-Backendi suorittaa laskutoimitukset frontilta saatujen tietojen perusteella<br/>
-Pelaajille lähetetään loki sekä muuta tietoa rähinästä. <br/>
<br/>
Front: http://minipelit.netlify.app <br/>
Backend (Nodejs): https://github.com/reeppi/ws<br/>
<br/>
Avainsanat : typescript, react, mobx, websocket, canvas, react-bootstrap<br/>
