const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        siteInput: document.getElementById('site-input'),
        siteInterval: document.getElementById('site-interval'),
        addSiteBtn: document.getElementById('add-site'),
        siteList: document.getElementById('site-list')
    };

    // Initialize UI
    function init() {
        loadSites();
        setupEventListeners();
    }

    // Load existing sites
    function loadSites() {
        browserAPI.storage.local.get(['monitoredSites'], (result) => {
            const sites = result.monitoredSites || [];
            elements.siteList.innerHTML = '';
            sites.forEach(createSiteRow);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        elements.addSiteBtn.addEventListener('click', handleAddSite);
        elements.siteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddSite();
        });
    }

    // Handle adding new site
    function handleAddSite() {
        const url = elements.siteInput.value.trim().replace(/^https?:\/\//, '');
        const interval = parseInt(elements.siteInterval.value) || 5;

        if (!url) return;

        browserAPI.storage.local.get(['monitoredSites'], (result) => {
            const sites = result.monitoredSites || [];
            
            if (sites.some(site => site.url === url)) {
                alert('This site is already in the list!');
                return;
            }

            const newSite = {
                url,
                isActive: true,
                interval,
                lastRefresh: Date.now(),
                nextRefresh: Date.now() + (interval * 60 * 1000)
            };

            sites.push(newSite);
            browserAPI.storage.local.set({ monitoredSites: sites }, () => {
                createSiteRow(newSite);
                elements.siteInput.value = '';
            });
        });
    }

    // Create table row for site
    function createSiteRow(site) {
        const row = document.createElement('tr');
        
        // URL cell
        const urlCell = document.createElement('td');
        urlCell.textContent = site.url;

        // Timer cell
        const timerCell = document.createElement('td');
        timerCell.className = site.isActive ? 'timer-active' : 'timer-inactive';

        // Interval cell
        const intervalCell = document.createElement('td');
        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.min = '1';
        intervalInput.max = '60';
        intervalInput.value = site.interval;
        intervalInput.className = 'interval-input';
        intervalCell.appendChild(intervalInput);

        // Actions cell
        const actionsCell = document.createElement('td');
        const controls = document.createElement('div');
        controls.className = 'site-controls';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = site.isActive ? 'Stop' : 'Start';
        toggleBtn.className = site.isActive ? 'active' : '';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';

        controls.append(toggleBtn, removeBtn);
        actionsCell.appendChild(controls);

        // Update timer display
        function updateTimer() {
            if (!site.isActive) {
                timerCell.textContent = 'Paused';
                timerCell.className = 'timer-inactive';
                return;
            }

            const now = Date.now();
            const timeLeft = Math.max(0, Math.round((site.nextRefresh - now) / 1000));
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerCell.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            timerCell.className = 'timer-active';
        }

        // Setup event listeners
        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer();

        intervalInput.addEventListener('change', () => {
            const newInterval = parseInt(intervalInput.value) || 5;
            site.interval = newInterval;
            if (site.isActive) {
                site.nextRefresh = Date.now() + (newInterval * 60 * 1000);
            }
            updateStorage();
        });

        toggleBtn.addEventListener('click', () => {
            site.isActive = !site.isActive;
            if (site.isActive) {
                site.nextRefresh = Date.now() + (site.interval * 60 * 1000);
            }
            toggleBtn.textContent = site.isActive ? 'Stop' : 'Start';
            toggleBtn.className = site.isActive ? 'active' : '';
            updateTimer();
            updateStorage();
        });

        removeBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            browserAPI.storage.local.get(['monitoredSites'], (result) => {
                const sites = result.monitoredSites || [];
                const updatedSites = sites.filter(s => s.url !== site.url);
                browserAPI.storage.local.set({ monitoredSites: updatedSites }, () => {
                    row.remove();
                });
            });
        });

        // Add cells to row
        row.append(urlCell, timerCell, intervalCell, actionsCell);
        elements.siteList.appendChild(row);
    }

    // Update storage helper
    function updateStorage() {
        browserAPI.storage.local.get(['monitoredSites'], (result) => {
            const sites = result.monitoredSites || [];
            browserAPI.storage.local.set({ monitoredSites: sites });
        });
    }

    // Start the app
    init();
});