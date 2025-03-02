// src/app/global.d.ts
declare global {
    interface Window {
      electronAPI: any; // Defined in preload.js
    }
  }
  
  export {}; // Ensures this file is treated as a module
  