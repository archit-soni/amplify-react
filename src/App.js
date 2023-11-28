import logo from './logo.svg';
import './App.css';
import ReactPlayer from 'react-player'
import React, { useState } from 'react';
import Papa from 'papaparse'; 
import ReactDOM from 'react-dom';
import ReactHlsPlayer from 'react-hls-player';

function callAPI(){
  let request = new XMLHttpRequest();
    let url = "https://cj2j4ag3yf.execute-api.us-east-1.amazonaws.com/InsertAdMarker?duration=60"
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({}));
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
          var log = results.data[i][0]
          var pos = results.data[i][1]
          var dur = results.data[i][8]
          str = log+pos+dur
          if(!strings.includes(str)){
            strings.push(str)
            logposdur.push(log)
            logposdur.push(pos)
            logposdur.push(dur)
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
    
    <div className="videos" style={{marginTop:20}}>
      <ReactHlsPlayer
    src="https://d323vnyfir0xwq.cloudfront.net/out/v1/685efb6747b2444fb3078345ab88e502/index.m3u8"
    autoPlay={false}
    controls={true}
    width="30%"
    height="auto"
    style={{marginRight:20}}
  />
  <ReactHlsPlayer
src="https://611681dbd22d40219f207d3f138674f8.mediatailor.us-east-1.amazonaws.com/v1/master/a6a26923d6c11d31f0be7e64a4cd86647c5565d8/medialiveoutput/index.m3u8"
autoPlay={false}
controls={true}
width="30%"
height="auto"
/>
<p></p>
<h3 style={{display:'inline',
marginRight:500}}>MediaLive Output</h3><h3 style={{display:'inline'}}>MediaTailor Output</h3>
<p style={{display:'block'}}></p>
<div className="file">
          <input type="file" onChange={handleFileUpload}/>
          {finalLogs.map(item => (
        <div style={{margin:20, marginRight:800, paddingLeft:50, paddingBottom:30, borderStyle:'solid'}}key={item}><h4 onClick={callAPI}>{item[0]}{'\t'}{item[1]}{'\t'}</h4>{item[2]}</div>
      ))}
    </div>
    </div>
  );
}

export default App;
