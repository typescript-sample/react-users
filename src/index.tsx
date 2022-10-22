import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import MusicContextProvider from './music/context/music';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <MusicContextProvider>
      <App />
    </MusicContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();



// const container = document.getElementById('root');
// if (container) {
//   const root = createRoot(container);
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// }


// reportWebVitals();
