var log = [];
var toggle = true;

// Get settings
chrome.storage.sync.get(['toggle'], function (result) {
  const toggleSetting = result.toggle;
  if (typeof toggleSetting === 'undefined' || toggleSetting === null) {
    toggle = true;
    chrome.storage.sync.set({ toggle: toggle });
  } else {
    toggleSetting ? (toggle = true) : (toggle = false);
  }
  console.log('AutoPiP Enabled:', toggle);
});

// Set audible media listener
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!toggle) {
    console.log('[EXT_DISABLED] Extension is disabled in the settings');
    return;
  }

  const audibleMedia = changeInfo.audible;
  if (audibleMedia) {
    console.log(`Audible media detetcted on tab: ${tabId}`);
    chrome.scripting.executeScript(
      { target: { tabId: tabId }, files: ['./scripts/auto-pip.js'] },
      (res) => {
        console.log('PiP:', res);
      }
    );
  } else {
    console.log(`Media paused on tab: ${tabId}`);
  }
});
