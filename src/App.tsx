import { useState,useEffect } from 'react'
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { LoginPage } from './pages/LoginPage';
import {TaskPage} from './pages/TaskPage';
import './App.css'

export default function App(){
  const [Session,setSession] = useState<Session | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      setSession(data.session ?? null);
      setBooting(false);
    });

    const {data:sub} = supabase.auth.onAuthStateChange((_event,newSession) => {
      setSession(newSession);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  },[]);
  if (booting){
    return(
      <div className='min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center'>
        起動中....
      </div>
    );
  }
  return Session ? <TaskPage userId={Session.user.id} />:<LoginPage/>;
}


