  function hideAll() {
  homePage.style.display = "none";
  wattagePage.style.display = "none";
  cellPage.style.display = "none";
}

function goHome() {
  hideAll();
  homePage.style.display = "block";
}

function openWattage() {
  hideAll();
  wattagePage.style.display = "block";
}

function openCell() {
  hideAll();
  cellPage.style.display = "block";
}

// ===== WATTAGE CALCULATOR =====
function calculate() {
  let total = 0;

  document.querySelectorAll(".watt").forEach((w, i) => {
    total += Number(w.value) * Number(document.querySelectorAll(".qty")[i].value);
  });

  totalWatt.innerText = total;

  let v = Number(voltage.value);
  let ah = Number(capacity.value);
  let wh = v * ah;

  batteryWh.innerText = wh;
  batteryUsed.innerText = v + "V " + ah + "Ah";

  backupTime.innerText = total ? ((wh * 0.85) / total).toFixed(2) : 0;
}


// ===== EXPORT TO EXCEL =====
function exportWattageExcel() {

  let data = [["Appliance", "Watt", "Quantity"]];

  document.querySelectorAll("#applianceTable tr").forEach((row, i) => {
    if (i === 0) return;

    let name = row.cells[0].innerText;
    let watt = row.querySelector(".watt").value;
    let qty  = row.querySelector(".qty").value;

    data.push([name, watt, qty]);
  });

  data.push([]);
  data.push(["Voltage", voltage.value]);
  data.push(["Ah", capacity.value]);
  data.push(["Total Load (W)", totalWatt.innerText]);
  data.push(["Battery Energy (Wh)", batteryWh.innerText]);
  data.push(["Backup Time (Hrs)", backupTime.innerText]);

  let ws = XLSX.utils.aoa_to_sheet(data);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Wattage");

  XLSX.writeFile(wb, "Wattage_Calculator.xlsx");
}


// ===== IMPORT FROM EXCEL =====
function importWattageExcel() {

  let file = document.getElementById("importFile").files[0];
  if (!file) return;

  let reader = new FileReader();

  reader.onload = function (e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, { type: "array" });
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
    let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach((r, i) => {
      if (i === 0) return;

      let row = document.querySelectorAll("#applianceTable tr")[i];
      if (!row) return;

      if (r[1] !== undefined) row.querySelector(".watt").value = r[1];
      if (r[2] !== undefined) row.querySelector(".qty").value  = r[2];
    });

    calculate();
  };

  reader.readAsArrayBuffer(file);
}
const bhkData = {
  "1bhk": [
    ["LED Bulb", 5, 2],
    ["LED Tube", 20, 1],
    ["Fan", 75, 1],
    ["TV", 120, 1],
    ["WiFi Router", 10, 1],
    ["Fridge", 250, 1],
    ["Laptop", 150, 1],
    ["Mobile Charger", 10, 1]
  ],

  "2bhk": [
    ["LED Bulb", 5, 2,],
    ["LED Tube", 20, 1],
    ["Fan", 75, 2],
    ["TV", 120, 1],
    ["WiFi Router", 10, 1],
    ["Fridge", 250, 1],
    ["Laptop", 150, 1],
    ["Mobile Charger", 10, 2]
  ],

  "3bhk": [
    ["LED Bulb", 5, 3],
    ["LED Tube", 20, 2],
    ["Fan", 75, 3],
    ["TV", 120, 1],
    ["WiFi Router", 10, 1],
    ["Fridge", 250, 1],
    ["Laptop", 150, 2],
    ["Mobile Charger", 10, 3]
  ]
};


// ===== LOAD BHK FUNCTION =====
function loadBHK(type) {

  const table = document.getElementById("applianceTable");

  // Remove old rows (keep header)
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Add new rows
  bhkData[type].forEach(item => {

    let row = table.insertRow();

    row.insertCell(0).innerText = item[0];

    row.insertCell(1).innerHTML =
      `<input class="watt" value="${item[1]}">`;

    row.insertCell(2).innerHTML =
      `<input class="qty" value="${item[2]}">`;
  });

  // Auto calculate
  calculate();
}


// ===== CELL CALCULATOR =====
function calculateCells() {
  let cv = cellVoltage.value;
  let ca = cellAh.value;
  let pv = packVoltage.value;
  let pa = packAh.value;

  if (!cv || !ca || !pv || !pa) return;

  let s = Math.round(pv / cv);
  let p = Math.ceil(pa / ca);

  seriesCount.innerText = s + "S";
  parallelCount.innerText = p + "P";
  totalCells.innerText = s * p;
}

document.addEventListener("input", calculateCells);
function calculateCells() {

  const cellV = Number(document.getElementById("cellVoltage").value);
  const cellAh = Number(document.getElementById("cellAh").value);

  let grandTotal = 0;

  document.querySelectorAll(".pack").forEach(pack => {

    const pv = Number(pack.querySelector(".packV").value);
    const pah = Number(pack.querySelector(".packAh").value);

    const sEl = pack.querySelector(".s");
    const pEl = pack.querySelector(".p");
    const tEl = pack.querySelector(".t");

    if (!cellV || !cellAh || !pv || !pah) {
      sEl.innerText = "-";
      pEl.innerText = "-";
      tEl.innerText = "-";
      return;
    }

    const S = Math.round(pv / cellV);
    const P = Math.ceil(pah / cellAh);
    const total = S * P;

    sEl.innerText = S;
    pEl.innerText = P;
    tEl.innerText = total;

    grandTotal += total;
  });

  document.getElementById("grandTotal").innerText = grandTotal;
}

function goHome() {
  window.location.href = "index.html";
}

function calculateCells() {
  const cellVoltage = parseFloat(document.getElementById("cellVoltage").value);
  const cellAh = parseFloat(document.getElementById("cellAh").value);
  const packVoltage = parseFloat(document.getElementById("packVoltage").value);
  const packAh = parseFloat(document.getElementById("packAh").value);

  if (
    isNaN(cellVoltage) ||
    isNaN(cellAh) ||
    isNaN(packVoltage) ||
    isNaN(packAh)
  ) {
    alert("Enter all values");
    return;
  }

  const series = Math.round(packVoltage / cellVoltage);
  const parallel = Math.round(packAh / cellAh);

  document.getElementById("seriesCount").innerText = series;
  document.getElementById("parallelCount").innerText = parallel;
  document.getElementById("totalCells").innerText = series * parallel;
}
function calculateCalc(calcId){
  const calc = document.getElementById(calcId);
  const cellV = parseFloat(calc.querySelector(".cellV").value);
  const cellAh = parseFloat(calc.querySelector(".cellAh").value);
  const packV = parseFloat(calc.querySelector(".packV").value);
  const packAh = parseFloat(calc.querySelector(".packAh").value);

  if (!cellV || !cellAh || !packV || !packAh) {
    alert("Enter all values for " + calcId);
    return;
  }

  const S = Math.round(packV / cellV);
  const P = Math.ceil(packAh / cellAh);
  const total = S * P;

  calc.querySelector(".s").innerText = S + "S";
  calc.querySelector(".p").innerText = P + "P";
  calc.querySelector(".t").innerText = total;

  // Update grand total
  let grand = 0;
  document.querySelectorAll(".calculator").forEach(c => {
    const t = parseInt(c.querySelector(".t").innerText) || 0;
    grand += t;
  });
  document.getElementById("grandTotal").innerText = grand;
}
function exportExcel() {
  let data = [
    ["Calculator", "Cell Voltage", "Cell Ah", "Pack Voltage", "Pack Ah", "Series", "Parallel", "Total Cells"]
  ];

  document.querySelectorAll(".calculator").forEach((calc, index) => {
    data.push([
      "Calc " + (index + 1),
      calc.querySelector(".cellV").value,
      calc.querySelector(".cellAh").value,
      calc.querySelector(".packV").value,
      calc.querySelector(".packAh").value,
      calc.querySelector(".s").innerText,
      calc.querySelector(".p").innerText,
      calc.querySelector(".t").innerText
    ]);
  });

  data.push([]);
  data.push(["GRAND TOTAL", "", "", "", "", "", "", document.getElementById("grandTotal").innerText]);

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cell Calculators");

  XLSX.writeFile(wb, "Cell_Calculations.xlsx");
}

function importExcel() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    document.querySelectorAll(".calculator").forEach((calc, i) => {
      const row = rows[i + 1];
      if (!row) return;

      calc.querySelector(".cellV").value = row[1];
      calc.querySelector(".cellAh").value = row[2];
      calc.querySelector(".packV").value = row[3];
      calc.querySelector(".packAh").value = row[4];

      calculateCalc(calc.id); // recalc automatically
    });
  };
  reader.readAsBinaryString(file);
}
function calculateBMSCharger() {

  const volt = Number(document.getElementById("batteryVolt").value);
  const ah   = Number(document.getElementById("batteryAh").value);
  const cell = document.getElementById("cellType").value;

  /* ---------- BMS LOGIC ---------- */
  let bmsCurrent = "";

  if (ah <= 30)       bmsCurrent = "40A BMS";
  else if (ah <= 45)  bmsCurrent = "60A BMS";
  else if (ah <= 60)  bmsCurrent = "60A BMS";
  else if (ah <= 80)  bmsCurrent = "80A BMS";
  else if (ah <= 100) bmsCurrent = "100A BMS";
  else if (ah <= 150) bmsCurrent = "150A BMS";
  else                bmsCurrent = "180A / 200A BMS";

  let bmsVoltage = "";
  if (volt == 48)      bmsVoltage = "48V BMS";
  else if (volt == 60) bmsVoltage = "60V BMS";
  else if (volt == 72) bmsVoltage = "72V BMS";
  else                 bmsVoltage = "EV Voltage BMS";

  /* 🔥 FORCE DISPLAY BMS */
  document.getElementById("bmsResult").innerText =
    bmsVoltage + " – " + bmsCurrent;

  /* ---------- CHARGER LOGIC ---------- */
  let chargerVoltage = "";
  if (volt == 48) chargerVoltage = "57 – 59V";
  else if (volt == 60) {
    chargerVoltage = (cell === "lfp") ? "69 – 70V" : "67 – 67.5V";
  }
  else if (volt == 72) chargerVoltage = "82 – 84V";

  let chargerCurrent = (ah > 45) ? "10A (Recommended)" : "6A (Recommended)";

  document.getElementById("chargerVolt").innerText = chargerVoltage;
  document.getElementById("chargerAmp").innerText  = chargerCurrent;
}

   function loadBHK(type) {
  const table = document.getElementById("applianceTable");
  table.innerHTML = `
    <tr>
      <th>Appliance</th>
      <th>Watt</th>
      <th>Qty</th>
    </tr>
  `;

  bhkData[type].forEach(item => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${item[0]}</td>
      <td><input class="watt" value="${item[1]}" readonly></td>
      <td><input class="qty" value="${item[2]}" readonly></td>
    `;
  });

  calculate(); // auto calculate total watt
}
// Simple bounce animation every 3 seconds
const whatsappBtn = document.querySelector('.whatsapp_float');

setInterval(() => {
  whatsappBtn.style.transform = 'translateY(-10px)';
  setTimeout(() => {
    whatsappBtn.style.transform = 'translateY(0)';
  }, 300);
}, 3000);
