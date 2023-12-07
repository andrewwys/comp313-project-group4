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
      Object.entries(data[sessionId]).forEach(([questionId, probability]) => {
        const row = document.createElement('div');
        row.className = 'result-row';
        row.innerHTML = `${questionId}: ${Math.round(probability * 100)/100}`;
        resultArea.appendChild(row);
      });
    });

    row.appendChild(radioButton);
    row.appendChild(label);

    container.appendChild(row);
  });
}

document.querySelector('#upload-button').addEventListener('click', function() {
  const fileInput = document.querySelector('#file-upload');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  fetch('http://127.0.0.1:5000/get_csv', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // read keys from the response
    displaySessionSelection(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
});