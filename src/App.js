import React, {useState, useEffect} from 'react';
import './App.css';

import data from './data.json';

function App() {
  const [section, setSection] = useState(localStorage.getItem("section"))
  const [popup, setPop] = useState(false)

  const start = () => {
    document.body.style.display = "block";
    markLive();
    fetchQuote();
  }

  const showPopup = () => setPop(!popup)

  const markLive = () => {
    var date = new Date();
    var day = date.getDay();
    var currMin = date.getHours() * 60 + date.getMinutes();
    if (day > 0 && day < 6) {
      var cards = document.getElementsByClassName('row')[day - 1].children;
      for (var i = 1; i < cards.length; i++) {
        var tb = cards[i].children[1].innerText;
        tb = tb.split('-').map(x => x.trim().split(":").map((y, i) => {
          y = parseInt(y);
          y += ((i + 1) % 2) * 12 * (y < 9 | 0)
          return y;
        }).reduce((a, b) => a * 60 + b, 0))

        if (currMin >= tb[0] && currMin <= tb[1]) {
          cards[i].dataset.live = true;
        }else if (currMin < tb[0] && (tb[0] - currMin)<10) {
          cards[i].dataset.upcoming = true;
        }
      }
    }
  }

  const fetchQuote = () => {
    fetch("https://api.quotable.io/random").then(res => res.json()).then(res => {
      document.querySelector(".quote").innerText = res.content;
      document.querySelector(".author").innerText = "~ " + res.author;
      document.querySelector(".quotecont").style.opacity = 1;
    }).catch(err => {
      console.log("Fetching err");
    })
  }

  window.onload = start;
  useEffect(()=>{
    if(section!="gx" && section!="gy"){
      setPop(true)
    }else{
      localStorage.setItem("section", section)
      setPop(false)
    }
  }, [section])

  return (
    <>
    <div className="container">
      {Object.keys(data).map(day => {
        return (
          <div className="row">
            <div className="card">
              <span className="sub">{day}</span>
            </div>
            {data[day].map(sub => {
              return sub.sec==null || sub.sec==section ? (
                <div className="card">
                  <span className="sub" title={sub.title}>
                    {sub.name}
                  </span>
                  <span className="time">
                    <a href={sub.link}>{sub.time}</a>
                  </span>
                </div>
              ):null
            })}
          </div>
        )
      })}
    </div>
    <div className="quotecont">
      <div className="quote"></div>
      <div className="author"></div>
    </div>
    <div className="setcont" onClick={showPopup}>
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" className="">
      </path></svg>
    </div>
    {popup?(
      <div className="popupcont" id="popupcont">
        <div className="popup">
          <div>Choose One</div>
          <div>
            <button type="button" name="button" onClick={()=> setSection("gx")}>️Gx 🦄</button>
            <button type="button" name="button" onClick={()=> setSection("gy")}>Gy</button>
          </div>
        </div>
      </div>
    ):null}
    </>
  )
}

export default App;
