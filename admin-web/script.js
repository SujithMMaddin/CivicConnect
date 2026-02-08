const API_BASE_URL = "http://localhost:8080/api/issues";
let allIssues = []; // Global array to store all issues for client-side filtering

document.addEventListener("DOMContentLoaded", () => {
  fetchIssues();
  setupEventListeners();
});

async function fetchIssues() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const issues = await response.json();
    if (!Array.isArray(issues)) {
      throw new Error("Invalid response: expected array of issues");
    }
    allIssues = issues; // Store all issues for filtering
    populateCategoryFilter(issues);
    applyFiltersAndSearch(); // Display filtered issues
  } catch (error) {
    console.error("Error fetching issues:", error);
    displayError(
      "Failed to fetch issues. Please check if the backend is running.",
    );
  }
}

function displayFilteredIssues(issues) {
  const tbody = document.getElementById("issues-tbody");
  tbody.innerHTML = "";

  if (issues.length === 0) {
    const row = tbody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 9;
    cell.textContent = "No issues found.";
    cell.style.textAlign = "center";
    return;
  }

  issues.forEach((issue) => {
    const row = tbody.insertRow();
    // Add priority class for highlighting
    if (issue.priority === "High") {
      row.classList.add("priority-high");
    } else if (issue.priority === "Medium") {
      row.classList.add("priority-medium");
    } else if (issue.priority === "Low") {
      row.classList.add("priority-low");
    }
    // Add resolved class for visual distinction
    if (issue.status === "Resolved") {
      row.classList.add("resolved-row");
    }
    row.insertCell().textContent = issue.issueId;
    row.insertCell().textContent = issue.category;
    row.insertCell().textContent = issue.description;
    row.insertCell().textContent = issue.latitude;
    row.insertCell().textContent = issue.longitude;
    row.insertCell().textContent = issue.priority;
    const statusCell = row.insertCell();
    statusCell.textContent = issue.status;
    row.insertCell().textContent = new Date(issue.createdAt).toLocaleString();

    const actionsCell = row.insertCell();
    const select = document.createElement("select");
    select.dataset.issueId = issue.issueId;
    select.dataset.currentStatus = issue.status;

    const statuses = ["Pending", "In Progress", "Resolved"];
    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (status === issue.status) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener("change", updateIssueStatus);
    actionsCell.appendChild(select);
  });
}

function updateSummaryCards(issues) {
  const total = issues.length;
  const pending = issues.filter((i) => i.status === "Pending").length;
  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;
  const highPriority = issues.filter((i) => i.priority === "High").length;

  document.getElementById("total-issues").textContent = total;
  document.getElementById("pending-issues").textContent = pending;
  document.getElementById("in-progress-issues").textContent = inProgress;
  document.getElementById("resolved-issues").textContent = resolved;
  document.getElementById("high-priority-issues").textContent = highPriority;
}

async function updateIssueStatus(event) {
  const select = event.target;
  const issueId = select.dataset.issueId;
  const newStatus = select.value;
  const currentStatus = select.dataset.currentStatus;

  // Validate status transition
  const validTransitions = {
    Pending: ["In Progress"],
    "In Progress": ["Resolved"],
    Resolved: [],
  };

  if (!validTransitions[currentStatus].includes(newStatus)) {
    alert(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    select.value = currentStatus; // Reset to original
    return;
  }

  // Confirmation dialog
  const confirmed = confirm(
    `Are you sure you want to change the status from ${currentStatus} to ${newStatus}?`,
  );
  if (!confirmed) {
    select.value = currentStatus; // Reset to original
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${issueId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Update UI only after successful response
    select.dataset.currentStatus = newStatus;
    // Refresh the entire list to ensure consistency
    fetchIssues();
  } catch (error) {
    console.error("Error updating issue status:", error);
    alert("Failed to update issue status. Please try again.");
    select.value = currentStatus; // Reset to original
  }
}

function displayError(message) {
  const tbody = document.getElementById("issues-tbody");
  tbody.innerHTML = `<tr><td colspan="9" class="error">${message}</td></tr>`;
}

// Setup event listeners for filters and search
function setupEventListeners() {
  document
    .getElementById("search-input")
    .addEventListener("input", applyFiltersAndSearch);
  document
    .getElementById("status-filter")
    .addEventListener("change", applyFiltersAndSearch);
  document
    .getElementById("priority-filter")
    .addEventListener("change", applyFiltersAndSearch);
  document
    .getElementById("category-filter")
    .addEventListener("change", applyFiltersAndSearch);
}

// Populate category filter dropdown with unique categories
function populateCategoryFilter(issues) {
  const categoryFilter = document.getElementById("category-filter");
  const categories = [...new Set(issues.map((issue) => issue.category))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Apply filters and search, then display results and update summary
function applyFiltersAndSearch() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const statusFilter = document.getElementById("status-filter").value;
  const priorityFilter = document.getElementById("priority-filter").value;
  const categoryFilter = document.getElementById("category-filter").value;

  const filteredIssues = allIssues.filter((issue) => {
    const matchesSearch =
      !searchTerm ||
      issue.issueId.toString().toLowerCase().includes(searchTerm) ||
      issue.category.toLowerCase().includes(searchTerm) ||
      issue.description.toLowerCase().includes(searchTerm);
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesPriority =
      !priorityFilter || issue.priority === priorityFilter;
    const matchesCategory =
      !categoryFilter || issue.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  displayFilteredIssues(filteredIssues);
  updateSummaryCards(filteredIssues);
}
