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

    try {

      const baseUrl = 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: selectedText })
      });

      if (!response.ok) throw new Error('App not reachable. Make sure ClearFrame is running.');


      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const historyRes = await fetch('http://localhost:3000/api/history', {
          credentials: 'include'
        });
        const historyData = await historyRes.json();

        const latest = historyData.find(item => item.input.trim() === selectedText.trim());
        if (latest) {
          clearInterval(poll);
          showResult(latest);
        }

        if (attempts > 15) {
          clearInterval(poll);
          throw new Error('Analysis timed out. Check the web app.');
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
