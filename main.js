var log = [];
var toggle = true;
var currentTab = null;
var prevTab = null;

// Get Settings
chrome.storage.sync.get(['toggle'], function (result) {
  if (typeof value === 'undefined' || value === null) {
    toggle = true;
    chrome.storage.sync.set({ toggle: toggle });
  } else {
    result.toggle ? (toggle = true) : (toggle = false);
  }
  console.log('AutoPiP Enabled:', toggle);
});

chrome.tabs.onActivated.addListener(function (tab) {
  // --- [0] : Check settings  --- //
  if (!toggle) {
    console.log('[EXT_DISABLED] Extension is disabled in the settings');
    return;
  }

  // --- [1] : Check tab  --- //
  // console.clear();
  currentTab = tab.tabId;
  console.log(`Previous tab: ${prevTab}`);
  console.log(`Current tab: ${currentTab}`);

  // --- [2] : Request enterpictureinpicture on previous tab  --- //
  if (prevTab != null) {
    console.log(`Checking for playing video on previous tab`);
    chrome.scripting.executeScript(
      { target: { tabId: prevTab }, files: ['./scripts/auto-pip.js'] },
      (res) => {
        console.log('PiP:', res);
      }
    );
  }

  prevTab = currentTab;
});
