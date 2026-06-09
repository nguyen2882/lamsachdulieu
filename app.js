/* ==========================================================================
   DATACLEANER PRO - MULTI-FUNCTIONAL GREEN EDITION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const tabLinks = document.querySelectorAll('.tab-link');
  const activeTaskTitle = document.getElementById('activeTaskTitle');
  const taskInstructions = document.getElementById('taskInstructions');
  const btnLoadDummy = document.getElementById('btnLoadDummy');
  
  // Config Panes
  const configPanes = document.querySelectorAll('.task-config-pane');
  const configEmail = document.getElementById('configEmail');
  const configPhone = document.getElementById('configPhone');
  const configCurrency = document.getElementById('configCurrency');
  const configDate = document.getElementById('configDate');
  
  // Checkboxes & Inputs
  const ruleEmailTelex = document.getElementById('ruleEmailTelex');
  const ruleEmailLowercase = document.getElementById('ruleEmailLowercase');
  const ruleEmailValidate = document.getElementById('ruleEmailValidate');
  
  const rulePhoneConvertOld = document.getElementById('rulePhoneConvertOld');
  const rulePhoneFormat = document.getElementById('rulePhoneFormat');
  const phoneFormat = document.getElementById('phoneFormat');
  const phoneFormatSelectContainer = document.getElementById('phoneFormatSelectContainer');
  
  const currencyInputFormat = document.getElementById('currencyInputFormat');
  const currencyOutputSymbol = document.getElementById('currencyOutputSymbol');
  
  const dateInputFormat = document.getElementById('dateInputFormat');
  const dateOutputFormat = document.getElementById('dateOutputFormat');
  
  const rawInputText = document.getElementById('rawInputText');
  const charCounter = document.getElementById('charCounter');
  
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const fileInfoBox = document.getElementById('fileInfoBox');
  const fileNameText = document.getElementById('fileNameText');
  const fileSizeText = document.getElementById('fileSizeText');
  const btnRemoveFile = document.getElementById('btnRemoveFile');
  
  const columnMappingSection = document.getElementById('columnMappingSection');
  const mapPhoneCol = document.getElementById('mapPhoneCol');
  const mapEmailCol = document.getElementById('mapEmailCol');
  const mapNameCol = document.getElementById('mapNameCol');
  const colMapSelects = document.querySelectorAll('.col-map-select');

  // Stats Widgets
  const statTitle1 = document.getElementById('statTitle1');
  const statTitle2 = document.getElementById('statTitle2');
  const statTitle3 = document.getElementById('statTitle3');
  const statTitle4 = document.getElementById('statTitle4');
  
  const statVal1 = document.getElementById('statVal1');
  const statVal2 = document.getElementById('statVal2');
  const statVal3 = document.getElementById('statVal3');
  const statVal4 = document.getElementById('statVal4');

  // Results & Table
  const searchInput = document.getElementById('searchInput');
  const btnCopyAll = document.getElementById('btnCopyAll');
  const btnExportTXT = document.getElementById('btnExportTXT');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const resultsTableBody = document.getElementById('resultsTableBody');

  // --- App State ---
  let activeTab = 'email'; // 'email', 'phone', 'currency', 'date'
  let loadedFileData = null; // CSV parsed raw rows
  let loadedFileHeaders = [];
  let currentFileName = '';
  
  let processedItemsList = []; // Cleaned rows currently computed
  let deletedItemIds = new Set(); // Row IDs excluded by user

  // Disposable email domains list
  const disposableEmailDomains = new Set([
    'yopmail.com', 'mailinator.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
    'getairmail.com', 'guerrillamail.com', 'sharklasers.com', 'dispostable.com', 'boun.cr',
    'trashmail.com', 'dropmail.me'
  ]);

  // Old VN phone prefix mapping (11 digits -> 10 digits)
  const vnPhonePrefixMap = {
    '0162': '032', '0163': '033', '0164': '034', '0165': '035', 
    '0166': '036', '0167': '037', '0168': '038', '0169': '039',
    '0120': '070', '0121': '079', '0122': '077', '0126': '076', '0128': '078',
    '0123': '083', '0124': '084', '0125': '085', '0127': '081', '0129': '082',
    '0186': '056', '0188': '058', '0199': '059'
  };

  // Dummy data set for each tab
  const dummyDatasets = {
    email: `Chào bạn, hãy liên hệ tôi qua email nguYenvAna@gmâil.cơm hoặc email phụ nguyenvana@gmail.com (email này trùng lặp).
Ngoài ra còn có:
- admin@yàhoo.com.vn
- support@outlook.cơm
- test_email_invalid@gmail (đây là email thiếu đuôi miền)
- test_burner@yopmail.com (đây là hòm thư ảo yopmail)
- marketing@gmâi.com`,
    phone: `0904020011 (Hợp lệ gốc)
090.402.0011 (Dấu chấm)
090 402 0011 (Dấu cách)
(+84)904 020 011 (Có mã quốc gia)
09040200111 (Lỗi: thừa số, có 11 chữ số)
090402001 (Lỗi: thiếu số, có 9 chữ số)
0123.456.7890 (Đầu số di động cũ Vinaphone)
0168.999.8888 (Đầu số di động cũ Viettel)`,
    currency: `1.500.000,50đ (Định dạng Việt Nam)
50.000 VND (Số tròn có chữ VND)
$1,250,500.75 (Định dạng Quốc tế USD)
1500000 (Chỉ có số thô)
350k (Viết tắt hàng nghìn bằng chữ k)
2.500đ
invalid_value_123 (Dòng lỗi không trích xuất được tiền)`,
    date: `02/03/2023 (Ngày 2 tháng 3 hay Ngày 3 tháng 2 tùy tab chọn)
31-12-2022 (Định dạng dấu gạch ngang)
2023-06-15 (Chuẩn ISO)
12/31/2021 (Tháng trước ngày sau)
31/02/2023 (Lỗi: ngày không tồn tại)
45/12/2022 (Lỗi: ngày sai)`
  };

  const tabInstructionsText = {
    email: 'Hướng dẫn: Trích xuất toàn bộ các địa chỉ email có mặt trong văn bản thô, làm sạch định dạng, sửa các lỗi Telex và xuất danh sách duy nhất không trùng lặp.',
    phone: 'Hướng dẫn: Tự động phát hiện các chuỗi số điện thoại di động, loại bỏ ký tự lạ, chuyển đầu số 11 số sang 10 số di động Việt Nam mới, và phân loại SĐT hợp lệ (màu xanh lá) / không hợp lệ (màu đỏ).',
    currency: 'Hướng dẫn: Trích xuất các số lượng tiền tệ có trong văn bản, quy đổi viết tắt (chữ k), định dạng dấu chấm/phẩy ngăn cách hàng nghìn/thập phân và chuẩn hóa về đồng tiền đích đầu ra.',
    date: 'Hướng dẫn: Trích xuất các ngày tháng có trong văn bản, kiểm tra tính hợp lệ của ngày (bao gồm cả năm nhuận, ngày trong tháng), định dạng thống nhất về chuẩn ISO YYYY-MM-DD hoặc Việt Nam DD/MM/YYYY.'
  };

  const tabTitles = {
    email: 'Tác vụ: Trích xuất Email',
    phone: 'Tác vụ: Chuẩn hóa Số điện thoại',
    currency: 'Tác vụ: Chuẩn hóa Tiền tệ',
    date: 'Tác vụ: Chuẩn hóa Ngày tháng'
  };

  // ==========================================================================
  // --- Tab Switcher Logic ---
  // ==========================================================================
  
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Set active class
      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const targetTask = link.getAttribute('data-task');
      activeTab = targetTask;
      
      // Update UI texts
      activeTaskTitle.textContent = tabTitles[targetTask];
      taskInstructions.textContent = tabInstructionsText[targetTask];
      
      // Update config panes
      configPanes.forEach(p => p.classList.remove('active'));
      if (targetTask === 'email') configEmail.classList.add('active');
      if (targetTask === 'phone') configPhone.classList.add('active');
      if (targetTask === 'currency') configCurrency.classList.add('active');
      if (targetTask === 'date') configDate.classList.add('active');
      
      // Reset input & file state
      resetFileStateSilently();
      rawInputText.value = '';
      updateCharCount();
      deletedItemIds = new Set();
      searchInput.value = '';
      
      // Update stats labels
      updateStatsLabels();
      
      // Process empty data
      processData();
    });
  });

  function updateStatsLabels() {
    if (activeTab === 'email') {
      statTitle1.textContent = 'TỔNG TÌM THẤY';
      statTitle2.textContent = 'HỢP LỆ';
      statTitle3.textContent = 'ĐÃ SỬA LỖI';
      statTitle4.textContent = 'TRÙNG LẶP / LỖI';
    } else if (activeTab === 'phone') {
      statTitle1.textContent = 'TỔNG DÒNG';
      statTitle2.textContent = 'HỢP LỆ';
      statTitle3.textContent = 'ĐÃ SỬA LỖI';
      statTitle4.textContent = 'KHÔNG HỢP LỆ';
    } else if (activeTab === 'currency') {
      statTitle1.textContent = 'TỔNG TÌM THẤY';
      statTitle2.textContent = 'HỢP LỆ';
      statTitle3.textContent = 'ĐÃ SỬA LỖI';
      statTitle4.textContent = 'KHÔNG PHÂN TÍCH ĐƯỢC';
    } else if (activeTab === 'date') {
      statTitle1.textContent = 'TỔNG TÌM THẤY';
      statTitle2.textContent = 'HỢP LỆ';
      statTitle3.textContent = 'ĐÃ FORMAT';
      statTitle4.textContent = 'NGÀY KHÔNG TỒN TẠI';
    }
  }

  // Bind raw text inputs
  rawInputText.addEventListener('input', () => {
    updateCharCount();
    if (loadedFileData) resetFileStateSilently();
    processData();
  });

  searchInput.addEventListener('input', () => {
    renderTable();
  });

  rulePhoneFormat.addEventListener('change', () => {
    phoneFormatSelectContainer.style.display = rulePhoneFormat.checked ? 'flex' : 'none';
    processData();
  });

  // Watch other checkboxes for live updates
  const reactiveControls = [
    ruleEmailTelex, ruleEmailLowercase, ruleEmailValidate,
    rulePhoneConvertOld, rulePhoneFormat, phoneFormat,
    currencyInputFormat, currencyOutputSymbol,
    dateInputFormat, dateOutputFormat
  ];
  reactiveControls.forEach(ctrl => {
    ctrl.addEventListener('change', () => processData());
  });

  // Load dummy data click
  btnLoadDummy.addEventListener('click', () => {
    rawInputText.value = dummyDatasets[activeTab];
    updateCharCount();
    if (loadedFileData) resetFileStateSilently();
    processData();
  });

  function updateCharCount() {
    charCounter.textContent = `${rawInputText.value.length} ký tự`;
  }

  // ==========================================================================
  // --- File Drag & Drop ---
  // ==========================================================================
  
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleUploadedFile(file);
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
    if (file) handleUploadedFile(file);
  });

  btnRemoveFile.addEventListener('click', () => {
    resetFileState();
    processData();
  });

  const resetFileStateSilently = () => {
    loadedFileData = null;
    loadedFileHeaders = [];
    currentFileName = '';
    fileInput.value = '';
    fileInfoBox.style.display = 'none';
    dropzone.style.display = 'block';
    columnMappingSection.style.display = 'none';
  };

  const resetFileState = () => {
    resetFileStateSilently();
    rawInputText.value = '';
    updateCharCount();
  };

  const handleUploadedFile = (file) => {
    currentFileName = file.name;
    fileNameText.textContent = file.name;
    fileSizeText.textContent = parseFloat((file.size / 1024).toFixed(1)) + ' KB';
    
    dropzone.style.display = 'none';
    fileInfoBox.style.display = 'flex';
    
    rawInputText.value = '';
    updateCharCount();

    const extension = file.name.split('.').pop().toLowerCase();
    
    if (extension === 'csv') {
      parseCSV(file);
    } else if (extension === 'txt' || extension === 'log') {
      parseTXT(file);
    } else {
      alert('Chỉ hỗ trợ tải tệp tin .csv, .txt hoặc .log!');
      resetFileState();
    }
  };

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

  function parseTXT(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const lines = e.target.result.split(/\r?\n/);
      const rows = lines.map(line => [line.trim()]);
      storeParsedData(rows);
    };
    reader.readAsText(file);
  }

  function storeParsedData(rows) {
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
    
    // Setup mapping selects
    colMapSelects.forEach(select => {
      select.innerHTML = '<option value="">-- Bỏ qua --</option>';
      loadedFileHeaders.forEach((h, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `${h} (Cột ${idx + 1})`;
        select.appendChild(opt);
      });
    });
    
    // Auto map
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
    
    colMapSelects.forEach(select => {
      select.onchange = () => processData();
    });
    
    columnMappingSection.style.display = 'block';
    processData();
  }

  // ==========================================================================
  // --- Cleaning Core Algorithms ---
  // ==========================================================================
  
  // 1. Email cleaning
  function fixEmailTelexAndAccents(email) {
    let cleaned = email.trim();
    const atIdx = cleaned.lastIndexOf('@');
    if (atIdx === -1) return cleaned;
    
    let local = cleaned.substring(0, atIdx);
    let domain = cleaned.substring(atIdx + 1).toLowerCase();
    
    // Unicode normalization to strip accents
    domain = domain.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, 'd');
    
    // Fix TLDs
    domain = domain.replace(/\.cơm$|\.coơm$|\.cỏm$|\.cốm$|\.con$/g, '.com');
    domain = domain.replace(/\.vớn$|\.vỏn$/g, '.vn');
    
    // Fix hostnames
    domain = domain.replace(/^gmâil|^gmaỉl|^gmaill|^gamil|^gmali|^gmai$/g, 'gmail');
    domain = domain.replace(/^yàhoo|^yahou|^yaho$/g, 'yahoo');
    domain = domain.replace(/^outloọk|^outlok|^outluc$/g, 'outlook');
    domain = domain.replace(/^hotmaill|^hotmai$/g, 'hotmail');
    
    return local + '@' + domain;
  }

  function cleanEmail(val) {
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
      logs.push("Sửa lỗi gõ Telex/chữ thường");
    }
    
    if (ruleEmailValidate.checked) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleaned)) {
        return { value: cleaned, original, logs: ["Email sai định dạng"], category: 'error' };
      }
    }
    
    const category = (cleaned !== original) ? 'fixed' : 'valid';
    return { value: cleaned, original, logs, category };
  }

  // 2. Phone cleaning
  function cleanPhone(val) {
    let raw = String(val).trim();
    let original = raw;
    let logs = [];
    
    // Digits only
    const hasPlus = raw.startsWith('+');
    let cleaned = raw.replace(/[^\d]/g, '');
    if (hasPlus) cleaned = '+' + cleaned;
    
    if (cleaned !== original) {
      logs.push("Xóa khoảng trắng/ký tự đặc biệt");
    }
    
    // Convert standard to 0
    let temp = cleaned;
    let startsPlus = temp.startsWith('+');
    let numberPart = temp.replace(/^\+/, '');
    let std0 = '';
    
    if (startsPlus && numberPart.startsWith('84')) {
      std0 = '0' + numberPart.slice(2);
    } else if (numberPart.startsWith('84') && numberPart.length > 9) {
      std0 = '0' + numberPart.slice(2);
    } else if (numberPart.startsWith('0')) {
      std0 = numberPart;
    } else if (numberPart.length === 9) {
      std0 = '0' + numberPart;
      logs.push("Thêm số 0 vào trước");
    } else {
      std0 = temp;
    }
    
    // Convert old prefix
    let converted = std0;
    if (rulePhoneConvertOld.checked && std0.startsWith('0') && std0.length === 11) {
      const prefix4 = std0.substring(0, 4);
      if (vnPhonePrefixMap[prefix4]) {
        converted = vnPhonePrefixMap[prefix4] + std0.substring(4);
        logs.push("Chuyển đổi đầu số di động VN cũ sang mới");
      }
    }
    
    // Format output
    let formatted = converted;
    if (rulePhoneFormat.checked && converted.startsWith('0') && converted.length === 10) {
      const fmt = phoneFormat.value;
      if (fmt === 'prefix_84') {
        formatted = '84' + converted.slice(1);
      } else if (fmt === 'prefix_plus84') {
        formatted = '+84' + converted.slice(1);
      }
    }
    
    // Validate
    let countDigits = converted.replace(/[^\d]/g, '').length;
    let isVnMobile = /^0[35789]\d{8}$/.test(converted);
    
    if (converted.length > 10) {
      return { value: formatted, original, logs: [`Thừa số (có ${countDigits} số)`], category: 'error' };
    } else if (converted.length < 10) {
      return { value: formatted, original, logs: [`Thiếu số (có ${countDigits} số)`], category: 'error' };
    } else if (!isVnMobile) {
      return { value: formatted, original, logs: [`Sai đầu số di động VN (có 10 số)`], category: 'error' };
    }
    
    const category = (formatted !== original || logs.length > 0) ? 'fixed' : 'valid';
    return { value: formatted, original, logs, category };
  }

  // 3. Currency cleaning
  function cleanCurrency(val) {
    let raw = String(val).trim();
    let original = raw;
    let logs = [];
    
    // Detect "k" abbreviation (e.g. 350k -> 350000)
    let hasK = false;
    let cleanStr = raw.toLowerCase().replace(/\s+/g, '');
    if (cleanStr.endsWith('k') && /^\d+/.test(cleanStr)) {
      hasK = true;
      cleanStr = cleanStr.substring(0, cleanStr.length - 1);
    }
    
    // Parse based on comma/dot thousands/decimals config
    let numericVal = NaN;
    const inputFmt = currencyInputFormat.value;
    
    if (inputFmt === 'vn') {
      // Thousands separator: `.`, Decimal separator: `,`
      // Clean all dots, change comma to dot
      let temp = cleanStr.replace(/\./g, '').replace(/,/g, '.');
      // Extract digits and decimal point
      let numberPart = temp.replace(/[^\d.]/g, '');
      numericVal = parseFloat(numberPart);
    } else {
      // Thousands separator: `,`, Decimal separator: `.`
      // Clean commas
      let temp = cleanStr.replace(/,/g, '');
      let numberPart = temp.replace(/[^\d.]/g, '');
      numericVal = parseFloat(numberPart);
    }
    
    if (isNaN(numericVal)) {
      return { value: original, original, logs: ["Không thể phân tích giá trị số"], category: 'error' };
    }
    
    if (hasK) {
      numericVal = numericVal * 1000;
      logs.push("Quy đổi viết tắt 'k' nhân 1000");
    }
    
    // Format output currency symbol
    const outSymbol = currencyOutputSymbol.value;
    let formatted = '';
    
    if (outSymbol === 'VND') {
      formatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericVal);
    } else if (outSymbol === 'USD') {
      formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericVal);
    } else if (outSymbol === 'EUR') {
      formatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numericVal);
    } else {
      // keep
      // Try to detect symbol in original: $ or € or đ/VND
      let lowerOrig = original.toLowerCase();
      if (lowerOrig.includes('$') || lowerOrig.includes('usd')) {
        formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericVal);
      } else if (lowerOrig.includes('€') || lowerOrig.includes('eur')) {
        formatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numericVal);
      } else {
        formatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericVal);
      }
    }
    
    logs.push("Chuẩn hóa định dạng tiền tệ");
    
    const category = (formatted !== original) ? 'fixed' : 'valid';
    return { value: formatted, original, logs, category };
  }

  // 4. Date cleaning
  function isValidDate(d, m, y) {
    const dateObj = new Date(y, m - 1, d);
    return dateObj.getFullYear() === y && dateObj.getMonth() === m - 1 && dateObj.getDate() === d;
  }

  function cleanDate(val) {
    let raw = String(val).trim();
    let original = raw;
    let logs = [];
    
    // Standardize separators to `/`
    let cleanStr = raw.replace(/[-.]/g, '/').replace(/\s+/g, '');
    
    // Try to detect ISO date format first YYYY-MM-DD
    let parts = cleanStr.split('/');
    let d = NaN, m = NaN, y = NaN;
    
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY/MM/DD
        y = parseInt(parts[0]);
        m = parseInt(parts[1]);
        d = parseInt(parts[2]);
      } else {
        // DD/MM/YYYY or MM/DD/YYYY
        const format = dateInputFormat.value;
        if (format === 'dmy') {
          d = parseInt(parts[0]);
          m = parseInt(parts[1]);
          y = parseInt(parts[2]);
        } else {
          m = parseInt(parts[0]);
          d = parseInt(parts[1]);
          y = parseInt(parts[2]);
        }
      }
    } else {
      return { value: original, original, logs: ["Không đúng định dạng ngày (thiếu/thừa phần)"], category: 'error' };
    }
    
    // Fix 2-digit years
    if (y < 100) {
      y = y + 2000;
      logs.push("Sửa năm 2 chữ số");
    }
    
    // Check if parts are valid numbers
    if (isNaN(d) || isNaN(m) || isNaN(y)) {
      return { value: original, original, logs: ["Giá trị ngày tháng không phải là số"], category: 'error' };
    }
    
    // Leap year / days limit validation
    if (!isValidDate(d, m, y)) {
      return { value: original, original, logs: ["Ngày không tồn tại (Ví dụ: 31/02 hoặc sai tháng)"], category: 'error' };
    }
    
    // Format Output
    const outFmt = dateOutputFormat.value;
    let formatted = '';
    
    const pad = (n) => String(n).padStart(2, '0');
    
    if (outFmt === 'yyyy-mm-dd') {
      formatted = `${y}-${pad(m)}-${pad(d)}`;
    } else {
      formatted = `${pad(d)}/${pad(m)}/${y}`;
    }
    
    logs.push("Chuẩn hóa định dạng ngày");
    
    const category = (formatted !== original) ? 'fixed' : 'valid';
    return { value: formatted, original, logs, category };
  }

  // ==========================================================================
  // --- Data Processing Pipeline ---
  // ==========================================================================
  
  function processData() {
    let rawRows = [];
    let isFileMode = (loadedFileData !== null);
    
    let indexPhone = mapPhoneCol.value !== '' ? parseInt(mapPhoneCol.value) : -1;
    let indexEmail = mapEmailCol.value !== '' ? parseInt(mapEmailCol.value) : -1;
    
    // 1. Load data
    if (isFileMode) {
      rawRows = loadedFileData.map(r => [...r]);
    } else {
      const lines = rawInputText.value.split(/\r?\n/);
      rawRows = lines.map(line => [line.trim()]);
    }
    
    let totalItems = 0;
    let countValid = 0;
    let countFixed = 0;
    let countError = 0;
    let countDup = 0;
    
    let seen = new Set();
    processedItemsList = [];
    
    rawRows.forEach((row, idx) => {
      const itemId = `row-${idx}`;
      
      // If deleted by user, skip
      if (deletedItemIds.has(itemId)) return;
      
      // Skip empty row
      const isRowEmpty = row.every(cell => String(cell).trim() === '');
      if (isRowEmpty) return;
      
      totalItems++;
      
      let cleanRow = [...row];
      let res = { value: '', original: '', logs: [], category: 'valid' };
      
      // 2. Select filter based on active tab
      if (activeTab === 'email') {
        // Find text or col
        let cellVal = isFileMode && indexEmail !== -1 ? String(row[indexEmail]) : String(row[0]);
        
        // Scan for email extraction
        if (activeTab === 'email' && !isFileMode) {
          // Extract emails using regex
          const emailsFound = cellVal.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
          if (emailsFound) {
            emailsFound.forEach(email => {
              let cleanRes = cleanEmail(email);
              addProcessedItem(cleanRes, idx, cleanRow);
            });
            return; // processed internally
          } else {
            res = { value: cellVal, original: cellVal, logs: ["Không tìm thấy địa chỉ email"], category: 'error' };
          }
        } else {
          // File mode mapping
          res = cleanEmail(cellVal);
          cleanRow[indexEmail] = res.value;
        }
      } else if (activeTab === 'phone') {
        let cellVal = isFileMode && indexPhone !== -1 ? String(row[indexPhone]) : String(row[0]);
        res = cleanPhone(cellVal);
        if (isFileMode && indexPhone !== -1) cleanRow[indexPhone] = res.value;
      } else if (activeTab === 'currency') {
        let cellVal = String(row[0]); // Simple raw parser for money
        res = cleanCurrency(cellVal);
      } else if (activeTab === 'date') {
        let cellVal = String(row[0]);
        res = cleanDate(cellVal);
      }
      
      addProcessedItem(res, idx, cleanRow);
    });

    function addProcessedItem(res, idx, cleanRow) {
      // Deduplicate for Emails tab if checked
      if (activeTab === 'email' && res.category !== 'error') {
        const emailLower = res.value.toLowerCase();
        if (seen.has(emailLower)) {
          countDup++;
          return; // Skip duplicate email
        }
        seen.add(emailLower);
      }
      
      // Increment stats
      if (res.category === 'error') {
        countError++;
      } else if (res.category === 'fixed') {
        countFixed++;
      } else if (res.category === 'valid') {
        countValid++;
      }
      
      processedItemsList.push({
        id: `row-${idx}-${processedItemsList.length}`,
        cleanRow,
        cleanValDisplay: res.value,
        originalValDisplay: res.original,
        logs: res.logs,
        category: res.category
      });
    }
    
    // Update stats widgets
    statVal1.textContent = totalItems;
    statVal2.textContent = countValid;
    statVal3.textContent = countFixed;
    
    if (activeTab === 'email') {
      statVal4.textContent = countDup + countError;
    } else {
      statVal4.textContent = countError;
    }
    
    renderTable();
  }

  // ==========================================================================
  // --- Render Table & Filters ---
  // ==========================================================================
  
  function renderTable() {
    resultsTableBody.innerHTML = '';
    
    const query = searchInput.value.trim().toLowerCase();
    
    // Apply search query
    const visibleList = processedItemsList.filter(item => {
      if (query !== '') {
        const matchesClean = item.cleanValDisplay.toLowerCase().includes(query);
        const matchesOriginal = item.originalValDisplay.toLowerCase().includes(query);
        const matchesLogs = item.logs.join(' ').toLowerCase().includes(query);
        return matchesClean || matchesOriginal || matchesLogs;
      }
      return true;
    });
    
    if (visibleList.length === 0) {
      resultsTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-table-state">
            ${processedItemsList.length === 0 ? 'Nạp dữ liệu mẫu hoặc dán văn bản để xem kết quả.' : 'Không tìm thấy kết quả phù hợp.'}
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
      
      // 2. Value cleaned vs original (color-coded for validity)
      const tdVal = document.createElement('td');
      const isErr = (item.category === 'error');
      tdVal.innerHTML = `
        <span class="col-clean-val ${isErr ? 'red' : 'green'}">${item.cleanValDisplay || '-'}</span>
        <span class="col-orig-val">${item.originalValDisplay || '-'}</span>
      `;
      tr.appendChild(tdVal);
      
      // 3. Status Badge
      const tdStatus = document.createElement('td');
      tdStatus.style.textAlign = 'center';
      if (item.category === 'error') {
        tdStatus.innerHTML = `<span class="badge badge-error">LỖI / SAI</span>`;
      } else if (item.category === 'fixed') {
        tdStatus.innerHTML = `<span class="badge badge-fixed">ĐÃ SỬA</span>`;
      } else {
        tdStatus.innerHTML = `<span class="badge badge-success">HỢP LỆ</span>`;
      }
      tr.appendChild(tdStatus);
      
      // 4. Logs
      const tdLogs = document.createElement('td');
      tdLogs.className = 'col-log-desc';
      if (item.category === 'error') {
        tdLogs.textContent = item.logs.join(', ');
        tdLogs.style.color = '#ef4444';
      } else if (item.category === 'fixed') {
        tdLogs.textContent = item.logs.join(', ');
        tdLogs.style.color = '#f59e0b';
      } else {
        tdLogs.textContent = 'Hợp lệ';
        tdLogs.style.color = '#64748b';
      }
      tr.appendChild(tdLogs);
      
      // 5. Action buttons
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
      
      tdActions.querySelector('.btn-copy').onclick = () => {
        navigator.clipboard.writeText(item.cleanValDisplay);
        showTemporaryFeedback(tdActions.querySelector('.btn-copy'), 'Copied');
      };
      
      tdActions.querySelector('.btn-delete').onclick = () => {
        deletedItemIds.add(item.id);
        processData();
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
  // --- Export Actions (Copy All & File Exporters) ---
  // ==========================================================================
  
  // Copy All cleaned items
  btnCopyAll.addEventListener('click', () => {
    const cleanItems = processedItemsList
      .filter(item => item.category === 'valid' || item.category === 'fixed')
      .map(item => item.cleanValDisplay);
      
    if (cleanItems.length === 0) {
      alert('Không có dữ liệu hợp lệ để sao chép!');
      return;
    }
    
    navigator.clipboard.writeText(cleanItems.join('\n')).then(() => {
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
      alert('Không có dữ liệu hợp lệ!');
      return;
    }
    downloadBlob(cleanItems.join('\n'), 'text/plain', `data_${activeTab}_cleaned.txt`);
  });

  // Export CSV
  btnExportCSV.addEventListener('click', () => {
    const cleanRows = processedItemsList
      .filter(item => item.category === 'valid' || item.category === 'fixed')
      .map(item => item.cleanRow);
      
    if (cleanRows.length === 0) {
      alert('Không có dữ liệu hợp lệ!');
      return;
    }
    
    let csvData = [];
    if (loadedFileData) {
      csvData = [loadedFileHeaders, ...cleanRows];
    } else {
      csvData = [[`Dữ liệu sạch (${activeTab})`], ...cleanRows];
    }
    
    const content = Papa.unparse(csvData);
    downloadBlob("\uFEFF" + content, 'text/csv;charset=utf-8;', `data_${activeTab}_cleaned.csv`);
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

  // --- Initial Launch Setup ---
  updateStatsLabels();
  processData();
});
