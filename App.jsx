"use strict";
import { use, useState } from 'react'
import { useEffect } from 'react'
import cardBack from  './assets/bg-card-back.png'
import cardFront from  './assets/bg-card-front.png'
import mainDesktop from  './assets/bg-main-desktop.png'
import cardLogo from  './assets/card-logo.svg'
import favicon from  './assets/favicon-32x32.png'
import iconComplete from  './assets/icon-complete.svg'
import './App.css'
import { StrictMode } from 'react'
/**first check if inputs is empty , then check if the number is valid */



function InteractiveCardDetails({cardNumber,cardHolder,exampleUser,month,year,cvc}){
  return(
    <>
          <span id='numbers-on-card'>{(cardNumber.replace(/\s/g, '').match(/.{1,4}/g)?.join(' '))||'0000 0000 0000 0000'}</span>
          
          <div>
            <p id='name-on-card'>{cardHolder || exampleUser}</p>
            <span id="date-on-card">{month || '00'}/{year || "00"}</span>
          </div>
          
          <div id='cvc-on-card'>
            <span>{cvc ||'000'}</span>
          </div>
    </>
  );

}
function ShowCompletedState({iconComplete,setCompleted,setCardHolder,setCardNumber,setMonth,setYear,
setCvc,setNameErrorMsg,setNumberErrorMsg,setDateErrorMsg,setCvcErrorMsg,setSubmitted,setValidInputs,setNotEmpty}){
  return(
    <div id='completed-state'>
    <img src={iconComplete} alt='completed state Icon' id='icon-complete'/>
    <p className='completed-state-text'>THANK YOU!</p>
    <p className='completed-state-text' id='gray-text'>We've added your card details</p>
    <button id='completed-state-button' onClick={() => {
    setCompleted(0);
    setCardHolder("");
    setCardNumber("");
    setMonth("");
    setYear("");
    setCvc("");
    setNameErrorMsg("");
    setNumberErrorMsg("");
    setDateErrorMsg("");
    setCvcErrorMsg("");
    setSubmitted(0);
    setValidInputs(0);
    setNotEmpty(0);
  }}>Continue</button>

    </div>
  );

}
function isEmpty({cardHolder,cardNumber,month,year,cvc,setNotEmpty,setNameErrorMsg,setNumberErrorMsg,setDateErrorMsg,setCvcErrorMsg}){
        if(!cardHolder||!cardNumber||!month||!year||!cvc){
            
            setNotEmpty(0)                /**there is at least on field empty */

            !cardHolder?      setNameErrorMsg("Cannot be blank") :setNameErrorMsg("")
            
            !cardNumber?      setNumberErrorMsg("cannot be blank") :setNumberErrorMsg("")
            
            const monthAndYearEmpty=!month&&!year;
            monthAndYearEmpty?           setDateErrorMsg("month and year are empty") : (!month? setDateErrorMsg("month cannot be blank") :(!year? setDateErrorMsg("year cannot be blank") :setDateErrorMsg("")) )
           
            !cvc?             setCvcErrorMsg("cannot be blank"):setCvcErrorMsg("")
        }
        
          else{
          setNotEmpty(1)        /**every filed is filled,but they may still be invalid entries */
        }
}
function isValidInputs({cardNumber,month,year,cvc,setValidInputs,setNumberErrorMsg}){
         const regex1 = /^\d{16}$/;
         const cardNumberValid=regex1.test(cardNumber.replace( /\s/g,"" ))
         
         if (cardNumberValid){
              setValidInputs(1);
         }
        else{
          setValidInputs(0);
          
          /**the case when <p></p> or div have differnt kind of error-masseges : one error at at time*/
          const notNumber=isNaN(Number(cardNumber))
          const inputExist= cardNumber
          const condition=inputExist&&notNumber
          const notCorrectLength =inputExist&&(!cardNumberValid)&&!notNumber
          condition?   setNumberErrorMsg("numbers only") : (notCorrectLength? setNumberErrorMsg("less than 16 digits not allowed") : (!cardNumber?      setNumberErrorMsg("cannot be blank") :setNumberErrorMsg("")) )
          

        }
}
function UpdateState({validInputs,submitted,notEmpty,setCompleted}){
    
    if (submitted&&validInputs&&notEmpty){
        setCompleted(1);
    }
    else{
      setCompleted(0);
    }

}
function StaticComponents({mainDesktop,cardFront,cardBack,cardLogo}){
      return(
        <div>
          <img  src= {mainDesktop} alt='main desktop' id="main-desktop"/>
          <img  src= {cardFront} alt='card front' id="card-front"/>

          <img  src= {cardBack} alt='card back' id="card-back"/>
          <img  src= {cardLogo} alt='card logo' id="card-logo"/>
        </div>
      );
}

function DisplayForm({
                          submitted,setSubmitted
                          ,cardHolder,setCardHolder 
                          ,cardNumber,setCardNumber 
                          ,month,setMonth 
                          ,year,setYear 
                          ,cvc,setCvc
                          ,nameErrorMsg,numberErrorMsg,dateErrorMsg,cvcErrorMsg
                          ,setValidInputs,setNotEmpty,
                          setNameErrorMsg,setNumberErrorMsg,setDateErrorMsg,setCvcErrorMsg,
                          exampleUser
                    }){
    
    const currentYear=new Date().getFullYear()%100;
    const expictedExpieryDate=currentYear+5; //usually 5 years
      
    
    return(
        <div id='form'>
          <form>
            <p className="black" id='text'>CARDHOLDER NAME</p>
            <input type="text"  id="card-holder"    placeholder={`e.g. ${exampleUser}`}  maxLength={26} value={cardHolder} onChange={(e)=>setCardHolder(e.target.value)}/>
            <p className='error-msg'>{nameErrorMsg}</p>
            
            <p className="black" id='text'>CARD NUMBER</p>
            <input type="text" id="card-number"  maxLength={16} value={cardNumber} placeholder='e.g. 1234 5678 9123 0000' onChange={(e)=>setCardNumber(e.target.value.replace(/\s/g,""))}/>
            <p className='error-msg'>{numberErrorMsg}</p>
            
            <div id='date-and-cvc'>
              <p className='black'>Expiration Date (MM/YY)</p>
              <p className='black'>cvc</p>
            </div>
             <div id="grid-inputs">
              <input type="text" id="month" maxLength={2} placeholder='MM' value={month}  onChange={e=>setMonth( Math.min( parseInt( e.target.value ) || 0 , 12 ) )}/>
              <input type="text" id="year" maxLength={2} placeholder='YY' value={year} onChange={e=>setYear( Math.min( parseInt( e.target.value ) || 0 ,expictedExpieryDate ) )}/>
              <input type="number" id="cvc" maxLength={3} placeholder='e.g. 123' value={cvc} onChange={e=>setCvc( Math.min( e.target.value , 999 ) )}/>
            </div>  
            <p className='error-msg' id='month-year-error-msg'>{dateErrorMsg}</p>
            <p className='error-msg' id='cvc-error-msg'>{cvcErrorMsg}</p>          
            
            <button id='submit'  value={submitted} onClick={(e)=>{
              e.preventDefault();
              isEmpty({cardHolder,cardNumber,month,year,cvc, setNotEmpty, setNameErrorMsg,setNumberErrorMsg,setDateErrorMsg,setCvcErrorMsg});
              isValidInputs({cardNumber,month,year,cvc,setValidInputs,setNameErrorMsg,setNumberErrorMsg,setDateErrorMsg,setCvcErrorMsg});
              setSubmitted(1);

              
            }}>Confirm</button>
          </form>
         
          <InteractiveCardDetails 
              cardNumber={cardNumber} 
              cardHolder={cardHolder} 
              exampleUser={exampleUser} 
              month={month} 
              year={year} 
              cvc={cvc}
          />
        
        </div>
      );
}
function App() {
  const [completed, setCompleted] = useState(0) /** Main State that control what is the thing Rendered in the UI 0 : not completed , 1 : completed */
  
  /** to calculate the main State,we need helper variables or States (submitted , validInputs , and Empty)*/
  /**the following three states will be used to calculate the completed state */
  const [submitted, setSubmitted] = useState(0) /**helper State */
  const [validInputs, setValidInputs] = useState(0) /**helper State */
  const [notEmpty, setNotEmpty] = useState(0) /**helper State */
  
  /** thoses states determing if Input is valid  */
  /**initial values of those fields are empty strings ,because they will be compared to regex */
  const [cardHolder, setCardHolder] = useState("") /**helper State */ 
  const [cardNumber, setCardNumber] = useState("") /**helper State */
  const [month, setMonth] = useState("") /**helper State */
  const [year, setYear] = useState("") /**helper State */
  const [cvc, setCvc] = useState("") /**helper State */
  const [nameErrorMsg,setNameErrorMsg]=useState("")
  const [numberErrorMsg,setNumberErrorMsg]=useState("")
  const [dateErrorMsg,setDateErrorMsg]=useState("")
  const [cvcErrorMsg,setCvcErrorMsg]=useState("")
  const exampleUser='Jane Appleased'
  useEffect(()=>UpdateState({validInputs,submitted,notEmpty,setCompleted}),[validInputs,submitted,notEmpty])
  
  if (!completed){
return (
    <div className='grid-container' id='entire-screen'> 
        
        
        
        <StaticComponents  mainDesktop={mainDesktop} 
        cardFront={cardFront} 
        cardBack={cardBack} 
        cardLogo={cardLogo}
        />
        
        <DisplayForm  
        submitted={submitted} setSubmitted={setSubmitted}
        
        cardHolder={cardHolder} setCardHolder={setCardHolder} 
        
        cardNumber={cardNumber} setCardNumber={setCardNumber} 
        
        month={month} setMonth={setMonth} 
        
        year={year} setYear={setYear}
        
        cvc={cvc} setCvc={setCvc}
        
        nameErrorMsg={nameErrorMsg} numberErrorMsg={numberErrorMsg} dateErrorMsg={dateErrorMsg} cvcErrorMsg={cvcErrorMsg}
        
        setValidInputs={setValidInputs}  setNotEmpty={setNotEmpty}
        
        setNameErrorMsg={setNameErrorMsg}setNumberErrorMsg={setNumberErrorMsg}setDateErrorMsg={setDateErrorMsg} setCvcErrorMsg={setCvcErrorMsg}
        exampleUser={exampleUser}
        />
        

    </div>
    )

  }
  else{ /** question to chatgpt , where to put the following     :    <InteractiveCardDetails 
              cardNumber={cardNumber} 
              cardHolder={cardHolder} 
              exampleUser={exampleUser} 
              month={month} 
              year={year} 
              cvc={cvc}
          /> */
    return(
      <div>
        
        <StaticComponents  mainDesktop={mainDesktop} 
        cardFront={cardFront} 
        cardBack={cardBack} 
        cardLogo={cardLogo}
        />
        <InteractiveCardDetails 
              cardNumber={cardNumber} 
              cardHolder={cardHolder} 
              exampleUser={exampleUser} 
              month={month} 
              year={year} 
              cvc={cvc}
          />

        <ShowCompletedState 
        iconComplete={iconComplete}  
        setCompleted={setCompleted}
        setCardHolder={setCardHolder} 
        setCardNumber={setCardNumber} 
        setMonth={setMonth} 
        setYear={setYear}
        setCvc={setCvc} setNameErrorMsg={setNameErrorMsg} setNumberErrorMsg={setNumberErrorMsg} setDateErrorMsg={setDateErrorMsg} setCvcErrorMsg={setCvcErrorMsg} setSubmitted={setSubmitted} setValidInputs={setValidInputs} setNotEmpty={setNotEmpty}/>

      </div>

    );

  }
  
   
}

export default App
