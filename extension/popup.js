document.addEventListener('DOMContentLoaded', () => {
  loadLocalHistory();
});

document.getElementById('analyze-btn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  }, async (results) => {
    const selectedText = results[0]?.result;
    if (!selectedText) {
      document.getElementById('status').innerText = 'Please select some text first.';
      return;
    }

    document.getElementById('analyze-btn').disabled = true;
    document.getElementById('loading').style.display = 'block';
    document.getElementById('status').innerText = 'Analyzing with Gemini AI...';
    document.getElementById('result').style.display = 'none';

    const startTime = Date.now();
    try {
      const baseUrl = 'https://clearframe-beige.vercel.app';
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: selectedText })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Check if you are logged in on the web app.');
      }

      let attempts = 0;
      const normalize = (t) => t.trim().replace(/\s+/g, ' ');
      const normSelected = normalize(selectedText);

      const poll = setInterval(async () => {
        try {
          attempts++;
          const historyRes = await fetch(`${baseUrl}/api/history`, {
            credentials: 'include'
          });
          
          if (!historyRes.ok) return;

          const historyData = await historyRes.json();
          const latest = historyData.find(item => {
            const itemTime = new Date(item.createdAt).getTime();
            return itemTime > startTime - 10000 && 
                   normalize(item.input) === normSelected;
          });

          if (latest) {
            clearInterval(poll);
            
            // Save to local storage
            chrome.storage.local.get({ history: [] }, (result) => {
              const history = result.history;
              history.unshift({
                input: selectedText,
                result: latest.result,
                createdAt: latest.createdAt
              });
              chrome.storage.local.set({ history: history.slice(0, 20) });
              loadLocalHistory();
            });

            showResult(latest);
          }

          if (attempts > 30) {
            clearInterval(poll);
            document.getElementById('status').innerText = 'Analysis timed out. Please check the Dashboard.';
            document.getElementById('analyze-btn').disabled = false;
            document.getElementById('loading').style.display = 'none';
          }
        } catch (pollError) {
          console.error("Polling error:", pollError);
        }
      }, 3000);

    } catch (error) {
      document.getElementById('status').innerText = error.message;
      document.getElementById('analyze-btn').disabled = false;
      document.getElementById('loading').style.display = 'none';
    }
  });
});

function showResult(data) {
  const result = data.result;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('analyze-btn').style.display = 'none';
  document.getElementById('status').innerText = 'Analysis Complete';

  const scoreBadge = document.getElementById('score-val');
  scoreBadge.innerText = `Manipulation Score: ${result.manipulation_score}`;
  scoreBadge.className = 'score-badge ' + (result.manipulation_score > 70 ? 'high' : result.manipulation_score > 30 ? 'med' : 'low');

  document.getElementById('bias-val').innerText = `Bias: ${result.bias.direction.toUpperCase()} (${Math.round(result.bias.confidence * 100)}% confidence)`;

  document.getElementById('summary-val').innerText = result.bias.explanation;
  document.getElementById('result').style.display = 'block';
}

function loadLocalHistory() {
  chrome.storage.local.get({ history: [] }, (result) => {
    const history = result.history;
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');
    
    if (history.length > 0) {
      historyContainer.style.display = 'block';
      historyList.innerHTML = '';
      history.forEach((item, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'background: #09090b; padding: 10px; border-radius: 8px; font-size: 11px; cursor: pointer; border: 1px solid #27272a; transition: all 0.2s;';
        div.innerHTML = `
          <div style="font-weight: bold; color: #10b981; margin-bottom: 4px;">Score: ${item.result.manipulation_score}</div>
          <div style="color: #a1a1aa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.input}</div>
        `;
        div.onclick = () => showResult(item);
        historyList.appendChild(div);
      });
    }
  });
}
