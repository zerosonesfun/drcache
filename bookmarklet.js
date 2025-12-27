/**
 * Site Memory Helper - Bookmarklet
 * 
 * This bookmarklet detects and helps clear various types of browser storage
 * (cookies, cache, localStorage, sessionStorage, service workers, IndexedDB)
 * for the current website.
 * 
 * Usage: Copy this code as a bookmarklet URL starting with "javascript:"
 */

(async () => {
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  // Get references to commonly used objects
  const d = document;
  const w = window;
  
  // ============================================================================
  // STORAGE DETECTION
  // ============================================================================
  
  // Object to store detected storage information
  // All values are counts (numbers) for consistency
  let s = {
    ls: 0,        // localStorage item count
    ss: 0,        // sessionStorage item count
    c: 0,         // Cache Storage count
    sw: 0,        // Service Worker registration count
    idb: 0,       // IndexedDB databases count
    ck: 0,        // Cookies count
    est: null     // Storage estimate (if available)
  };
  
  // Detect localStorage
  try {
    s.ls = Object.keys(localStorage).length;
  } catch (e) {
    // localStorage not available or blocked
  }
  
  // Detect sessionStorage
  try {
    s.ss = Object.keys(sessionStorage).length;
  } catch (e) {
    // sessionStorage not available or blocked
  }
  
  // Detect Cache Storage (caches API)
  try {
    if ("caches" in w) {
      s.c = (await caches.keys()).length;
    }
  } catch (e) {
    // Cache Storage not available or blocked
  }
  
  // Detect Service Workers
  try {
    if ("serviceWorker" in navigator) {
      s.sw = (await navigator.serviceWorker.getRegistrations()).length;
    }
  } catch (e) {
    // Service Workers not available or blocked
  }
  
  // Detect IndexedDB databases
  try {
    if (indexedDB.databases) {
      s.idb = (await indexedDB.databases()).length;
    }
  } catch (e) {
    // IndexedDB not available or blocked
  }
  
  // Detect cookies
  try {
    if (document.cookie && document.cookie.trim()) {
      s.ck = document.cookie.split(";").filter(c => c.trim()).length;
    } else {
      s.ck = 0;
    }
  } catch (e) {
    // Cookie access blocked
    s.ck = 0;
  }
  
  // Get storage estimate (if available)
  try {
    if (navigator.storage?.estimate) {
      s.est = await navigator.storage.estimate();
    }
  } catch (e) {
    // Storage estimate not available
  }
  
  // ============================================================================
  // COOKIE CLEARING FUNCTION
  // ============================================================================
  
  /**
   * Attempts to clear cookies for the current domain
   * Note: Browsers may restrict this for security reasons
   */
  async function clearCookies() {
    // Check if there are any cookies to clear
    if (!document.cookie || document.cookie.trim() === "") {
      return; // No cookies to clear
    }
    
    // Split cookies and attempt to clear each one
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const trimmed = c.trim();
      if (!trimmed) continue; // Skip empty strings
      
      const n = trimmed.split("=")[0].trim(); // Get cookie name
      if (!n) continue; // Skip if no name
      
      // Try clearing for both the hostname and with a leading dot
      // (covers both example.com and .example.com cookie scopes)
      for (const dmn of [location.hostname, "." + location.hostname]) {
        // Try multiple paths to ensure cookie is cleared
        const paths = ["/", location.pathname];
        for (const path of paths) {
          document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + "; domain=" + dmn;
          document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path;
        }
      }
    }
  }
  
  // ============================================================================
  // UI STYLING CONSTANTS
  // ============================================================================
  
  // Overlay styles (full screen dark overlay)
  const css = "position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.86);color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;overflow:auto;";
  
  // Main content box styles
  const box = "max-width:880px;margin:0 auto;background:#111;border-radius:14px;padding:22px;box-shadow:0 0 0 1px #333";
  
  // ============================================================================
  // UI HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Creates a row display for stats
   * @param {string} a - Label
   * @param {string|number} b - Value
   * @returns {string} HTML string
   */
  const row = (a, b) => `<div style="display:flex;justify-content:space-between;margin:6px 0;opacity:.9"><div>${a}</div><div style="opacity:.7">${b}</div></div>`;
  
  /**
   * Creates a checkbox option
   * @param {string} i - Input ID
   * @param {string} l - Label text
   * @param {string} d - Description
   * @param {boolean} x - Whether to disable (true if already empty)
   * @returns {string} HTML string
   */
  const chk = (i, l, d, x) => `<label style="display:block;margin:12px 0;opacity:${x ? .5 : 1}"><input type="checkbox" id="${i}" ${x ? "disabled" : ""} style="margin-right:8px"><strong>${l}</strong><div style="font-size:13px;opacity:.75;margin-left:22px">${d}</div></label>`;
  
  /**
   * Generates browser-specific instructions for clearing site data
   * @returns {string} HTML string with detailed instructions
   */
  function getBrowserInstructions() {
    const ua = navigator.userAgent;
    // Chrome-based browsers (Chrome, Edge, Brave, Opera, etc.)
    const isChrome = /Chrome|Chromium|Brave|Edg|Opera/i.test(ua) && !/Firefox|Safari/i.test(ua);
    const isFirefox = /Firefox/i.test(ua);
    // Safari (but not Chrome-based browsers that also contain "Safari" in UA)
    const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|Firefox/i.test(ua);
    
    if (isChrome) {
      return `
<strong>Chrome/Edge/Brave:</strong>
1. Right-click anywhere on the page
2. Select "Inspect" (or press F12)
3. Click the "Application" tab at the top
4. In the left sidebar, find "Storage"
5. Click "Clear site data" button at the top
6. Or manually clear:
   - Cookies: Expand "Cookies" → Right-click domain → "Clear"
   - Cache Storage: Expand "Cache Storage" → Right-click each entry → "Delete"
   - Local Storage: Expand "Local Storage" → Right-click domain → "Clear"
   - IndexedDB: Expand "IndexedDB" → Right-click database → "Delete Database"
`;
    } else if (isFirefox) {
      return `
<strong>Firefox:</strong>
1. Right-click anywhere on the page
2. Select "Inspect" (or press F12)
3. Click the "Storage" tab at the top
4. Expand each section and right-click to delete:
   - Cookies: Right-click cookie → "Delete"
   - Cache Storage: Right-click cache → "Delete"
   - Local Storage: Right-click domain → "Delete All"
   - IndexedDB: Right-click database → "Delete Database"
5. Or use: Menu → Settings → Privacy → Cookies and Site Data → "Clear Data"
`;
    } else if (isSafari) {
      return `
<strong>Safari:</strong>
1. Enable Developer menu: Safari → Settings → Advanced → "Show features for web developers"
2. Right-click on the page → "Inspect Element"
3. Click the "Storage" tab
4. Expand sections and delete items:
   - Cookies: Right-click → "Delete"
   - Local Storage: Right-click → "Delete All"
   - IndexedDB: Right-click → "Delete Database"
5. Or use: Safari → Settings → Privacy → "Manage Website Data" → Remove site
`;
    } else {
      return `
<strong>General Instructions:</strong>
1. Right-click on the page and select "Inspect" or "Inspect Element"
2. Look for tabs like "Application", "Storage", or "Debugger"
3. Find sections for Cookies, Cache, Local Storage, and IndexedDB
4. Right-click on items to delete them
5. Or use your browser's settings menu to clear site data
`;
    }
  }
  
  // ============================================================================
  // CREATE UI OVERLAY
  // ============================================================================
  
  // Create main overlay container
  const o = d.createElement("div");
  o.style.cssText = css;
  
  // Build the HTML content
  o.innerHTML = `
    <div style="${box}">
      <!-- Header with close button -->
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:22px;font-weight:700">Site Memory Helper</div>
        <button id="x" style="background:none;border:none;color:#aaa;font-size:22px;cursor:pointer">×</button>
      </div>
      
      <!-- Subtitle -->
      <div style="margin-top:8px;opacity:.85">
        Nothing has been cleared yet. Choose what to clean.
      </div>
      
      <!-- Stats display area (will be populated dynamically) -->
      <div style="margin-top:18px" id="stats"></div>
      
      <!-- Checkbox options -->
      <div style="margin-top:18px;border-top:1px solid #333;padding-top:16px">
        ${chk("l", "Clear localStorage", "Small saved values used by the site.", s.ls === 0)}
        ${chk("s", "Clear sessionStorage", "Temporary tab memory.", s.ss === 0)}
        ${chk("c", "Delete Cache Storage", "Stored network responses.", s.c === 0)}
        ${chk("w", "Unregister service workers", "Background logic that can keep old behavior.", s.sw === 0)}
        ${chk("k", "Attempt to clear cookies", "Only cookies browsers allow scripts to remove.", s.ck === 0)}
      </div>
      
      <!-- Clear button -->
      <button id="run" style="margin-top:16px;background:#fff;color:#000;border:none;border-radius:10px;padding:10px 16px;font-size:15px;cursor:pointer">
        Clear selected
      </button>
      
      <!-- Output log area -->
      <div id="out" style="margin-top:16px;opacity:.9"></div>
      
      <!-- Help section -->
      <div style="margin-top:22px;border-top:1px solid #333;padding-top:14px">
        <div style="font-weight:600;margin-bottom:6px">
          Why some cookies and cache may remain
        </div>
        <div style="opacity:.85;font-size:14px;line-height:1.45;margin-bottom:12px">
          Browsers protect certain cookies and cache for safety. Scripts can only remove a subset. 
          To fully clear everything, use your browser's developer tools with the instructions below.
        </div>
        <div style="background:#000;padding:14px;border-radius:8px;font-size:13px;line-height:1.6;white-space:pre-wrap;font-family:monospace">
${getBrowserInstructions()}
        </div>
      </div>
      
      <!-- Footer -->
      <div style="margin-top:14px;font-size:12px;opacity:.6">
        Runs locally. No tracking. No network.
      </div>
    </div>
  `;
  
  // Add overlay to page (ensure body exists)
  if (d.body) {
    d.body.appendChild(o);
  } else {
    // Fallback: wait for body to be ready
    const addOverlay = () => {
      if (d.body) {
        d.body.appendChild(o);
      }
    };
    if (d.readyState === "loading") {
      d.addEventListener("DOMContentLoaded", addOverlay);
    } else {
      // DOM already loaded, add immediately
      setTimeout(addOverlay, 0);
    }
  }
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  // Close button handler
  o.querySelector("#x").onclick = () => o.remove();
  
  // ============================================================================
  // STATS UPDATE FUNCTION
  // ============================================================================
  
  /**
   * Updates the stats display with current storage information
   */
  async function updateStats() {
    let cachesCount = 0;
    let swCount = 0;
    let idbCount = 0;
    
    // Count Cache Storage entries
    if ("caches" in w) {
      try {
        cachesCount = (await caches.keys()).length;
      } catch (e) {
        // Cache Storage access failed
      }
    }
    
    // Count Service Workers
    if (navigator.serviceWorker) {
      try {
        swCount = (await navigator.serviceWorker.getRegistrations()).length;
      } catch (e) {
        // Service Worker access failed
      }
    }
    
    // Count IndexedDB databases
    if (indexedDB.databases) {
      try {
        idbCount = (await indexedDB.databases()).length;
      } catch (e) {
        // IndexedDB access failed
      }
    }
    
    // Update stats display with error handling
    const stats = d.getElementById("stats");
    let lsCount = 0;
    let ssCount = 0;
    let cookieCount = 0;
    
    try {
      lsCount = localStorage.length;
    } catch (e) {
      lsCount = 0;
    }
    
    try {
      ssCount = sessionStorage.length;
    } catch (e) {
      ssCount = 0;
    }
    
    try {
      cookieCount = document.cookie && document.cookie.trim() 
        ? document.cookie.split(";").filter(c => c.trim()).length 
        : 0;
    } catch (e) {
      cookieCount = 0;
    }
    
    stats.innerHTML = 
      row("localStorage items", lsCount) +
      row("sessionStorage items", ssCount) +
      row("Cache Storage entries", cachesCount) +
      row("Service workers", swCount) +
      row("IndexedDB databases", idbCount) +
      row("Cookies (visible)", cookieCount);
  }
  
  // Initial stats display
  updateStats();
  
  // ============================================================================
  // CLEAR BUTTON HANDLER
  // ============================================================================
  
  /**
   * Handles the "Clear selected" button click
   * Clears the selected storage types and logs the results
   */
  o.querySelector("#run").onclick = async () => {
    let log = [];
    
    // Clear localStorage if selected
    if (d.getElementById("l").checked) {
      try {
        localStorage.clear();
        log.push("localStorage cleared");
      } catch (e) {
        log.push("localStorage failed");
      }
    }
    
    // Clear sessionStorage if selected
    if (d.getElementById("s").checked) {
      try {
        sessionStorage.clear();
        log.push("sessionStorage cleared");
      } catch (e) {
        log.push("sessionStorage failed");
      }
    }
    
    // Clear Cache Storage if selected
    if (d.getElementById("c").checked) {
      try {
        for (const k of await caches.keys()) {
          await caches.delete(k);
        }
        log.push("Cache Storage cleared");
      } catch (e) {
        log.push("Cache Storage failed");
      }
    }
    
    // Unregister Service Workers if selected
    if (d.getElementById("w").checked) {
      try {
        for (const r of await navigator.serviceWorker.getRegistrations()) {
          await r.unregister();
        }
        log.push("Service workers unregistered");
      } catch (e) {
        log.push("Service workers failed");
      }
    }
    
    // Clear cookies if selected
    if (d.getElementById("k").checked) {
      try {
        await clearCookies();
        log.push("Cookie cleanup attempted");
      } catch (e) {
        log.push("Cookie cleanup failed");
      }
    }
    
    // Display results
    const outDiv = o.querySelector("#out");
    if (log.length === 0) {
      outDiv.innerHTML = "<div style='margin-top:8px;opacity:.7'>No items selected for clearing.</div>";
    } else {
      outDiv.innerHTML = "<div style='margin-top:8px'><strong>Results:</strong><br>" + 
        log.map(x => "• " + x).join("<br>") + 
        "</div>";
    }
    
    // Update stats after clearing
    await updateStats();
  };
})();

