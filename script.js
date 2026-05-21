// ══════════════════════════════════════════════════
//  設定：部署 Google Apps Script 後，將 Web App URL
//  填入下方 GAS_URL，取代 'YOUR_GAS_WEB_APP_URL'
// ══════════════════════════════════════════════════
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxFeozlgoMH3XaA2JJixnHqjMNevuhLIRNnCCqFZgwibKICVRL7iF-JKKAmEcyM-MsVDQ/exec';

// ── 頁面切換 ──
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToSurvey() {
  showPage('page-survey');
}

// ── 表單送出 ──
document.getElementById('survey-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form       = e.target;
  const submitBtn  = document.getElementById('submit-btn');
  const errorBox   = document.getElementById('error-notice');

  // 驗證必填欄位
  const nameVal = form.name.value.trim();
  if (!nameVal) {
    form.name.focus();
    form.name.style.borderColor = '#d94f4f';
    return;
  }
  form.name.style.borderColor = '';

  // 收集資料
  const data = {
    name:           form.name.value.trim(),
    selfIntro:      form.selfIntro.value.trim(),
    expertise:      form.expertise.value.trim(),
    workStyle:      form.workStyle.value.trim(),
    team:           form.team.value.trim(),
    onlineGroup:    form.onlineGroup.value.trim(),
    platforms:      form.platforms.value.trim(),
    location:       form.location.value.trim(),
    credential:     form.credential.value.trim(),
    longTermCoop:   form.longTermCoop.value.trim(),
    shortTermCoop:  form.shortTermCoop.value.trim(),
    expectation:    form.expectation.value.trim(),
    businessPlan:   form.businessPlan.value.trim(),
    additionalInfo: form.additionalInfo.value.trim(),
    submittedAt:    new Date().toISOString()
  };

  // 顯示載入狀態
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span>送出中…';
  errorBox.style.display = 'none';

  // GAS URL 尚未設定時（本機測試用）
  if (GAS_URL === 'YOUR_GAS_WEB_APP_URL') {
    console.log('[Dev mode] 表單資料如下：', data);
    await sleep(800);
    showPage('page-success');
    return;
  }

  try {
    // 使用 no-cors 模式送出（避免 CORS preflight 問題）
    // 資料由 Google Apps Script 在伺服器端處理
    await fetch(GAS_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify(data)
    });

    // no-cors 模式下無法讀取回應，但資料已送至 GAS
    await sleep(600);
    showPage('page-success');

  } catch (err) {
    // 通常是網路斷線才會到這裡
    console.error('送出失敗：', err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '送出問卷';
    errorBox.style.display = 'block';
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
