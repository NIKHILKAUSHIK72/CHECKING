// script.js
document.addEventListener("DOMContentLoaded", function() {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuFQgA8IkJFk4SXreMAjvy0ICZY3f1dYeiDIe5sxhp1EEaL5B-iSRzuzH-GSkBYclPapzOXIGyXKsc/pub?output=csv";
    
    // Function to fetch the CSV data from Google Sheets
    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            parseCSV(data);  // Call the function to parse the CSV data
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });

    // Function to parse the CSV data and update the dashboard
    function parseCSV(csv) {
        const rows = csv.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => row.split(','));

        // Fetch the start and end dates from the inputs
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        // Filter data based on the selected date range
        const filteredData = data.filter(row => {
            const rowDate = row[0];  // Assume the first column is the date
            return (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);
        });

        // If filteredData is empty, show a message or use default data
        if (filteredData.length > 0) {
            const totals = calculateTotals(filteredData);
            updateDashboard(totals);
        } else {
            updateDashboard({
                totalOrders: 0,
                totalQtyOrdered: 0,
                totalDispatch: 0,
                totalProductionPress1: 0,
                totalProductionPress2: 0
            });
        }
    }

    // Function to calculate totals from the filtered data
    function calculateTotals(filteredData) {
        let totalOrders = 0;
        let totalQtyOrdered = 0;
        let totalDispatch = 0;
        let totalProductionPress1 = 0;
        let totalProductionPress2 = 0;

        filteredData.forEach(row => {
            totalOrders += parseInt(row[1]);
            totalQtyOrdered += parseInt(row[2]);
            totalDispatch += parseInt(row[3]);
            totalProductionPress1 += parseInt(row[4]);
            totalProductionPress2 += parseInt(row[5]);
        });

        return {
            totalOrders,
            totalQtyOrdered,
            totalDispatch,
            totalProductionPress1,
            totalProductionPress2
        };
    }

    // Function to update the dashboard with new totals
    function updateDashboard(totals) {
        document.getElementById('total-orders').textContent = totals.totalOrders;
        document.getElementById('total-qty-ordered').textContent = totals.totalQtyOrdered;
        document.getElementById('total-dispatch').textContent = totals.totalDispatch;
        document.getElementById('total-production-press1').textContent = totals.totalProductionPress1;
        document.getElementById('total-production-press2').textContent = totals.totalProductionPress2;
    }

    // Function to apply the date filter when the user clicks the button
    window.applyDateFilter = function() {
        fetch(sheetUrl)
            .then(response => response.text())
            .then(data => {
                parseCSV(data);  // Reparse the data with the new filter
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
    };
});
