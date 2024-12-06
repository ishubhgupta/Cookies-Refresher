const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

let monitoredSites = [];

browserAPI.runtime.onInstalled.addListener(() => {
  browserAPI.storage.local.set({ 
    monitoredSites: [],
    refreshInterval: 5 // Set default interval
  });
});

// Load and monitor sites
browserAPI.storage.local.get(['monitoredSites'], (result) => {
  monitoredSites = result.monitoredSites || [];
});

browserAPI.storage.onChanged.addListener((changes) => {
  if (changes.monitoredSites) {
    monitoredSites = changes.monitoredSites.newValue || [];
  }
});

async function clearCookiesAndRefresh() {
  const now = Date.now();
  
  for (const site of monitoredSites) {
    if (!site.isActive || now < site.nextRefresh) continue;
    
    try {
      const domain = site.url;
      
      // Get all cookies for the domain and its subdomains
      const cookies = await browserAPI.cookies.getAll({
        domain: domain.replace(/^www\./, '')
      });
      
      // Delete each cookie
      for (const cookie of cookies) {
        const protocol = cookie.secure ? 'https:' : 'http:';
        const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
        
        await browserAPI.cookies.remove({
          url: cookieUrl,
          name: cookie.name,
          storeId: cookie.storeId
        });
      }

      // Find and refresh all tabs matching the domain
      const urlPatterns = [
        `*://${domain}/*`,
        `*://*.${domain}/*`,
        `*://www.${domain}/*`
      ];
      
      browserAPI.tabs.query({ url: urlPatterns }, (tabs) => {
        tabs.forEach(tab => browserAPI.tabs.reload(tab.id, { bypassCache: true }));
      });

      // Update next refresh time using site-specific interval
      site.lastRefresh = now;
      site.nextRefresh = now + (site.interval * 60 * 1000);
    } catch (error) {
      console.error(`Error processing ${site.url}:`, error);
    }
  }
  
  // Save updated refresh times
  browserAPI.storage.local.set({ monitoredSites });
}

// Check every second for sites that need refreshing
setInterval(clearCookiesAndRefresh, 1000);