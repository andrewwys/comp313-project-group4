import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div class="main">
    <nav><p class="site-title">Predicting Student Performance for Game-based Learning</p></nav>
    <div class="content">
      <div class="uploader-area content-item">
        <div class="uploader-wrapper">
          <input type="file" id="file-upload" name="file" accept=".csv" />
          <button id="upload-button">Upload</button>
        </div>
      </div>
      <div class="result-area content-item">
        Result Area...
      </div>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))
