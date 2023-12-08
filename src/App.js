import logo from './logo.svg';
import './App.css';
import ReactPlayer from 'react-player'
import React, { useState } from 'react';
import Papa from 'papaparse'; 
import ReactDOM from 'react-dom';
import ReactHlsPlayer from 'react-hls-player';

function callAPI(duration_secs, title){
  document.getElementById(title).classList.add('uk-card-secondary');
  let request = new XMLHttpRequest();
    let url = "https://cj2j4ag3yf.execute-api.us-east-1.amazonaws.com/InsertAdMarker?duration="
    url = url + duration_secs
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({}));
  printTime(duration_secs);
}

function change(){
  let request = new XMLHttpRequest();
  let url = "https://e30z366870.execute-api.us-east-1.amazonaws.com/change"
  request.open("POST", url);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({}));
  document.getElementById('changed').innerText = "Stop Auto Detect";
}


function callDlt(){
  let request = new XMLHttpRequest();
    let url = "https://b5w37b1i11.execute-api.us-east-1.amazonaws.com/deleteMarker"
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({}));
}

function printTime(duration_secs) {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  let timeString = hours + ':' + minutes + ':' + seconds + " for " + duration_secs + " seconds";

  document.getElementById('time').innerText = timeString;

}

function App() {
  const [csvData, setCsvData] = useState([]);
  const logs = []
  const strings = []
  const [finalLogs, setLogs] = useState([]);
  const pos = {}
  const [finPos, setPos] = useState([]);

  const handleFileUpload = e => {
    // parse CSV file 
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: function(results) {
        setCsvData(results.data);
        console.log(results.data[0])
        for(let i=1; i<results.data.length;i++){
          console.log(results.data[i][0])
          var logposdur = []
          var str = ""
          var log = results.data[i][1]
          var pos = results.data[i][2]
          var dur = results.data[i][9]
          var dur_sec = results.data[i][10]
          str = log+pos+dur+dur_sec
          if(!strings.includes(str)){
            strings.push(str)
            logposdur.push(log)
            logposdur.push(pos)
            logposdur.push(dur)
            logposdur.push(dur_sec)
            console.log(logposdur)
            console.log(logs)
            logs.push(logposdur)
          } 
        }
        setLogs(logs)
      }  
    });
  }

  return (
    <div>
      <div uk-grid class="uk-background-primary uk-padding"  style={{backgroundColor:'black', borderBottom:'2px solid white'}} >
        <div><img src="https://m.media-amazon.com/images/G/01/digital/video/web/Logo-min.png"></img>
        <span style={{paddingLeft:'60%', fontSize:46, color:'#eee'}}>Cloud PCR
        </span>
        </div>
        
    </div>
    <div uk-grid>
        <div class="uk-width-1-1" style={{paddingTop:'20px', paddingBottom:'1px', position:'relative', marginLeft:'42%', marginBottom:'5%'}}>
        <h3 class="uk-text-center" style={{backgroundColor:'rgba(255, 255, 255, 0.9)', padding: '0.5em', position:'absolute'}}>Red Sox @ Yankees</h3></div>
    </div>
    <div className="videos" style={{marginTop:'3%', position:'relative', left:'8%'}}>
      <ReactHlsPlayer
    src="https://d323vnyfir0xwq.cloudfront.net/out/v1/685efb6747b2444fb3078345ab88e502/index.m3u8"
    autoPlay={false}
    controls={true}
    width="40%"
    height="auto"
    style={{marginRight:20, border:'2px solid green'}}
  />
  <ReactHlsPlayer
src="https://611681dbd22d40219f207d3f138674f8.mediatailor.us-east-1.amazonaws.com/v1/master/a6a26923d6c11d31f0be7e64a4cd86647c5565d8/medialiveoutput/index.m3u8?ads.param1=male&ads.param2=Sports,Nature,Food,Cars,"
autoPlay={false}
controls={true}
width="40%"
height="auto"
style={{border:'2px solid white'}}
/>
<p></p>
<h3 style={{display:'inline',paddingLeft:'12%',
marginRight:500}}>MediaLive Output</h3><h3 style={{display:'inline', paddingLeft: '2%'}}>MediaTailor Output</h3>
<p style={{display:'block'}}></p>
<div className="file">
<button id = "changed" style={{marginRight:'2%'}} onClick={()=>change()}>Auto Detect Ads</button>
  <button style={{marginRight:'2%'}} onClick={()=>callDlt()}>Cancel Ad</button>
          <input type="file" onChange={handleFileUpload}/>
          <div style={{border: "3px solid red", width:'fit-content', background:'black', color:'white', fontSize:24, padding:'0.5em', marginTop:'1%'}}>
          <div>Ads Fired at:</div><span id="time"></span></div>
        <div class="uk-accordion-content uk-child-width-1-4@m uk-grid-small uk-grid-match" uk-grid style={{display:'flex', flexWrap:'wrap'}} >
          {finalLogs.map(item => (

<div onClick={() => callAPI(item[3], item[0]+item[1]+item[3])}>
          <div id={item[0]+item[1]+item[3]} class="uk-card uk-card-default uk-card-body" style={{marginBottom:"5%"}}>
              <h3 class="uk-card-title"> {item[0]}{'\t'}{item[1]}{'\t'}({item[2]})</h3>
          </div>
          </div>


            
       
      ))}</div>
    </div>
    </div>
    </div>
  );
}

export default App;
