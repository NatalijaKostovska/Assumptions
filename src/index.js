import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export const exampleJson = [
  {
    "title": "What is Lorem Ipsum?",
    "assumption": [
      "Lorem Ipsum is simply $dummy$ text",
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
    ]
  },
  {
    "title": "Why do we use it?",
    "assumption": [
      "It is a $long$ established fact that a reader will be distracted by the readable.",
      "The point of using Lorem $Ipsum$ is that it has a more-or-less $normal$."
    ]
  },
  {
    "title": "Where does it come from?",
    "assumption": [
      "Contrary to popular belief, Lorem Ipsum is not $simply$ random text.",
      "It has roots in a piece of classical $Latin$ literature from $45$ BC"
    ]
  }
]