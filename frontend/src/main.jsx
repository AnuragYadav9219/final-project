import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store.js'

document.documentElement.classList.add("dark");

document.addEventListener("wheel", (e) => {
  if (document.activeElement?.type === "number") {
    document.activeElement.blur();
  }
});

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
