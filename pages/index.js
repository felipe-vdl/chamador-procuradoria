import prisma from '../db';
import { useState, useEffect } from 'react';
import mainLogo from "../public/logo.png";
let first = true;

export default function HomePage(props) {
  const [currentInfo, setCurrentInfo] = useState({
    password: props.currentPassword.password,
    message: props.currentMessage.message,
    counter: props.currentCallCounter.counter
  });
  // const [currentPassword, setCurrentPassword] = useState(props.currentPassword.password);
  // const [currentMessage, setCurrentMessage] = useState(props.currentMessage.message);
  // const [currentCallCounter, setCurrentCallCounter] = useState(props.currentCallCounter.counter);

  useEffect(() => {
    if (first) {
      first = false;
      return
    }

    console.log(currentInfo);

    const voices = window.speechSynthesis.getVoices();
    let newSpeech = new SpeechSynthesisUtterance(`Número ${currentInfo.password}, ${currentInfo.message ?? ""}.`);
    newSpeech.voice = voices[0];
    window.speechSynthesis.speak(newSpeech);
    
  }, [currentInfo.password, currentInfo.message, currentInfo.counter]);

  useEffect(() => {
    const passwordSocket = setInterval(async () => {
      const response = await fetch('/api/current');
      const data = await response.json();

      if ((data.password !== currentInfo.password) || (data.message !== currentInfo.message) || (data.counter !== currentInfo.counter)) {
        setCurrentInfo(st => {
          if (data.password === st.password && data.message === currentInfo.message) {
            return st;
          } else {
            return { password: data.password, message: data.message, counter: data.counter };
          }
        });
      }
    }, 1000);

    return () => clearInterval(passwordSocket);
  }, []);

  // useEffect(() => {
  //   const callCurrentSocket = setInterval(async () => {
  //     const response = await fetch('/api/counter', { method: "GET" });
  //     const data = await response.json();
  //     setCurrentCallCounter(data.counter);
  //   }, 1000);

  //   return () => clearInterval(callCurrentSocket);
  // }, []);

  return (
    <div className='flex flex-col h-screen'>
      <img src={mainLogo.src} className="self-center sm:self-center md:self-start mb-3 mt-5 ml-5 w-[250px]" />
      <h2 className='text-center text-xl mt-auto'>Chamada</h2>
      <div className="m-auto mb-0 mt-3 bg-blue-300 rounded w-[95%] p-4 border-4 rounded-b-none border-b-0 border-indigo-800 text-center text-slate-800 font-bold text-[160px]">
        {currentInfo.password}
      </div>
      <div className='text-[80px] w-[95%] mx-auto font-bold bg-blue-300 rounded p-4 border-4 border-t-2 rounded-t-none border-indigo-800 text-center text-slate-800'>
        {currentInfo.message}
      </div>
      <footer className='mt-auto bg-indigo-800 p-1 text-white text-xs text-center'>2023 © Subsecretaria de Tecnologia da Informação — Prefeitura Municipal de Mesquita</footer>
    </div>
  );
}

export const getServerSideProps = async context => {
  let currentPassword = await prisma.currentPassword.findMany();
  currentPassword = JSON.parse(JSON.stringify(currentPassword));

  let currentCallCounter = await prisma.counter.findMany();
  currentCallCounter = JSON.parse(JSON.stringify(currentCallCounter));

  let currentMessage = await prisma.currentMessage.findMany();
  currentMessage = JSON.parse(JSON.stringify(currentMessage));

  return {
    props: {
      currentPassword: currentPassword[0],
      currentCallCounter: currentCallCounter[0],
      currentMessage: currentMessage[0]
    }
  }
}