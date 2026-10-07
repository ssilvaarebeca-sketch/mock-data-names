(function () {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const workspace = document.getElementById("workspace");
  const fileName = document.getElementById("file-name");
  const rowCount = document.getElementById("row-count");
  const columnList = document.getElementById("column-list");
  const selectAllBtn = document.getElementById("select-all");
  const selectNoneBtn = document.getElementById("select-none");
  const tableHead = document.getElementById("table-head");
  const tableBody = document.getElementById("table-body");
  const errorBox = document.getElementById("error-box");

  let headers = [];
  let records = [];
  let selectedColumns = new Set();

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = !message;
  }

  function loadFile(file) {
    showError("");
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result).replace(/^﻿/, "");
      const { headers: parsedHeaders, records: parsedRecords } = parseCSV(text);
      if (parsedHeaders.length === 0) {
        showError("Couldn't find any columns in that file. Is it a valid CSV?");
        return;
      }
      headers = parsedHeaders;
      records = parsedRecords;
      selectedColumns = new Set(headers);
      fileName.textContent = file.name;
      rowCount.textContent = `${records.length} row${records.length === 1 ? "" : "s"}`;
      renderColumnPicker();
      renderTable();
      workspace.hidden = false;
    };
    reader.onerror = () => showError("Couldn't read that file.");
    reader.readAsText(file);
  }

  function renderColumnPicker() {
    columnList.innerHTML = "";
    headers.forEach((header) => {
      const id = `col-${header}`;
      const label = document.createElement("label");
      label.className = "column-toggle";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.checked = selectedColumns.has(header);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) selectedColumns.add(header);
        else selectedColumns.delete(header);
        renderTable();
      });

      const span = document.createElement("span");
      span.textContent = header;

      label.appendChild(checkbox);
      label.appendChild(span);
      columnList.appendChild(label);
    });
  }

  function renderTable() {
    const activeColumns = headers.filter((h) => selectedColumns.has(h));

    tableHead.innerHTML = "";
    const headRow = document.createElement("tr");
    activeColumns.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headRow.appendChild(th);
    });
    tableHead.appendChild(headRow);

    tableBody.innerHTML = "";
    const fragment = document.createDocumentFragment();
    records.forEach((record) => {
      const tr = document.createElement("tr");
      activeColumns.forEach((header) => {
        const td = document.createElement("td");
        td.textContent = record[header] ?? "";
        tr.appendChild(td);
      });
      fragment.appendChild(tr);
    });
    tableBody.appendChild(fragment);
  }

  selectAllBtn.addEventListener("click", () => {
    selectedColumns = new Set(headers);
    renderColumnPicker();
    renderTable();
  });

  selectNoneBtn.addEventListener("click", () => {
    selectedColumns = new Set();
    renderColumnPicker();
    renderTable();
  });

  fileInput.addEventListener("change", (e) => loadFile(e.target.files[0]));

  dropZone.addEventListener("click", () => fileInput.click());

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-active");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-active");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    loadFile(file);
  });
})();
