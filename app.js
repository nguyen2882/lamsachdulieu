/* ==========================================================================
   DATACLEANER PRO - DYNAMIC & REAL-TIME LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const rawTextarea = document.getElementById('rawTextarea');
  const charCount = document.getElementById('charCount');
  
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const selectedFileInfo = document.getElementById('selectedFileInfo');
  const selectedFileName = document.getElementById('selectedFileName');
  const selectedFileSize = document.getElementById('selectedFileSize');
  const removeFileBtn = document.getElementById('removeFileBtn');
  
  const columnMappingSection = document.getElementById('columnMappingSection');
  const mapPhoneCol = document.getElementById('mapPhoneCol');
  const mapEmailCol = document.getElementById('mapEmailCol');
  const mapNameCol = document.getElementById('mapNameCol');
  const colMapSelects = document.querySelectorAll('.col-map-select');
  
  // Rules checkboxes
  const ruleEmailTelex = document.getElementById('ruleEmailTelex');
  const ruleEmailLowercase = document.getElementById('ruleEmailLowercase');
  const ruleEmailValidate = document.getElementById('ruleEmailValidate');
  const ruleEmailFilterDisposable = document.getElementById('ruleEmailFilterDisposable');
  
  const rulePhoneDigitsOnly = document.getElementById('rulePhoneDigitsOnly');
  const rulePhoneConvertOldPrefix = document.getElementById('rulePhoneConvertOldPrefix');
  const rulePhoneCountryCode = document.getElementById('rulePhoneCountryCode');
  const phoneFormat = document.getElementById('phoneFormat');
  const phoneFormatSelectContainer = document.getElementById('phoneFormatSelectContainer');
  const rulePhoneValidate = document.getElementById('rulePhoneValidate');
  
  const ruleDeduplicate = document.getElementById('ruleDeduplicate');
  const dedupCriteria = document.getElementById('dedupCriteria');
  const dupColumnSelectContainer = document.getElementById('dupColumnSelectContainer');
  const ruleRemoveEmpty = document.getElementById('ruleRemoveEmpty');
  
  // Stats
  const statTotal = document.getElementById('statTotal');
  const statValid = document.getElementById('statValid');
  const statFixed = document.getElementById('statFixed');
  const statDup = document.getElementById('statDup');
  const statError = document.getElementById('statError');
  
  // Results & Table
  const searchInput = document.getElementById('searchInput');
  const btnCopyAll = document.getElementById('btnCopyAll');
  const btnExportTXT = document.getElementById('btnExportTXT');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnExportXLSX = document.getElementById('btnExportXLSX');
  const resultsTableBody = document.getElementById('resultsTableBody');

  // --- App State ---
  let loadedFileData = null; // CSV/Excel parsed array of arrays
  let loadedFileHeaders = [];
  let currentFileName = '';
  
  // The final processed list of items currently displayed
  let processedItemsList = []; 
  // Cache of deleted row IDs to exclude them from calculations and displays
  let deletedItemIds = new Set(); 

  // Disposable email domains list
  const disposableEmailDomains = new Set([
    'yopmail.com', 'mailinator.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
    'getairmail.com', 'guerrillamail.com', 'sharklasers.com', 'dispostable.com', 'boun.cr',
    'trashmail.com', 'dropmail.me', '10minutemail.co.za', 'tempmailaddress.com', 'crazymailing.com'
  ]);

  // Old VN phone prefix mapping (11 digits -> 10 digits)
  const vnPhonePrefixMap = {
    '0162': '032', '0163': '033', '0164': '034', '0165': '035', 
    '0166': '036', '0167': '037', '0168': '038', '0169': '039',
    '0120': '070', '0121': '079', '0122': '077', '0126': '076', '0128': '078',
    '0123': '083', '0124': '084', '0125': '085', '0127': '081', '0129': '082',
    '0186': '056', '0188': '058',
    '0199': '059'
  };

  // ==========================================================================
  // --- Initialization & Event Bindings ---
  // ==========================================================================
  
  // Real-time text area changes
  rawTextarea.addEventListener('input', () => {
    updateCharCount();
    // Clear file state if they are typing in the textarea
    if (loadedFileData) {
      resetFileStateSilently();
    }
    processData();
  });
  
  // Live search filter
  searchInput.addEventListener('input', () => {
    renderTable();
  });

  // Watch rules checkboxes to trigger real-time reprocessing
  const configControls = [
    ruleEmailTelex, ruleEmailLowercase, ruleEmailValidate, ruleEmailFilterDisposable,
    rulePhoneDigitsOnly, rulePhoneConvertOldPrefix, rulePhoneCountryCode, phoneFormat, rulePhoneValidate,
    ruleDeduplicate, dedupCriteria, ruleRemoveEmpty
  ];
  
  configControls.forEach(control => {
    control.addEventListener('change', () => {
      // Toggle dependent containers
      if (control === rulePhoneCountryCode) {
        phoneFormatSelectContainer.style.display = rulePhoneCountryCode.checked ? 'flex' : 'none';
      }
      if (control === ruleDeduplicate) {
        dupColumnSelectContainer.style.display = ruleDeduplicate.checked ? 'flex' : 'none';
      }
      processData();
    });
  });

  // ==========================================================================
  // --- File Upload Handlers ---
  // ==========================================================================
  
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  // Drag-and-drop mechanics
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file) handleFile(file);
  });

  removeFileBtn.addEventListener('click', () => {
    resetFileState();
    processData();
  });

  const resetFileStateSilently = () => {
    loadedFileData = null;
    loadedFileHeaders = [];
    currentFileName = '';
    fileInput.value = '';
    selectedFileInfo.style.display = 'none';
    dropzone.style.display = 'block';
    columnMappingSection.style.display = 'none';
  };

  const resetFileState = () => {
    resetFileStateSilently();
    rawTextarea.value = '';
    updateCharCount();
  };

  const handleFile = (file) => {
    const maxSizeBytes = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSizeBytes) {
      alert('Tệp quá lớn! Vui lòng chọn tệp dưới 20MB.');
      return;
    }

    currentFileName = file.name;
    selectedFileName.textContent = file.name;
    selectedFileSize.textContent = formatBytes(file.size);
    
    dropzone.style.display = 'none';
    selectedFileInfo.style.display = 'flex';
    
    // Clear manual textarea
    rawTextarea.value = '';
    updateCharCount();

    const extension = file.name.split('.').pop().toLowerCase();
    
    if (extension === 'csv') {
      parseCSV(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
      parseExcel(file);
    } else if (extension === 'txt' || extension === 'log') {
      parseTXT(file);
    } else {
      alert('Định dạng tệp không hỗ trợ! Vui lòng chọn tệp CSV, Excel hoặc TXT.');
      resetFileState();
    }
  };

  function formatBytes(bytes) {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    return parseFloat((bytes / k).toFixed(1)) + ' KB';
  }

  // --- File Parsers ---
  
  function parseCSV(file) {
    Papa.parse(file, {
      skipEmptyLines: false,
      complete: function(results) {
        if (results.data && results.data.length > 0) {
          storeParsedData(results.data);
        } else {
          alert('Tệp CSV trống!');
          resetFileState();
        }
      }
    });
  }

  function parseExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        
        if (rows && rows.length > 0) {
          storeParsedData(rows);
        } else {
          alert('Tệp Excel trống!');
          resetFileState();
        }
      } catch (err) {
        alert('Lỗi đọc Excel: ' + err.message);
        resetFileState();
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function parseTXT(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split(/\r?\n/);
      
      // Delimiter detection
      let delimiter = ',';
      const sample = lines.slice(0, 5).filter(l => l.trim().length > 0);
      if (sample.length > 0) {
        const delims = [',', ';', '\t', '|'];
        const counts = delims.map(d => ({
          delim: d,
          count: sample.reduce((acc, l) => acc + (l.split(d).length - 1), 0)
        })).sort((a, b) => b.count - a.count);
        if (counts[0].count > 0) delimiter = counts[0].delim;
      }
      
      const rows = lines.map(line => line.split(delimiter).map(c => c.trim()));
      storeParsedData(rows);
    };
    reader.readAsText(file);
  }

  function storeParsedData(rows) {
    // Detect header row
    let headerIdx = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].some(cell => String(cell).trim() !== '')) {
        headerIdx = i;
        break;
      }
    }
    
    loadedFileHeaders = rows[headerIdx].map((h, i) => {
      const s = String(h).trim();
      return s !== '' ? s : `Cột ${i + 1}`;
    });
    
    loadedFileData = rows.slice(headerIdx + 1);
    
    // Setup select options
    colMapSelects.forEach(select => {
      select.innerHTML = '<option value="">-- Bỏ qua --</option>';
      loadedFileHeaders.forEach((h, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `${h} (Cột ${idx + 1})`;
        select.appendChild(opt);
      });
    });
    
    // Auto map columns
    loadedFileHeaders.forEach((h, idx) => {
      const l = h.toLowerCase();
      if (l.includes('sdt') || l.includes('phone') || l.includes('sđt') || l.includes('điện thoại')) {
        mapPhoneCol.value = idx;
      }
      if (l.includes('email') || l.includes('mail')) {
        mapEmailCol.value = idx;
      }
      if (l.includes('ten') || l.includes('họ') || l.includes('name')) {
        mapNameCol.value = idx;
      }
    });
    
    // Listen for mapping changes
    colMapSelects.forEach(select => {
      select.onchange = () => processData();
    });
    
    columnMappingSection.style.display = 'block';
    processData();
  }

  function updateCharCount() {
    charCount.textContent = `${rawTextarea.value.length} ký tự`;
  }

  // ==========================================================================
  // --- Cleaning & Validation Helpers ---
  // ==========================================================================
  
  // Sửa Telex và dấu tiếng Việt của Email
  function fixEmailTelexAndAccents(email) {
    let cleaned = email.trim();
    const atIdx = cleaned.lastIndexOf('@');
    if (atIdx === -1) return cleaned;
    
    let local = cleaned.substring(0, atIdx);
    let domain = cleaned.substring(atIdx + 1).toLowerCase();
    
    // 1. Remove standard Vietnamese accents from domain and TLD using normalization
    domain = domain.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, 'd');
    
    // 2. Fix TLD typos (like .cơm -> .com)
    domain = domain.replace(/\.cơm$|\.coơm$|\.cỏm$|\.cốm$|\.con$/g, '.com');
    domain = domain.replace(/\.vớn$|\.vỏn$/g, '.vn');
    
    // 3. Fix common host name typos
    domain = domain.replace(/^gmâil|^gmaỉl|^gmaill|^gamil|^gmali|^gmai$/g, 'gmail');
    domain = domain.replace(/^yàhoo|^yahou|^yaho$/g, 'yahoo');
    domain = domain.replace(/^outloọk|^outlok|^outluc$/g, 'outlook');
    domain = domain.replace(/^hotmaill|^hotmai$/g, 'hotmail');
    
    return local + '@' + domain;
  }

  // Clean Email function
  function cleanEmail(val) {
    if (!val) return { value: '', logs: [], category: 'empty' };
    
    let raw = String(val).trim();
    let original = raw;
    let logs = [];
    let cleaned = raw;
    
    if (ruleEmailLowercase.checked) {
      cleaned = cleaned.toLowerCase();
    }
    
    if (ruleEmailTelex.checked) {
      cleaned = fixEmailTelexAndAccents(cleaned);
    }
    
    if (cleaned !== original) {
      logs.push("Sửa lỗi gõ Telex/viết hoa email");
    }
    
    // Validate email
    if (ruleEmailValidate.checked) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleaned)) {
        return {
          value: cleaned,
          original,
          logs: ["Email sai định dạng"],
          category: 'error'
        };
      }
    }
    
    // Filter disposable email
    if (ruleEmailFilterDisposable.checked) {
      const parts = cleaned.split('@');
      const domain = parts[parts.length - 1];
      if (disposableEmailDomains.has(domain)) {
        return {
          value: cleaned,
          original,
          logs: ["Phát hiện email ảo/tạm thời"],
          category: 'error'
        };
      }
    }
    
    const category = (cleaned !== original) ? 'fixed' : 'valid';
    return { value: cleaned, original, logs, category };
  }

  // Clean Phone function
  function cleanPhone(val) {
    if (!val) return { value: '', logs: [], category: 'empty' };
    
    let raw = String(val).trim();
    let original = raw;
    let logs = [];
    
    // 1. Remove spaces, dashes, dots, brackets
    let cleaned = raw;
    if (rulePhoneDigitsOnly.checked) {
      // Keep leading '+' if present
      const hasPlus = raw.startsWith('+');
      cleaned = raw.replace(/[^\d]/g, '');
      if (hasPlus) cleaned = '+' + cleaned;
    } else {
      cleaned = raw.replace(/\s+/g, '');
    }
    
    if (cleaned !== original) {
      logs.push("Xóa khoảng trắng/ký tự đặc biệt");
    }
    
    // Standardize to 0 for prefix mapping and validation
    let temp = cleaned;
    let hasPlus = temp.startsWith('+');
    let numberPart = temp.replace(/^\+/, '');
    let std0 = '';
    
    if (hasPlus && numberPart.startsWith('84')) {
      std0 = '0' + numberPart.slice(2);
    } else if (numberPart.startsWith('84') && numberPart.length > 9) {
      std0 = '0' + numberPart.slice(2);
    } else if (numberPart.startsWith('0')) {
      std0 = numberPart;
    } else if (numberPart.length === 9) {
      std0 = '0' + numberPart;
      logs.push("Thêm số 0 vào trước SĐT");
    } else {
      std0 = temp;
    }
    
    // 2. Convert old 11-digit VN mobile prefixes to 10-digit
    let converted = std0;
    if (rulePhoneConvertOldPrefix.checked && std0.startsWith('0') && std0.length === 11) {
      const prefix4 = std0.substring(0, 4);
      if (vnPhonePrefixMap[prefix4]) {
        converted = vnPhonePrefixMap[prefix4] + std0.substring(4);
        logs.push("Chuyển đổi đầu số di động VN cũ sang mới");
      }
    }
    
    // 3. Format output country code formatting
    let formatted = converted;
    if (rulePhoneCountryCode.checked && converted.startsWith('0') && converted.length === 10) {
      const fmt = phoneFormat.value;
      if (fmt === 'prefix_84') {
        formatted = '84' + converted.slice(1);
      } else if (fmt === 'prefix_plus84') {
        formatted = '+84' + converted.slice(1);
      }
    }
    
    // 4. Validate Phone
    let countDigits = converted.replace(/[^\d]/g, '').length;
    let isVnMobile = /^0[35789]\d{8}$/.test(converted);
    
    if (rulePhoneValidate.checked) {
      if (converted.length > 10) {
        return {
          value: formatted,
          original,
          logs: [`Thừa số: Xóa khoảng trắng/ký tự đặc biệt (có ${countDigits} số)`],
          category: 'error'
        };
      } else if (converted.length < 10) {
        return {
          value: formatted,
          original,
          logs: [`Thiếu số: kiểm tra lại (có ${countDigits} số)`],
          category: 'error'
        };
      } else if (!isVnMobile) {
        return {
          value: formatted,
          original,
          logs: [`Sai đầu số di động Việt Nam (có 10 số)`],
          category: 'error'
        };
      }
    }
    
    const category = (formatted !== original || logs.length > 0) ? 'fixed' : 'valid';
    return { value: formatted, original, logs, category };
  }

  // Clean Name helper
  function cleanName(val) {
    if (!val) return { value: '', logs: [], category: 'empty' };
    
    let raw = String(val).trim();
    let original = raw;
    let logs = [];
    
    let cleaned = raw.replace(/\s+/g, ' ').trim();
    
    // Capitalize: Nguyen Van A
    cleaned = cleaned
      .toLowerCase()
      .split(' ')
      .filter(w => w.length > 0)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
      
    // Remove accents if they want (let's keep accents by default, but we can do normalization if they select rule)
    // There is no specific accents removal checkbox in the mockup, but we keep it clean.
    
    if (cleaned !== original) {
      logs.push("Chuẩn hóa định dạng họ tên");
    }
    
    const category = (cleaned !== original) ? 'fixed' : 'valid';
    return { value: cleaned, original, logs, category };
  }

  // Auto-detect item type (for raw text lists)
  function detectType(str) {
    const s = str.trim();
    if (s.includes('@')) return 'email';
    // If it has digits and fits phone patterns
    if (/[0-9]/.test(s) && s.replace(/[^\d]/g, '').length >= 5) return 'phone';
    return 'name';
  }

  // ==========================================================================
  // --- Core Processing Loop ---
  // ==========================================================================
  
  function processData() {
    let rawRows = [];
    let isFileMode = (loadedFileData !== null);
    
    let indexPhone = mapPhoneCol.value !== '' ? parseInt(mapPhoneCol.value) : -1;
    let indexEmail = mapEmailCol.value !== '' ? parseInt(mapEmailCol.value) : -1;
    let indexName = mapNameCol.value !== '' ? parseInt(mapNameCol.value) : -1;
    
    // 1. Gather Rows
    if (isFileMode) {
      rawRows = loadedFileData.map(r => [...r]);
    } else {
      // Split raw textarea by line
      const lines = rawTextarea.value.split(/\r?\n/);
      rawRows = lines.map(line => {
        // If it's standard text line but has commas/tabs, let's treat it as single text column
        return [line.trim()];
      });
    }
    
    let totalInput = 0;
    let countValid = 0;
    let countFixed = 0;
    let countDup = 0;
    let countError = 0;
    
    let seenEmails = new Set();
    let seenPhones = new Set();
    let seenAll = new Set();
    
    processedItemsList = [];
    
    // Loop through each row
    rawRows.forEach((row, idx) => {
      // Generate stable row key
      const rowId = `row-${idx}`;
      
      // If row was deleted by user action, exclude it
      if (deletedItemIds.has(rowId)) return;
      
      // Check if row is completely empty
      const isRowEmpty = row.every(cell => String(cell).trim() === '');
      if (isRowEmpty) {
        if (ruleRemoveEmpty.checked) return; // skip
      }
      
      totalInput++;
      
      let cleanRow = [...row];
      let rowLogs = [];
      let rowCategory = 'valid'; // valid, fixed, error, dup
      
      let cleanValDisplay = '';
      let originalValDisplay = '';
      
      // --- Handle Processing based on file column maps OR auto-detection ---
      if (isFileMode) {
        // A. File Upload columns mapped
        let isRowValid = true;
        let isRowFixed = false;
        
        // 1. Name clean
        if (indexName !== -1 && indexName < row.length) {
          const res = cleanName(row[indexName]);
          if (res.category === 'fixed') isRowFixed = true;
          cleanRow[indexName] = res.value;
          
          if (!cleanValDisplay) {
            cleanValDisplay = res.value;
            originalValDisplay = res.original;
          }
        }
        
        // 2. Phone clean
        if (indexPhone !== -1 && indexPhone < row.length) {
          const res = cleanPhone(row[indexPhone]);
          if (res.category === 'error') {
            isRowValid = false;
            rowLogs.push(...res.logs);
          } else if (res.category === 'fixed') {
            isRowFixed = true;
            rowLogs.push(...res.logs);
          }
          cleanRow[indexPhone] = res.value;
          
          // Phone takes display priority
          cleanValDisplay = res.value;
          originalValDisplay = res.original;
        }
        
        // 3. Email clean
        if (indexEmail !== -1 && indexEmail < row.length) {
          const res = cleanEmail(row[indexEmail]);
          if (res.category === 'error') {
            isRowValid = false;
            rowLogs.push(...res.logs);
          } else if (res.category === 'fixed') {
            isRowFixed = true;
            rowLogs.push(...res.logs);
          }
          cleanRow[indexEmail] = res.value;
          
          if (!cleanValDisplay || indexPhone === -1) {
            cleanValDisplay = res.value;
            originalValDisplay = res.original;
          }
        }
        
        rowCategory = !isRowValid ? 'error' : (isRowFixed ? 'fixed' : 'valid');
        
      } else {
        // B. Raw Text Area List (single item per line)
        const cellVal = String(row[0]);
        if (cellVal.trim() === '') {
          rowCategory = 'empty';
        } else {
          const detected = detectType(cellVal);
          let res = {};
          if (detected === 'email') {
            res = cleanEmail(cellVal);
          } else if (detected === 'phone') {
            res = cleanPhone(cellVal);
          } else {
            res = cleanName(cellVal);
          }
          
          cleanRow[0] = res.value;
          cleanValDisplay = res.value;
          originalValDisplay = res.original;
          rowLogs.push(...res.logs);
          rowCategory = res.category;
        }
      }
      
      if (rowCategory === 'empty') {
        if (ruleRemoveEmpty.checked) return;
        rowCategory = 'error';
        rowLogs = ["Dòng trống"];
      }
      
      // --- Deduplication Checks ---
      if (ruleDeduplicate.checked && rowCategory !== 'error') {
        let isDup = false;
        let dupVal = '';
        
        const currentEmail = (indexEmail !== -1 && isFileMode) ? String(cleanRow[indexEmail]).trim().toLowerCase() : (detectType(String(row[0])) === 'email' ? cleanRow[0].toLowerCase() : '');
        const currentPhone = (indexPhone !== -1 && isFileMode) ? String(cleanRow[indexPhone]).trim() : (detectType(String(row[0])) === 'phone' ? cleanRow[0] : '');
        const rowString = cleanRow.join('|').toLowerCase();
        
        const crit = dedupCriteria.value;
        
        if (crit === 'email' && currentEmail !== '') {
          if (seenEmails.has(currentEmail)) {
            isDup = true;
            dupVal = `Email: ${currentEmail}`;
          } else {
            seenEmails.add(currentEmail);
          }
        } else if (crit === 'phone' && currentPhone !== '') {
          if (seenPhones.has(currentPhone)) {
            isDup = true;
            dupVal = `SĐT: ${currentPhone}`;
          } else {
            seenPhones.add(currentPhone);
          }
        } else if (crit === 'any') {
          if (currentEmail !== '' && seenEmails.has(currentEmail)) {
            isDup = true;
            dupVal = `Email: ${currentEmail}`;
          }
          if (currentPhone !== '' && seenPhones.has(currentPhone)) {
            isDup = true;
            dupVal = `SĐT: ${currentPhone}`;
          }
          
          if (!isDup) {
            if (currentEmail !== '') seenEmails.add(currentEmail);
            if (currentPhone !== '') seenPhones.add(currentPhone);
          }
        } else {
          // 'all'
          if (seenAll.has(rowString)) {
            isDup = true;
            dupVal = "Trùng lặp dòng";
          } else {
            seenAll.add(rowString);
          }
        }
        
        if (isDup) {
          rowCategory = 'dup';
          rowLogs = [`Trùng lặp (${dupVal})`];
        }
      }
      
      // Increment Stat Counters
      if (rowCategory === 'dup') {
        countDup++;
      } else if (rowCategory === 'error') {
        countError++;
      } else if (rowCategory === 'fixed') {
        countFixed++;
      } else if (rowCategory === 'valid') {
        countValid++;
      }
      
      // Store in state
      processedItemsList.push({
        id: rowId,
        cleanRow,
        cleanValDisplay,
        originalValDisplay,
        logs: rowLogs,
        category: rowCategory
      });
    });
    
    // Update Stats Display
    statTotal.textContent = totalInput;
    statValid.textContent = countValid;
    statFixed.textContent = countFixed;
    statDup.textContent = countDup;
    statError.textContent = countError;
    
    renderTable();
  }

  // ==========================================================================
  // --- Render Table & Filters ---
  // ==========================================================================
  
  function renderTable() {
    resultsTableBody.innerHTML = '';
    
    const query = searchInput.value.trim().toLowerCase();
    
    // Filter out duplicates from display (matching user mockup: duplicates are removed, warnings are shown)
    // E.g., showing only valid, fixed, and errors
    const visibleList = processedItemsList.filter(item => {
      if (item.category === 'dup') return false; // Hide duplicates
      
      // Apply Search Filter
      if (query !== '') {
        const matchesClean = item.cleanValDisplay.toLowerCase().includes(query);
        const matchesOriginal = item.originalValDisplay.toLowerCase().includes(query);
        const matchesError = item.logs.join(' ').toLowerCase().includes(query);
        return matchesClean || matchesOriginal || matchesError;
      }
      
      return true;
    });
    
    if (visibleList.length === 0) {
      resultsTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-table-state">
            ${processedItemsList.length === 0 ? 'Nhập dữ liệu vào ô bên trái để hiển thị kết quả.' : 'Không tìm thấy kết quả phù hợp.'}
          </td>
        </tr>
      `;
      return;
    }
    
    visibleList.forEach((item, index) => {
      const tr = document.createElement('tr');
      
      // 1. STT
      const tdIdx = document.createElement('td');
      tdIdx.textContent = index + 1;
      tr.appendChild(tdIdx);
      
      // 2. Cleaned value vs original
      const tdVal = document.createElement('td');
      tdVal.innerHTML = `
        <span class="col-clean-val">${item.cleanValDisplay || '-'}</span>
        <span class="col-orig-val">${item.originalValDisplay || '-'}</span>
      `;
      tr.appendChild(tdVal);
      
      // 3. Status Badge
      const tdStatus = document.createElement('td');
      tdStatus.style.textAlign = 'center';
      
      if (item.category === 'error') {
        // Red split badge for "CẢNH BÁO"
        tdStatus.innerHTML = `<span class="badge-warning-wrap"><span>CẢNH</span><span>BÁO</span></span>`;
      } else if (item.category === 'fixed') {
        tdStatus.innerHTML = `<span class="badge badge-fixed">ĐÃ SỬA</span>`;
      } else {
        tdStatus.innerHTML = `<span class="badge badge-success">HỢP LỆ</span>`;
      }
      tr.appendChild(tdStatus);
      
      // 4. Log modification details
      const tdLogs = document.createElement('td');
      tdLogs.className = 'col-log-desc';
      if (item.category === 'error') {
        tdLogs.textContent = item.logs.join(', ');
        tdLogs.style.color = '#f87171'; // Red highlight for warning details
      } else if (item.category === 'fixed') {
        tdLogs.textContent = item.logs.join(', ');
        tdLogs.style.color = '#fbbf24'; // Yellow highlight for fixes
      } else {
        tdLogs.textContent = 'Hợp lệ';
        tdLogs.style.color = '#a0aec0';
      }
      tr.appendChild(tdLogs);
      
      // 5. Actions: Copy and Delete
      const tdActions = document.createElement('td');
      tdActions.innerHTML = `
        <div class="action-cell">
          <button class="btn-table-action btn-copy" title="Copy dòng này">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.4M9 2.25H18a2.25 2.25 0 012.25 2.25v12.25A2.25 2.25 0 0118 19H9a2.25 2.25 0 01-2.25-2.25V4.5A2.25 2.25 0 019 2.25z" />
            </svg>
          </button>
          <button class="btn-table-action btn-delete" title="Xóa dòng này">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      `;
      
      // Bind inline action events
      tdActions.querySelector('.btn-copy').onclick = () => {
        navigator.clipboard.writeText(item.cleanValDisplay);
        showTemporaryFeedback(tdActions.querySelector('.btn-copy'), 'Copied');
      };
      
      tdActions.querySelector('.btn-delete').onclick = () => {
        deletedItemIds.add(item.id);
        processData(); // re-process list to exclude this item
      };
      
      tr.appendChild(tdActions);
      resultsTableBody.appendChild(tr);
    });
  }

  function showTemporaryFeedback(button, text) {
    const originalHTML = button.innerHTML;
    button.innerHTML = `<span style="font-size: 0.65rem; color:#60a5fa; font-weight:700;">${text}</span>`;
    setTimeout(() => {
      button.innerHTML = originalHTML;
    }, 1000);
  }

  // ==========================================================================
  // --- Toolbar Actions (Copy All & File Exporters) ---
  // ==========================================================================
  
  // Copy All button
  btnCopyAll.addEventListener('click', () => {
    // Get all cleaned items that are NOT errors or duplicates
    const cleanItems = processedItemsList
      .filter(item => item.category === 'valid' || item.category === 'fixed')
      .map(item => item.cleanValDisplay);
      
    if (cleanItems.length === 0) {
      alert('Không có dữ liệu sạch nào để sao chép!');
      return;
    }
    
    const textToCopy = cleanItems.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = btnCopyAll.innerHTML;
      btnCopyAll.innerHTML = '✓ Đã Copy Hết!';
      btnCopyAll.style.backgroundColor = '#10b981';
      setTimeout(() => {
        btnCopyAll.innerHTML = originalText;
        btnCopyAll.style.backgroundColor = 'var(--primary)';
      }, 1500);
    });
  });

  // Export TXT
  btnExportTXT.addEventListener('click', () => {
    const cleanItems = processedItemsList
      .filter(item => item.category === 'valid' || item.category === 'fixed')
      .map(item => item.cleanValDisplay);
      
    if (cleanItems.length === 0) {
      alert('Không có dữ liệu sạch để xuất!');
      return;
    }
    
    const content = cleanItems.join('\n');
    downloadBlob(content, 'text/plain', 'data_cleaned.txt');
  });

  // Export CSV
  btnExportCSV.addEventListener('click', () => {
    // Collect headers and clean rows
    const cleanRows = processedItemsList
      .filter(item => item.category === 'valid' || item.category === 'fixed')
      .map(item => item.cleanRow);
      
    if (cleanRows.length === 0) {
      alert('Không có dữ liệu sạch để xuất!');
      return;
    }
    
    let csvData = [];
    if (loadedFileData) {
      csvData = [loadedFileHeaders, ...cleanRows];
    } else {
      // Manual mode raw output
      csvData = [['Dữ liệu sạch'], ...cleanRows];
    }
    
    const content = Papa.unparse(csvData);
    downloadBlob("\uFEFF" + content, 'text/csv;charset=utf-8;', 'data_cleaned.csv');
  });

  // Export Excel (.xlsx) via SheetJS
  btnExportXLSX.addEventListener('click', () => {
    const cleanRows = processedItemsList
      .filter(item => item.category === 'valid' || item.category === 'fixed')
      .map(item => item.cleanRow);
      
    if (cleanRows.length === 0) {
      alert('Không có dữ liệu sạch để xuất!');
      return;
    }
    
    let xlsxData = [];
    if (loadedFileData) {
      xlsxData = [loadedFileHeaders, ...cleanRows];
    } else {
      xlsxData = [['Dữ liệu sạch'], ...cleanRows];
    }

    try {
      const sheet = XLSX.utils.aoa_to_sheet(xlsxData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, "Data Cleaned");
      
      // Auto-fit column widths
      sheet['!cols'] = xlsxData[0].map((_, colIdx) => {
        let maxLen = 10;
        xlsxData.forEach(row => {
          const val = row[colIdx] !== undefined ? String(row[colIdx]) : '';
          if (val.length > maxLen) maxLen = val.length;
        });
        return { wch: maxLen + 2 };
      });
      
      let exportName = 'data_cleaned.xlsx';
      if (currentFileName) {
        const parts = currentFileName.split('.');
        parts.pop();
        exportName = parts.join('.') + '_cleaned.xlsx';
      }
      
      XLSX.writeFile(workbook, exportName);
    } catch (err) {
      alert('Không thể xuất tệp Excel: ' + err.message);
    }
  });

  function downloadBlob(content, type, defaultName) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    let exportName = defaultName;
    if (currentFileName) {
      const parts = currentFileName.split('.');
      parts.pop();
      const ext = defaultName.split('.').pop();
      exportName = parts.join('.') + '_cleaned.' + ext;
    }
    
    link.setAttribute("download", exportName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Initial run ---
  // Load sample data into rawTextarea initially to match the screenshot representation!
  rawTextarea.value = `0904020011
090.402.0011
090 402 0011
0904 020 011
+84904020011
(+84)904 020 011
090-402-0011
09040200111
090402001
904020011`;
  
  updateCharCount();
  processData();
});
