import { useState, useEffect } from 'react';
import prisma from '../db';
import mainLogo from "../public/logo.png";
let first = true;

export default function AdminPage(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(props.currentPassword.password);
  const [currentMessage, setCurrentMessage] = useState(props.currentMessage.message);
  const [currentCallCounter, setCurrentCallCounter] = useState(props.currentCallCounter.counter);

  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const passwordSocket = setInterval(async () => {
      const response = await fetch('/api/current');
      const data = await response.json();
      setCurrentPassword(data.password);
      setCurrentMessage(data.message);
      setCurrentCallCounter(data.counter);
    }, 1000);

    return () => clearInterval(passwordSocket);
  }, []);

  const handleChamarProximo = async (n) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/proximo', {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
          nextId: currentPassword + n,
          currentId: currentPassword,
          message: messageInput
        }),
      });
      const data = await response.json();

      if (data.id === currentPassword) {
        setIsLoading(false);
        return
      }

      setCurrentPassword(data.id);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }

  const handleChamarAtual = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/counter', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: messageInput,
        })
      });
      const data = await response.json();
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <img src={mainLogo.src} className="self-center sm:self-center md:self-start mb-3 mt-5 ml-5 w-[250px]" />
      <div className="shadow-md shadow-blue-800 m-auto bg-blue-300 rounded p-8 border-8 border-indigo-800 text-center text-slate-800 font-bold">
        <p className="text-3xl">Painel</p>
        <span className="text-[96px]">{currentPassword}</span>
        <p className="text-xl">{currentMessage}</p>
      </div>
      <div className="flex flex-col text-white gap-8 mx-auto px-4">
        <div className='mx-auto'>
          <input
            name="message"
            type="text"
            value={messageInput}
            onChange={evt => setMessageInput(evt.target.value)}
            placeholder="Nome / Mensagem"
            className="p-2 text-slate-800 ouline-none border-2 border-indigo-800 rounded bg-blue-50"
          />
        </div>
        <div className="flex gap-8">
          <button className="shadow-lg shadow-indigo-500 self-center text-white mb-auto font-bold hover:shadow-blue-500 disabled:bg-indigo-300 disabled:text-slate-100 active:bg-blue-700 p-2 bg-indigo-800 rounded hover:scale-105 transition hover:bg-blue-900 px-8 hover:text-blue-100"
            disabled={isLoading}
            onClick={() => handleChamarProximo(-1)}
          >
            {isLoading ? "Chamando..." : "Chamar Anterior"}
          </button>
          <button className="shadow-lg shadow-indigo-500 self-center text-white mb-auto font-bold hover:shadow-blue-500 disabled:bg-indigo-300 disabled:text-slate-100 active:bg-blue-700 p-2 bg-indigo-800 rounded hover:scale-105 transition hover:bg-blue-900 px-8 hover:text-blue-100"
            disabled={isLoading}
            onClick={handleChamarAtual}
          >
            {isLoading ? "Chamando..." : "Chamar Atual"}
          </button>
          <button className="shadow-lg shadow-indigo-500 self-center text-white mb-auto font-bold hover:shadow-blue-500 disabled:bg-indigo-300 disabled:text-slate-100 active:bg-blue-700 p-2 bg-indigo-800 rounded hover:scale-105 transition hover:bg-blue-900 px-8 hover:text-blue-100"
            disabled={isLoading}
            onClick={() => handleChamarProximo(1)}
          >
            {isLoading ? "Chamando..." : "Chamar Próximo"}
          </button>
        </div>
      </div >
      <footer className='mt-auto bg-indigo-800 p-1 text-white text-xs text-center'>2023 © Subsecretaria de Tecnologia da Informação — Prefeitura Municipal de Mesquita</footer>
    </div>
  )
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