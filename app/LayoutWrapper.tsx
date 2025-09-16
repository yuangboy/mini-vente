"use client";

import React from 'react'
import {persistor, store} from '@/src/store/store'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import Spinner from '../src/components/Spinner'
import {Toaster} from "react-hot-toast";
import AuthCheck from '@/src/store/provider/AuthProvider';

export default function LayoutWrapper({children}:{children:React.ReactNode}) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
       <Toaster/>
       <AuthCheck>
       {children}
       </AuthCheck>
      </PersistGate>
    </Provider>
  )
}
 