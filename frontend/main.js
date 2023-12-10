import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="main">
    <nav><p class="site-title">Predicting Student Performance for Game-based Learning</p></nav>
    <div class="content">
      <div class="uploader-area content-item">
        <div class="content-title">Upload student gaming data for performance predictions:</div>
        <div class="uploader-wrapper">
          <input type="file" id="file-upload" name="file" accept=".csv" />
          <button id="upload-button">Upload</button>
          <button id="reset-button">Reset</button>
        </div>
      </div>
      <div id="session-selection-area" class="content-item"></div>
      <div id="result-area" class="result-area content-item"></div>
    </div>
  </div>
`
function displaySessionSelection(data) {
  const sessionIds = Object.keys(data);
  const container = document.getElementById('session-selection-area');

  // Section title
  const title = document.createElement('p');
  title.innerHTML = 'Select a session:';
  container.appendChild(title);

  // Radio buttons
  sessionIds.forEach((sessionId, index) => {
    const row = document.createElement('div');
    row.className = 'session-row';

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.id = `session-${index}`;
    radioButton.name = 'session';
    radioButton.value = sessionId;

    const label = document.createElement('label');
    label.htmlFor = `session-${index}`;
    label.textContent = sessionId;

    radioButton.addEventListener('change', function() {
      const resultArea = document.getElementById('result-area');
      // Clear previous results
      while (resultArea.firstChild) {
        resultArea.removeChild(resultArea.firstChild);
      }
      Object.entries(data[sessionId]).forEach(([questionId, prediction]) => {
        const row = document.createElement('div');
        let predictionText= "Incorrect";
        if (Math.round(prediction) === 1) predictionText = "Correct";
        row.className = 'result-row';
        row.innerHTML = `${questionId}: <span class="prediction-${predictionText}">${predictionText}</span>`;
        resultArea.appendChild(row);
      });
    });

    row.appendChild(radioButton);
    row.appendChild(label);

    container.appendChild(row);
  });
}

const clearResults = () => {
  // clear session selection area and result area
  const sessionSelectionArea = document.querySelector('#session-selection-area');
  while (sessionSelectionArea.firstChild) {
    sessionSelectionArea.removeChild(sessionSelectionArea.firstChild);
  }
  const resultArea = document.getElementById('result-area');
  while (resultArea.firstChild) {
    resultArea.removeChild(resultArea.firstChild);
  }
}

document.querySelector('#upload-button').addEventListener('click', function() {
  clearResults();
  // disable file upload button
  document.querySelector('#upload-button').disabled = true;

  // get file from file input
  const fileInput = document.querySelector('#file-upload');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  // display loading message on the session selection area
  const sessionSelectionArea = document.querySelector('#session-selection-area');
  const loadingMessage = document.createElement('p');
  loadingMessage.id = 'loading-message';
  loadingMessage.innerHTML = 'Loading...';
  sessionSelectionArea.appendChild(loadingMessage);

  fetch('https://comp313-backend.onrender.com/get_csv', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    clearResults();
    displaySessionSelection(data);
  })
  .catch(error => {
    clearResults();
    // display error message on the session selection area
    const sessionSelectionArea = document.querySelector('#session-selection-area');
    const errorMessage = document.createElement('p');
    errorMessage.innerHTML = 'Something went wrong. Please try again.';
    sessionSelectionArea.appendChild(errorMessage);
    // enable file upload button
    document.querySelector('#upload-button').disabled = false;
  });
});

document.querySelector('#reset-button').addEventListener('click', function() {
  // enable file upload button
  document.querySelector('#upload-button').disabled = false;
  // clear file input
  document.querySelector('#file-upload').value = '';
  // clear session selection area
  const sessionSelectionArea = document.querySelector('#session-selection-area');
  while (sessionSelectionArea.firstChild) {
    sessionSelectionArea.removeChild(sessionSelectionArea.firstChild);
  }
  // clear result area
  const resultArea = document.getElementById('result-area');
  while (resultArea.firstChild) {
    resultArea.removeChild(resultArea.firstChild);
  }
});