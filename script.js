function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab:nth-child(${tab === 'html' ? 1 : tab === 'css' ? 2 : 3})`).classList.add('active');
    
    document.querySelectorAll('textarea').forEach(editor => editor.classList.remove('active'));
    document.getElementById(`${tab}Code`).classList.add('active');
  }
  
  function runCode() {
    const html = document.getElementById('htmlCode').value;
    const css = document.getElementById('cssCode').value;
    const js = document.getElementById('jsCode').value;
    const errorDisplay = document.getElementById('error-display');
    const outputFrame = document.getElementById('output');
  
    try {
      // Clear previous error messages
      errorDisplay.style.display = 'none';
      errorDisplay.textContent = '';
  
      const frameDoc = outputFrame.contentWindow.document;
      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>
              window.onerror = function(msg, url, lineNo, columnNo, error) {
                window.parent.postMessage({
                  type: 'error',
                  message: msg,
                  line: lineNo,
                  column: columnNo
                }, '*');
                return false;
              };
              ${js}
            </script>
          </body>
        </html>
      `);
      frameDoc.close();
    } catch (error) {
      errorDisplay.textContent = `Error: ${error.message}`;
      errorDisplay.style.display = 'block';
    }
  }
  
  // Handle errors from the iframe
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'error') {
      const errorDisplay = document.getElementById('error-display');
      errorDisplay.textContent = `JavaScript Error: ${event.data.message} (Line: ${event.data.line})`;
      errorDisplay.style.display = 'block';
    }
  });
  
  // Add example code when the page loads
  window.onload = function() {
    document.getElementById('htmlCode').value = '<div class="container">\n  <h1>Welcome to Code Runner</h1>\n  <button onclick="showMessage()">Click me!</button>\n</div>';
    document.getElementById('cssCode').value = '.container {\n  text-align: center;\n  padding: 2rem;\n}\n\nh1 {\n  color: #3b82f6;\n  margin-bottom: 1rem;\n}\n\nbutton {\n  background: #22c55e;\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 0.5rem;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background: #16a34a;\n}';
    document.getElementById('jsCode').value = 'function showMessage() {\n  alert("Hello from the new Code Runner!");\n}';
    runCode();
  }
  