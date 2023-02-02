import Button from "./Button";
import styled from "./App.module.css";
import { useState, useEffect } from "react";


function Hello(){
  useEffect(() => {//실행결과를 리턴(Cleanup function)
    console.log("create :)");
    return () => console.log("destroyed :(")
  },[])
  return <h1>Hello</h1>;
}

function App() {
  const [counter,setValue] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [showing,setShowing] = useState(false);
  const [toDo, setToDo] = useState("");
  const [toDos, setToDos] = useState([]);
  const [coinloading, setCoinLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [usd, setUsd] = useState(0);
  const [_coin, buyCoin] = useState(0);
  const [resultCoin, getResult] = useState(0);

  const onClick = () => setValue((prev) => prev + 1);
  const onChange = (event) => setKeyword(event.target.value);
  const onClickShow = () => setShowing(prev => !prev);
  const onChangeToDo = (event) => setToDo(event.target.value);
  const onChangeSelect = (event) => {
    if(event != undefined){
      buyCoin(inputPriceFormat(event.target.value));
    }
  }
  const onChangeInputUSD = (event) => {
    setUsd(inputPriceFormat(event.target.value));
  }
  const onSubmit = (event) => {
    event.preventDefault();
    console.log(toDo);
    if(toDo == ""){
      return;
    }
    setToDo("");
    setToDos(currentArray => [toDo,...currentArray]);
  }
  console.log(toDos);
  console.log("render");
  const inputPriceFormat = (str) => {
    console.log("s", str);
    const comma = (str) => {
      str = String(str);
      return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
    };
    const uncomma = (str) => {
      str = String(str);
      return str.replace(/[^\d]+/g, "");
    };
    return comma(uncomma(str));
  };  
  useEffect(() => {//한번만 실행
    console.log("i run render");
  },[]);
  useEffect(() =>{//특정 state 가 변경되었을때 실행
    if(keyword !== "" && keyword.length > 5)
    console.log("SEARCH FOR",keyword);
  },[keyword]);
  useEffect(() =>{//특정 state 가 변경되었을때 실행
    console.log("on chang keyword & countrt");
  },[keyword,counter]); 

  useEffect(() =>{//특정 state 가 변경되었을때 실행
    console.log(parseInt(usd),_coin);
    if(usd != 0 && _coin != 0){
      getResult(parseInt(usd.split(",").reduce((curr, acc)=> curr + acc, ""))/parseFloat(_coin));
    }else{
      getResult(0);
    }
    
  },[usd,_coin]); 
  useEffect(()=>{
  fetch("https://api.coinpaprika.com/v1/tickers").then(response => response.json()).then(json => {
    console.log("JSON",json);
    setCoins(json);
    setCoinLoading(false);
    buyCoin(json[0].quotes.USD.price);
  });
  },[]);

  return (
    <div>
      <h1 className={styled.title}>Welcome back!!</h1>
      <input onChange={onChange} value={keyword} type="text" placeholder="Search here"/>
      <h1>{counter}</h1>
      <button onClick={onClick}>click me</button><br/>
      <div>
        {showing ? <Hello />:null}
        <button onClick={onClickShow}>{showing ? "Hide":"Show"}</button><br/>
      </div>
      <Button text={"버튼"} />
      <div>
        <h1>My To Dos[{toDos.length}]</h1>
        <form onSubmit={onSubmit}>
        <input type="text" onChange={onChangeToDo} value={toDo} placeholder="Write your to do..." />
        <button>Add To Do</button>
        </form>
        <hr/>
        <ul>
          {toDos.map((item,index) => (<li key={index}>{item}</li>))}
        </ul>
      </div>
      <hr/>
      <div>
        <h1>The Coins!{coinloading ? "" :`(${coins.length})`}</h1>
        {coinloading ? <strong>Loading...</strong>:(
          <div>
          <select onChange={onChangeSelect} title="코인" value={_coin}>
          {coins.map((coin) => 
            <option key={coin.id} value={coin.quotes.USD.price}>{coin.name}({coin.symbol}):{coin.quotes.USD.price} USD</option>
          )
          }
        </select>
        <input type="text" value={usd} onChange={onChangeInputUSD} placeholder="USD Input" />구매시 : {resultCoin} coin
        </div>
        )}
        
      </div>
    </div>
  );
}

export default App;
