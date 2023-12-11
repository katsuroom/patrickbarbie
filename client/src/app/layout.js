import { Inter } from 'next/font/google'

import { AuthContextProvider } from '@/auth';
import { StoreContextProvider } from '@/store';
import { EditContextProvider } from '@/edit';
import TitleBar from './components/TitleBar';
import StatusBar from './components/StatusBar';
import MUIUploadMap from './modals/MUIUploadMap';
import MUICreateMap from './modals/MUICreateMap';
import MUISaveChanges from "./modals/MUISaveChanges";
import MUIExit from "./modals/MUIExitModal";
import Script from 'next/script';
import "./app.css";


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Patrick Barbie',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <StoreContextProvider>
          <EditContextProvider>
            <body className={inter.className}>
              <TitleBar />
              {children}
              <a id="download-anchor" style={{display: "none"}}></a>
              <StatusBar />
              <MUIUploadMap />
              <MUICreateMap />
              <MUISaveChanges />
              <MUIExit />
              <Script src="https://cdn.jsdelivr.net/npm/heatmapjs@2.0.2/heatmap.js"></Script>
            </body>
          </EditContextProvider>
        </StoreContextProvider>
      </AuthContextProvider>
    </html>
  )
}
