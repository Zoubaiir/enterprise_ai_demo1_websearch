const container = document.getElementById("app");

function renderEmpty() {
  if (!container) return;
  container.innerHTML = `
    <main>
      <h1>AI Car Deal Insight</h1>
      <p>No assessments yet. Open an Autotrader listing to generate one.</p>
    </main>
  `;
}

function renderAssessment(assessment: any) {
  if (!container) return;
  const flags = (assessment.flags || []).slice(0, 5);
  const images = (assessment.images || []).slice(0, 3);

  container.innerHTML = `
    <main>
      <h1>AI Car Deal Insight</h1>
      <div style="margin-top:8px">
        <div style="font-weight:700">Verdict: ${assessment.verdict ?? 'N/A'}</div>
        <div style="font-size:20px;font-weight:800;margin:6px 0">Score: ${Math.round(assessment.overallScore ?? 0)}</div>
        <div style="font-size:12px;opacity:0.9;white-space:pre-wrap">${(assessment.rationale || []).slice(0,5).join('\n')}</div>
      </div>
      <div style="margin-top:8px">
        ${flags.map((f: any) => `<div style="font-size:12px;color:#b00">• ${f.summary ?? f.code}</div>`).join('')}
      </div>
      <div style="margin-top:8px;display:flex;gap:6px">
        ${images.map((img: any) => `<img src="${img.url}" style="width:80px;height:60px;object-fit:cover;border-radius:4px"/>`).join('')}
      </div>
      <div style="margin-top:10px">
        <button id="refresh-assessment" type="button">Refresh</button>
      </div>
    </main>
  `;

  // Use event delegation on the container so listeners survive re-renders
  // and we can easily debug click events
  container.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement | null;
    if (!target) return;
    if (target.id === 'refresh-assessment' || target.closest('#refresh-assessment')) {
      console.info('Popup: refresh button clicked');
      ev.preventDefault();
      loadLatestAssessment();
    }
  });
}

function loadLatestAssessment() {
  if (!container) return;
  chrome.storage.local.get('assessments', (res: { assessments?: Record<string, any> }) => {
    const assessments = res?.assessments || {};
    const keys = Object.keys(assessments);
    if (keys.length === 0) {
      renderEmpty();
      return;
    }
    // pick most recent by saved order (no timestamp available) — take last key
    const latest = assessments[keys[keys.length - 1]];
    renderAssessment(latest);
  });
}

if (!container) {
  console.warn('Popup: missing #app container');
} else {
  loadLatestAssessment();
}
