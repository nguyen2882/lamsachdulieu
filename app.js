/* ==========================================================================
   DATACLEANER PRO - CORE JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');

  const tabBtnFile = document.getElementById('tabBtnFile');
  const tabBtnRaw = document.getElementById('tabBtnRaw');
  const panelFile = document.getElementById('panelFile');
  const panelRaw = document.getElementById('panelRaw');

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const browseBtn = document.getElementById('browseBtn');
  const selectedFileInfo = document.getElementById('selectedFileInfo');
  const selectedFileName = document.getElementById('selectedFileName');
  const selectedFileSize = document.getElementById('selectedFileSize');
  const removeFileBtn = document.getElementById('removeFileBtn');

  const rawTextarea = document.getElementById('rawTextarea');
  const clearRawTextBtn = document.getElementById('clearRawTextBtn');
  const loadExampleBtn = document.getElementById('loadExampleBtn');

  const columnMappingSection = document.getElementById('columnMappingSection');
  const mapNameCol = document.getElementById('mapNameCol');
  const mapPhoneCol = document.getElementById('mapPhoneCol');
  const mapEmailCol = document.getElementById('mapEmailCol');
  const colMapSelects = document.querySelectorAll('.col-map-select');

  const btnProcess = document.getElementById('btnProcess');
  const processBtnText = document.getElementById('processBtnText');
  const spinner = btnProcess.querySelector('.spinner');
  const iconSparkles = btnProcess.querySelector('.icon-sparkles');

  // Rules checkboxes
  const ruleNameCapitalize = document.getElementById('ruleNameCapitalize');
  const ruleNameTrim = document.getElementById('ruleNameTrim');
  const ruleNameNoAccents = document.getElementById('ruleNameNoAccents');
  const rulePhoneDigitsOnly = document.getElementById('rulePhoneDigitsOnly');
  const rulePhoneCountryCode = document.getElementById('rulePhoneCountryCode');
  const phoneFormat = document.getElementById('phoneFormat');
  const phoneFormatSelectContainer = document.getElementById('phoneFormatSelectContainer');
  const rulePhoneConvertOldPrefix = document.getElementById('rulePhoneConvertOldPrefix');
  const rulePhoneValidate = document.getElementById('rulePhoneValidate');
  const ruleEmailLowercase = document.getElementById('ruleEmailLowercase');
  const ruleEmailValidate = document.getElementById('ruleEmailValidate');
  const ruleEmailFilterDisposable = document.getElementById('ruleEmailFilterDisposable');
  const ruleDeduplicate = document.getElementById('ruleDeduplicate');
  const dedupCriteria = document.getElementById('dedupCriteria');
  const dupColumnSelectContainer = document.getElementById('dupColumnSelectContainer');
  const ruleRemoveEmpty = document.getElementById('ruleRemoveEmpty');

  // Results elements
  const resultsDashboard = document.getElementById('resultsDashboard');
  const statTotalRows = document.getElementById('statTotalRows');
  const statValidRows = document.getElementById('statValidRows');
  const statFixedRows = document.getElementById('statFixedRows');
  const statInvalidRows = document.getElementById('statInvalidRows');
  const statDupsRemoved = document.getElementById('statDupsRemoved');
  
  const chartCircleProgress = document.getElementById('chartCircleProgress');
  const chartPercentage = document.getElementById('chartPercentage');
  const pctClean = document.getElementById('pctClean');
  const pctDirty = document.getElementById('pctDirty');
  
  const logsContainer = document.getElementById('logsContainer');
  const previewTableBody = document.getElementById('previewTableBody');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnExportXLSX = document.getElementById('btnExportXLSX');

  // --- App State ---
  let activeTab = 'file'; // 'file' or 'raw'
  let loadedFileData = null; // Stores the parsed array of arrays representing the file
  let loadedFileHeaders = []; // Stores column headers
  let cleanedData = []; // Cleaned rows for export
  let currentFileName = '';

  // Disposable email domains list
  const disposableEmailDomains = new Set([
    'yopmail.com', 'mailinator.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
    'getairmail.com', 'guerrillamail.com', 'sharklasers.com', 'dispostable.com', 'boun.cr',
    'trashmail.com', 'dropmail.me', '10minutemail.co.za', 'tempmailaddress.com', 'crazymailing.com'
  ]);

  // Old VN phone prefix mapping (11 digits -> 10 digits)
  const vnPhonePrefixMap = {
    // Viettel
    '0162': '032', '0163': '033', '0164': '034', '0165': '035', 
    '0166': '036', '0167': '037', '0168': '038', '0169': '039',
    // Mobifone
    '0120': '070', '0121': '079', '0122': '077', '0126': '076', '0128': '078',
    // Vinaphone
    '0123': '083', '0124': '084', '0125': '085', '0127': '081', '0129': '082',
    // Vietnamobile
    '0186': '056', '0188': '058',
    // Gmobile
    '0199': '059'
  };

  // ==========================================================================
  // --- Theme Toggle Handler ---
  // ==========================================================================
  const saveTheme = (theme) => {
    localStorage.setItem('theme', theme);
  };

  const getSavedTheme = () => {
    return localStorage.getItem('theme');
  };

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      body.classList.remove('dark-theme');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  };

  // Initialize Theme
  const savedTheme = getSavedTheme();
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-theme');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    saveTheme(newTheme);
  });

  // ==========================================================================
  // --- Options Dependencies Helper ---
  // ==========================================================================
  rulePhoneCountryCode.addEventListener('change', () => {
    if (rulePhoneCountryCode.checked) {
      phoneFormatSelectContainer.style.display = 'flex';
    } else {
      phoneFormatSelectContainer.style.display = 'none';
    }
  });

  ruleDeduplicate.addEventListener('change', () => {
    if (ruleDeduplicate.checked) {
      dupColumnSelectContainer.style.display = 'flex';
    } else {
      dupColumnSelectContainer.style.display = 'none';
    }
  });

  // ==========================================================================
  // --- Input Tab Controls ---
  // ==========================================================================
  const switchTab = (tab) => {
    activeTab = tab;
    if (tab === 'file') {
      tabBtnFile.classList.add('active');
      tabBtnRaw.classList.remove('active');
      panelFile.classList.add('active');
      panelRaw.classList.remove('active');
      
      // Update process button state
      validateProcessButtonState();
    } else {
      tabBtnRaw.classList.add('active');
      tabBtnFile.classList.remove('active');
      panelRaw.classList.add('active');
      panelFile.classList.add('active'); // Wait, typo: should be display raw only
      panelFile.classList.remove('active');
      columnMappingSection.style.display = 'none';
      
      // Update process button state
      validateProcessButtonState();
    }
  };

  tabBtnFile.addEventListener('click', () => switchTab('file'));
  tabBtnRaw.addEventListener('click', () => switchTab('raw'));

  // ==========================================================================
  // --- Manual/Raw Text Panel Actions ---
  // ==========================================================================
  rawTextarea.addEventListener('input', () => {
    validateProcessButtonState();
  });

  clearRawTextBtn.addEventListener('click', () => {
    rawTextarea.value = '';
    validateProcessButtonState();
  });

  loadExampleBtn.addEventListener('click', () => {
    rawTextarea.value = `Họ và Tên,Số điện thoại,Email
Nguyễn Văn A, 0912 345 678, nguYenvAna@gmail.com
  trần thị b   , 0168.999.8888, tranthib@yopmail.com
Lê Hoàng Nam, +84 905 123 456, namlh@outlook.com
Phạm Minh Đức, 097-888-9999, ducpm@invalid-email
Vũ Thị Mai, 0123.456.7890, maivt123@gmail.com
Nguyễn Văn A, 0912345678, nguYenvAna@gmail.com
Hoàng Anh Tuấn, 098765, tuanha@gmail.com
Nguyễn Thị Hương, 0355443322, huongnt@temp-mail.org
,,`;
    validateProcessButtonState();
  });

  // ==========================================================================
  // --- File Drag & Drop Panel Actions ---
  // ==========================================================================
  browseBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleSelectedFile(file);
  });

  // Drag over effects
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
    if (file) handleSelectedFile(file);
  });

  removeFileBtn.addEventListener('click', () => {
    resetFileInfo();
  });

  const resetFileInfo = () => {
    loadedFileData = null;
    loadedFileHeaders = [];
    currentFileName = '';
    fileInput.value = '';
    selectedFileInfo.style.display = 'none';
    dropzone.style.display = 'block';
    columnMappingSection.style.display = 'none';
    validateProcessButtonState();
  };

  const handleSelectedFile = (file) => {
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

    // Parse the file data based on extension
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (extension === 'csv') {
      parseCSV(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
      parseExcel(file);
    } else if (extension === 'txt') {
      parseTXT(file);
    } else {
      alert('Định dạng tệp không được hỗ trợ! Vui lòng chọn tệp CSV, Excel hoặc TXT.');
      resetFileInfo();
    }
  };

  // Format File Size helper
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // ==========================================================================
  // --- File Parsers (CSV, Excel, TXT) ---
  // ==========================================================================
  
  // CSV Parser via PapaParse
  function parseCSV(file) {
    Papa.parse(file, {
      skipEmptyLines: false, // Keep empty lines so we can filter and log them if configured
      complete: function(results) {
        if (results.data && results.data.length > 0) {
          processRawDataToState(results.data);
        } else {
          alert('Tệp CSV không chứa dữ liệu!');
          resetFileInfo();
        }
      },
      error: function(err) {
        alert('Lỗi đọc tệp CSV: ' + err.message);
        resetFileInfo();
      }
    });
  }

  // Excel Parser via SheetJS
  function parseExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Grab the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of arrays
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        if (rows && rows.length > 0) {
          processRawDataToState(rows);
        } else {
          alert('Tệp Excel không chứa dữ liệu!');
          resetFileInfo();
        }
      } catch (err) {
        alert('Lỗi đọc tệp Excel: ' + err.message);
        resetFileInfo();
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // TXT Parser (reads line by line, splits by common delimiters)
  function parseTXT(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split(/\r?\n/);
      
      // Auto-detect delimiter from the first 5 lines (comma, semicolon, tab or pipe)
      let delimiter = ',';
      const sampleLines = lines.slice(0, 5).filter(line => line.trim().length > 0);
      if (sampleLines.length > 0) {
        const delims = [',', ';', '\t', '|'];
        const counts = delims.map(d => {
          return {
            delim: d,
            count: sampleLines.reduce((acc, line) => acc + (line.split(d).length - 1), 0)
          };
        });
        // Sort descending
        counts.sort((a, b) => b.count - a.count);
        if (counts[0].count > 0) {
          delimiter = counts[0].delim;
        }
      }

      // Convert to array of arrays
      const rows = lines.map(line => {
        return line.split(delimiter).map(cell => cell.trim());
      });

      if (rows && rows.length > 0) {
        processRawDataToState(rows);
      } else {
        alert('Tệp văn bản không chứa dữ liệu!');
        resetFileInfo();
      }
    };
    reader.readAsText(file);
  }

  // Common handler after parsing raw arrays
  function processRawDataToState(rows) {
    // Clean up empty outer-bound columns if any
    const maxCols = Math.max(...rows.map(r => r.length));
    
    // Assume the first row containing elements is the header
    let headerRowIndex = 0;
    // Find first non-empty row to act as headers
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].some(cell => String(cell).trim() !== '')) {
        headerRowIndex = i;
        break;
      }
    }

    loadedFileHeaders = rows[headerRowIndex].map((h, index) => {
      const headerStr = String(h).trim();
      return headerStr !== '' ? headerStr : `Cột ${index + 1}`;
    });

    // Save data rows (everything after the header)
    loadedFileData = rows.slice(headerRowIndex + 1);

    // Populate Column Mapping Selects
    populateColumnMapping(loadedFileHeaders);
    
    columnMappingSection.style.display = 'block';
    validateProcessButtonState();
  }

  // Populate mapping selectors
  function populateColumnMapping(headers) {
    colMapSelects.forEach(select => {
      // Clear all options except the first "Skip" option
      select.innerHTML = '<option value="">-- Không có / Bỏ qua --</option>';
      
      headers.forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${header} (Cột ${index + 1})`;
        select.appendChild(option);
      });
    });

    // Auto-detect columns based on name matches
    headers.forEach((header, index) => {
      const lower = header.toLowerCase();
      
      // Auto-detect Name
      if (lower.includes('ten') || lower.includes('họ') || lower.includes('ho') || lower.includes('name') || lower.includes('khach') || lower.includes('user')) {
        if (!mapNameCol.value) mapNameCol.value = index;
      }
      // Auto-detect Phone
      if (lower.includes('sdt') || lower.includes('phone') || lower.includes('so dien thoai') || lower.includes('sđt') || lower.includes('tel') || lower.includes('dien thoai') || lower.includes('mobile')) {
        if (!mapPhoneCol.value) mapPhoneCol.value = index;
      }
      // Auto-detect Email
      if (lower.includes('email') || lower.includes('mail') || lower.includes('thu dien tu')) {
        if (!mapEmailCol.value) mapEmailCol.value = index;
      }
    });

    // Fallback detection if headers didn't match (analyze first row values)
    if (loadedFileData && loadedFileData.length > 0) {
      const sampleRow = loadedFileData[0];
      
      if (!mapNameCol.value || !mapPhoneCol.value || !mapEmailCol.value) {
        sampleRow.forEach((val, index) => {
          const str = String(val).trim();
          if (str === '') return;

          // Check if looks like Email
          if (!mapEmailCol.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
            mapEmailCol.value = index;
          }
          // Check if looks like Phone
          if (!mapPhoneCol.value && /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(str) && str.replace(/[^\d]/g, '').length >= 8) {
            mapPhoneCol.value = index;
          }
        });
      }
    }
  }

  // Validate process button based on loaded content
  function validateProcessButtonState() {
    if (activeTab === 'file') {
      if (loadedFileData && loadedFileData.length > 0) {
        btnProcess.removeAttribute('disabled');
      } else {
        btnProcess.setAttribute('disabled', 'true');
      }
    } else {
      if (rawTextarea.value.trim().length > 0) {
        btnProcess.removeAttribute('disabled');
      } else {
        btnProcess.setAttribute('disabled', 'true');
      }
    }
  }

  // ==========================================================================
  // --- Core Processing Logic ---
  // ==========================================================================
  
  btnProcess.addEventListener('click', () => {
    // Show spinner & disable button
    btnProcess.setAttribute('disabled', 'true');
    spinner.style.display = 'inline-block';
    iconSparkles.style.display = 'none';
    processBtnText.textContent = 'Đang làm sạch dữ liệu...';

    // Small delay to let the UI update and draw the loader
    setTimeout(() => {
      try {
        executeCleaning();
      } catch (err) {
        console.error(err);
        alert('Đã xảy ra lỗi trong quá trình xử lý: ' + err.message);
      } finally {
        // Reset process button state
        btnProcess.removeAttribute('disabled');
        spinner.style.display = 'none';
        iconSparkles.style.display = 'inline-block';
        processBtnText.textContent = 'Bắt đầu làm sạch dữ liệu';
      }
    }, 100);
  });

  // Remove accents function for Vietnamese text
  function removeAccents(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  // Capitalize name function (Nguyen Van A -> Nguyen Van A)
  function capitalizeName(str) {
    return str
      .toLowerCase()
      .split(' ')
      .filter(w => w.length > 0)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // Standardize and Convert VN phone carrier prefixes
  function processPhone(val, convertPrefix, outputFormat, digitsOnly, validate) {
    if (!val) return { phone: '', logs: [], isValid: false };
    
    let raw = String(val).trim();
    let original = raw;
    let logs = [];
    
    // 1. Remove non-digits if enabled (keep '+' at first position just in case)
    let cleaned = '';
    if (digitsOnly) {
      const startsWithPlus = raw.startsWith('+');
      cleaned = raw.replace(/[^\d]/g, '');
      if (startsWithPlus && !cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
      }
      if (cleaned !== original) {
        logs.push(`Loại bỏ ký tự đặc biệt khỏi SĐT: "${original}" -> "${cleaned}"`);
      }
    } else {
      cleaned = raw.replace(/\s+/g, ''); // just strip spacing
    }

    // Standardize representation to simple digit string with leading country indicator or 0
    let temp = cleaned;
    let hasPlus = temp.startsWith('+');
    let numberPart = temp.replace(/^\+/, '');

    // Convert +84 or 84 to 0 for standard prefix translation
    let standard0 = '';
    if (hasPlus && numberPart.startsWith('84')) {
      standard0 = '0' + numberPart.slice(2);
    } else if (numberPart.startsWith('84') && numberPart.length > 9) {
      standard0 = '0' + numberPart.slice(2);
    } else if (numberPart.startsWith('0')) {
      standard0 = numberPart;
    } else if (numberPart.length === 9) {
      // Missing leading zero, likely standard 9 digit mobil
      standard0 = '0' + numberPart;
      logs.push(`Thêm số 0 vào trước SĐT thiếu: "${cleaned}" -> "${standard0}"`);
    } else {
      standard0 = temp; // fallback
    }

    // 2. Convert old VN carrier prefix (11 digits to 10 digits)
    let converted = standard0;
    if (convertPrefix && standard0.startsWith('0') && standard0.length === 11) {
      const prefix4 = standard0.substring(0, 4);
      if (vnPhonePrefixMap[prefix4]) {
        converted = vnPhonePrefixMap[prefix4] + standard0.substring(4);
        logs.push(`Chuyển đổi đầu số cũ VN: "${standard0}" -> "${converted}"`);
      }
    }

    // 3. Apply Output Formatting (prefix_0, prefix_84, prefix_plus84)
    let formatted = converted;
    if (rulePhoneCountryCode.checked && converted.startsWith('0') && converted.length === 10) {
      if (outputFormat === 'prefix_84') {
        formatted = '84' + converted.slice(1);
      } else if (outputFormat === 'prefix_plus84') {
        formatted = '+84' + converted.slice(1);
      } else {
        formatted = converted;
      }
    }

    // 4. Validate Phone structure
    let isValid = true;
    if (validate) {
      // Validate based on standardized 10-digit number starting with 0
      const stdNoCountry = converted.startsWith('0') ? converted : ('0' + converted.replace(/^\+84|^84/, '1').slice(1));
      
      // VN mobile numbers always start with 03, 05, 07, 08, 09 and have exactly 10 digits
      const isMobileVN = /^0[35789]\d{8}$/.test(converted);
      
      if (converted.length !== 10 || !isMobileVN) {
        isValid = false;
        logs.push(`Số điện thoại không hợp lệ (độ dài/đầu số sai): "${original}"`);
      }
    }

    return { phone: formatted, logs, isValid };
  }

  // Email validation and cleaning
  function processEmail(val, lowercase, validate, filterDisposable) {
    if (!val) return { email: '', logs: [], isValid: false };
    
    let raw = String(val).trim();
    let original = raw;
    let logs = [];
    let isValid = true;

    // 1. Lowercase
    let cleaned = lowercase ? raw.toLowerCase() : raw;
    if (cleaned !== original) {
      logs.push(`Chuyển Email thành chữ thường: "${original}" -> "${cleaned}"`);
    }

    // 2. Validate format
    if (validate) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleaned)) {
        isValid = false;
        logs.push(`Email sai định dạng: "${original}"`);
        return { email: cleaned, logs, isValid };
      }
    }

    // 3. Filter disposable email
    if (filterDisposable) {
      const parts = cleaned.split('@');
      const domain = parts[parts.length - 1];
      if (disposableEmailDomains.has(domain)) {
        isValid = false;
        logs.push(`Phát hiện email ảo/rác: "${original}"`);
      }
    }

    return { email: cleaned, logs, isValid };
  }

  // Main process execution
  function executeCleaning() {
    let rowsToProcess = [];
    let headers = [];

    // Reset results variables
    cleanedData = [];
    
    let countTotal = 0;
    let countValid = 0;
    let countFixed = 0;
    let countInvalid = 0;
    let countDups = 0;

    let indexNameCol = -1;
    let indexPhoneCol = -1;
    let indexEmailCol = -1;

    let systemLogs = [];

    // --- Prepare Input ---
    if (activeTab === 'file') {
      rowsToProcess = JSON.parse(JSON.stringify(loadedFileData)); // Deep copy loaded array of arrays
      headers = [...loadedFileHeaders];
      
      indexNameCol = mapNameCol.value !== "" ? parseInt(mapNameCol.value) : -1;
      indexPhoneCol = mapPhoneCol.value !== "" ? parseInt(mapPhoneCol.value) : -1;
      indexEmailCol = mapEmailCol.value !== "" ? parseInt(mapEmailCol.value) : -1;
    } else {
      // Parse raw text
      const rawText = rawTextarea.value.trim();
      const lines = rawText.split(/\r?\n/);
      
      if (lines.length === 0) return;

      // Detect delimiter
      let delimiter = ',';
      const sampleLines = lines.slice(0, 3).filter(line => line.trim().length > 0);
      if (sampleLines.length > 0) {
        const delims = [',', ';', '\t', '|'];
        const counts = delims.map(d => {
          return {
            delim: d,
            count: sampleLines.reduce((acc, line) => acc + (line.split(d).length - 1), 0)
          };
        });
        counts.sort((a, b) => b.count - a.count);
        if (counts[0].count > 0) delimiter = counts[0].delim;
      }

      // Convert lines to array of arrays
      const allRows = lines.map(line => line.split(delimiter).map(cell => cell.trim()));
      
      // Auto headers detect for manual pasting: check if first row contains headers
      let hasHeader = false;
      const firstRow = allRows[0];
      const isHeader = firstRow.some(cell => {
        const c = cell.toLowerCase();
        return c.includes('tên') || c.includes('ho') || c.includes('name') || c.includes('sđt') || c.includes('phone') || c.includes('email') || c.includes('sdt');
      });

      if (isHeader) {
        headers = firstRow.map((h, i) => h !== '' ? h : `Cột ${i + 1}`);
        rowsToProcess = allRows.slice(1);
        hasHeader = true;
      } else {
        // Create virtual headers
        const maxCols = Math.max(...allRows.map(r => r.length));
        headers = [];
        for (let i = 0; i < maxCols; i++) {
          headers.push(`Cột ${i + 1}`);
        }
        rowsToProcess = allRows;
      }

      // Auto-map columns for raw text
      headers.forEach((h, index) => {
        const lower = h.toLowerCase();
        if (lower.includes('ten') || lower.includes('họ') || lower.includes('ho') || lower.includes('name')) {
          indexNameCol = index;
        } else if (lower.includes('sdt') || lower.includes('phone') || lower.includes('sđt') || lower.includes('tel')) {
          indexPhoneCol = index;
        } else if (lower.includes('email') || lower.includes('mail')) {
          indexEmailCol = index;
        }
      });

      // If no mapping matched by name, do simple index based assignment (0=Name, 1=Phone, 2=Email)
      if (indexNameCol === -1 && indexPhoneCol === -1 && indexEmailCol === -1) {
        if (headers.length >= 1) indexNameCol = 0;
        if (headers.length >= 2) indexPhoneCol = 1;
        if (headers.length >= 3) indexEmailCol = 2;
      }
    }

    countTotal = rowsToProcess.length;

    // Sets to track duplicates
    const seenEmails = new Set();
    const seenPhones = new Set();
    const seenFullRows = new Set();

    // Loop through all data rows
    const processedRows = [];

    rowsToProcess.forEach((row, rowIndex) => {
      const displayRowNo = rowIndex + 1;
      
      // 0. Check if row is completely empty
      const isRowEmpty = row.every(cell => String(cell).trim() === '');
      if (isRowEmpty) {
        if (ruleRemoveEmpty.checked) {
          countInvalid++;
          systemLogs.push({ type: 'error', text: `Dòng ${displayRowNo}: Đã loại bỏ vì dòng trống.` });
          return; // Skip empty row
        }
        processedRows.push(row); // Keep empty if not filtering
        return;
      }

      let rowHasChanged = false;
      let rowHasError = false;
      
      let cleanRow = [...row]; // Copy original cells

      // --- Clean Name ---
      if (indexNameCol !== -1 && indexNameCol < row.length) {
        let nameVal = String(row[indexNameCol]);
        let originalName = nameVal;
        
        if (nameVal.trim() !== "") {
          let tempName = nameVal;
          if (ruleNameTrim.checked) {
            tempName = tempName.replace(/\s+/g, ' ').trim();
          }
          if (ruleNameCapitalize.checked) {
            tempName = capitalizeName(tempName);
          }
          if (ruleNameNoAccents.checked) {
            tempName = removeAccents(tempName);
          }
          
          if (tempName !== originalName) {
            cleanRow[indexNameCol] = tempName;
            rowHasChanged = true;
            systemLogs.push({
              type: 'info',
              text: `Dòng ${displayRowNo}: Chuẩn hóa tên "${originalName}" -> "${tempName}"`
            });
          }
        }
      }

      // --- Clean Phone ---
      if (indexPhoneCol !== -1 && indexPhoneCol < row.length) {
        let phoneVal = String(row[indexPhoneCol]);
        if (phoneVal.trim() !== "") {
          const resPhone = processPhone(
            phoneVal, 
            rulePhoneConvertOldPrefix.checked, 
            phoneFormat.value, 
            rulePhoneDigitsOnly.checked, 
            rulePhoneValidate.checked
          );

          // Append sub logs
          resPhone.logs.forEach(logText => {
            systemLogs.push({ type: resPhone.isValid ? 'info' : 'error', text: `Dòng ${displayRowNo}: ${logText}` });
          });

          if (!resPhone.isValid && rulePhoneValidate.checked) {
            countInvalid++;
            rowHasError = true;
            return; // Filter out this row completely
          }

          if (resPhone.phone !== phoneVal) {
            cleanRow[indexPhoneCol] = resPhone.phone;
            rowHasChanged = true;
          }
        }
      }

      // --- Clean Email ---
      if (indexEmailCol !== -1 && indexEmailCol < row.length) {
        let emailVal = String(row[indexEmailCol]);
        if (emailVal.trim() !== "") {
          const resEmail = processEmail(
            emailVal,
            ruleEmailLowercase.checked,
            ruleEmailValidate.checked,
            ruleEmailFilterDisposable.checked
          );

          // Append sub logs
          resEmail.logs.forEach(logText => {
            systemLogs.push({ type: resEmail.isValid ? 'info' : 'error', text: `Dòng ${displayRowNo}: ${logText}` });
          });

          if (!resEmail.isValid && (ruleEmailValidate.checked || ruleEmailFilterDisposable.checked)) {
            countInvalid++;
            rowHasError = true;
            return; // Filter out this row completely
          }

          if (resEmail.email !== emailVal) {
            cleanRow[indexEmailCol] = resEmail.email;
            rowHasChanged = true;
          }
        }
      }

      // --- Check Deduplication ---
      if (ruleDeduplicate.checked) {
        let isDuplicate = false;
        let dupValue = '';

        const currentEmail = indexEmailCol !== -1 ? String(cleanRow[indexEmailCol]).trim().toLowerCase() : '';
        const currentPhone = indexPhoneCol !== -1 ? String(cleanRow[indexPhoneCol]).trim() : '';
        const fullRowString = cleanRow.join('|').toLowerCase();

        const criteria = dedupCriteria.value;

        if (criteria === 'email' && currentEmail !== '') {
          if (seenEmails.has(currentEmail)) {
            isDuplicate = true;
            dupValue = `Email "${currentEmail}"`;
          } else {
            seenEmails.add(currentEmail);
          }
        } else if (criteria === 'phone' && currentPhone !== '') {
          if (seenPhones.has(currentPhone)) {
            isDuplicate = true;
            dupValue = `SĐT "${currentPhone}"`;
          } else {
            seenPhones.add(currentPhone);
          }
        } else if (criteria === 'any') {
          let dupMsg = [];
          if (currentEmail !== '' && seenEmails.has(currentEmail)) {
            isDuplicate = true;
            dupMsg.push(`Email "${currentEmail}"`);
          }
          if (currentPhone !== '' && seenPhones.has(currentPhone)) {
            isDuplicate = true;
            dupMsg.push(`SĐT "${currentPhone}"`);
          }
          
          if (isDuplicate) {
            dupValue = dupMsg.join(' & ');
          } else {
            if (currentEmail !== '') seenEmails.add(currentEmail);
            if (currentPhone !== '') seenPhones.add(currentPhone);
          }
        } else if (criteria === 'all') {
          if (seenFullRows.has(fullRowString)) {
            isDuplicate = true;
            dupValue = "Toàn bộ dòng trùng khớp";
          } else {
            seenFullRows.add(fullRowString);
          }
        }

        if (isDuplicate) {
          countDups++;
          systemLogs.push({
            type: 'warning',
            text: `Dòng ${displayRowNo}: Đã loại bỏ trùng lặp (${dupValue}).`
          });
          return; // Skip duplicate row
        }
      }

      // Track statistics
      if (rowHasChanged) {
        countFixed++;
      } else {
        countValid++;
      }

      processedRows.push(cleanRow);
    });

    // Save outputs
    cleanedData = [headers, ...processedRows];

    // --- Render Statistics Dashboard ---
    statTotalRows.textContent = countTotal;
    statValidRows.textContent = processedRows.length - countFixed; // true clean inputs
    statFixedRows.textContent = countFixed;
    statInvalidRows.textContent = countInvalid;
    statDupsRemoved.textContent = countDups;

    // Percentage of clean data
    const totalProcessedOutputs = processedRows.length;
    const cleanPercentage = countTotal > 0 ? Math.round(((countTotal - countInvalid - countDups) / countTotal) * 100) : 0;
    
    chartPercentage.textContent = `${cleanPercentage}%`;
    pctClean.textContent = `${cleanPercentage}%`;
    pctDirty.textContent = `${100 - cleanPercentage}%`;

    // Radial Progress animation
    const circleDashOffset = 100 - cleanPercentage;
    chartCircleProgress.style.strokeDasharray = `${cleanPercentage}, 100`;

    // --- Render Detailed Log messages ---
    logsContainer.innerHTML = '';
    if (systemLogs.length === 0) {
      logsContainer.innerHTML = '<p class="empty-logs">Không phát hiện lỗi dữ liệu cần sửa hoặc lọc bỏ.</p>';
    } else {
      systemLogs.forEach(log => {
        const logEl = document.createElement('div');
        logEl.className = `log-item ${log.type}`;
        logEl.textContent = log.text;
        logsContainer.appendChild(logEl);
      });
    }

    // --- Render Table Preview ---
    previewTableBody.innerHTML = '';
    
    // Set headers
    const previewTable = document.getElementById('previewTable');
    const thead = previewTable.querySelector('thead tr');
    thead.innerHTML = '<th>STT</th>';
    
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      thead.appendChild(th);
    });

    // Populate preview rows (max 50)
    const previewRows = processedRows.slice(0, 50);
    if (previewRows.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = headers.length + 1;
      td.textContent = 'Không có dữ liệu sạch nào để hiển thị.';
      td.style.textAlign = 'center';
      td.style.padding = '30px';
      tr.appendChild(td);
      previewTableBody.appendChild(tr);
    } else {
      previewRows.forEach((row, idx) => {
        const tr = document.createElement('tr');
        
        // STT column
        const tdIdx = document.createElement('td');
        tdIdx.textContent = idx + 1;
        tr.appendChild(tdIdx);
        
        // Other columns
        headers.forEach((h, colIdx) => {
          const td = document.createElement('td');
          const originalRow = rowsToProcess[idx];
          
          let cleanVal = row[colIdx] !== undefined ? String(row[colIdx]) : '';
          let originalVal = (originalRow && originalRow[colIdx] !== undefined) ? String(originalRow[colIdx]) : '';
          
          if (cleanVal !== originalVal && (colIdx === indexNameCol || colIdx === indexPhoneCol || colIdx === indexEmailCol)) {
            td.innerHTML = `<span class="diff-highlight" title="Trước: ${originalVal}">${cleanVal}</span>`;
          } else {
            td.textContent = cleanVal;
          }
          tr.appendChild(td);
        });
        
        previewTableBody.appendChild(tr);
      });
    }

    // Slide open dashboard
    resultsDashboard.style.display = 'block';
    resultsDashboard.scrollIntoView({ behavior: 'smooth' });
  }

  // ==========================================================================
  // --- Exporters (CSV & Excel) ---
  // ==========================================================================
  
  // CSV Downloader
  btnExportCSV.addEventListener('click', () => {
    if (cleanedData.length === 0) return;
    
    const csvContent = Papa.unparse(cleanedData);
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for excel Vietnamese accent support
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    // Create clean file name
    let exportName = 'data_cleaned.csv';
    if (currentFileName) {
      const parts = currentFileName.split('.');
      parts.pop();
      exportName = parts.join('.') + '_cleaned.csv';
    }
    
    link.setAttribute("download", exportName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Excel (.xlsx) Downloader via SheetJS
  btnExportXLSX.addEventListener('click', () => {
    if (cleanedData.length === 0) return;

    try {
      // Create a worksheet from array of arrays
      const worksheet = XLSX.utils.aoa_to_sheet(cleanedData);
      
      // Create a workbook and append worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Cleaned");
      
      // Auto-fit column widths
      const colWidths = cleanedData[0].map((_, colIdx) => {
        let maxLen = 10;
        cleanedData.forEach(row => {
          const val = row[colIdx] !== undefined ? String(row[colIdx]) : '';
          if (val.length > maxLen) maxLen = val.length;
        });
        return { wch: maxLen + 2 };
      });
      worksheet['!cols'] = colWidths;

      // Write excel file
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
});
