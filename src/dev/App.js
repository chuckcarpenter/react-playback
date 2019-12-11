import React from 'react';
import AudioPlayer from '../lib';
import logo from './logo.png';

import '../lib/style.css';

const App = () => (
  <div className='content'>
    <img src={logo} className='logo' alt='Logo Create React Dependency' />
    <h1 className='title'>Create React Dependency</h1>
    <section className='library'>
      <AudioPlayer src='http://www.testsounds.com/track39.mp3'></AudioPlayer>
    </section>
  </div>
);

export default App;
