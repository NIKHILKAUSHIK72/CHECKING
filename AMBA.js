document.addEventListener("DOMContentLoaded", function() {
    // CSV URLs for each sheet
    const ordersUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuFQgA8IkJFk4SXreMAjvy0ICZY3f1dYeiDIe5sxhp1EEaL5B-iSRzuzH-GSkBYclPapzOXIGyXKsc/pub?output=csv&sheet=Orders";
    const dispatchUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHI7lyC_Dt5v8lJYm3UZN4ZsktGq-n9QbCbUWGlxA4qIzGOm1LHSUfFVJz4oVTdnX-CO3rgVn1XSux/pub?gid=0&single=true&output=csv&sheet=DISPATCH";
    const press1Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgGViYleh1IOBFTCWpNGHmlr0lh4XK0JUAbaJKLcnmLmx3FdWk10er0e5KT0r78jetl4mNlvkuEAFN/pub?gid=0&single=true&output=csv&sheet=RAW DATA";
    const press2Url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgGViYleh1IOBFTCWpNGHmlr0lh4XK0JUAbaJKLcnmLmx3FdWk10er0e5KT0r78jetl4mNlvkuEAFN/pub?gid=0&single=true&output=csv&sheet=RAW DATA";

    let ordersRows, dispatchRows, press1Rows, press2Rows;

    // Fetch data from multiple sheets (CSV)
    Promise.all([
        fetch(ordersUrl).then(res => res.text()),
        fetch(dispatchUrl).then(res => res.text()),
        fetch(press1Url).then(res => res.text()),
        fetch(press2Url).then(res => res.text())
    ])
    .then(([ordersData, dispatchData, press1Data, press2Data]) => {
        // Parse the CSV data for each sheet
        ordersRows = parseCSV(ordersData);
        dispatchRows = parseCSV(dispatchData);
        press1Rows = parseCSV(press1Data);
        press2Rows = parseCSV(press2Data);

        // Initial calculation for totals
        updateDashboard();
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
    });

    // Function to parse CSV data and return rows as arrays
    function parseCSV(csvData) {
        return csvData.split('\n').map(row => row.split(','));
    }

    // Apply date filter for all fields
    function filterDataByDate() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        console.log("Start Date: ", startDate);
        console.log("End Date: ", endDate);

        // If no dates are set, return all data for all fields
        if (!startDate && !endDate) {
            return { orders: ordersRows, dispatch: dispatchRows, press1: press1Rows, press2: press2Rows };
        }

        const filteredOrders = filterOrdersByDate(ordersRows, startDate, endDate);
        const filteredDispatch = filterDispatchByDate(dispatchRows, startDate, endDate);
        const filteredPress1 = filterPressDataByDate(press1Rows, startDate, endDate, 'HP01');
        const filteredPress2 = filterPressDataByDate(press2Rows, startDate, endDate, 'HP02');

        // Log filtered data to see what is returned
        console.log("Filtered Orders: ", filteredOrders);
        console.log("Filtered Dispatch: ", filteredDispatch);
        console.log("Filtered Press1 (HP01): ", filteredPress1);
        console.log("Filtered Press2 (HP02): ", filteredPress2);

        return {
            orders: filteredOrders,
            dispatch: filteredDispatch,
            press1: filteredPress1,
            press2: filteredPress2
        };
    }

    // Filter Orders by Date
    function filterOrdersByDate(data, startDate, endDate) {
        const dateColumnIndex = 0;  // Orders Date is in column 0
        return data.filter((row, index) => {
            if (index === 0) return true; // Keep header row

            const orderDateStr = row[dateColumnIndex];
            const orderDate = parseDate(orderDateStr);

            return isWithinDateRange(orderDate, startDate, endDate);
        });
    }

    // Filter Dispatch by Date
    function filterDispatchByDate(data, startDate, endDate) {
        const dateColumnIndex = 0;  // Dispatch Date is in column 0
        return data.filter((row, index) => {
            if (index === 0) return true; // Keep header row

            const dispatchDateStr = row[dateColumnIndex];
            const dispatchDate = parseDate(dispatchDateStr);

            return isWithinDateRange(dispatchDate, startDate, endDate);
        });
    }

    // Filter Press Data by Date and Press Type
    function filterPressDataByDate(data, startDate, endDate, pressType) {
        const dateColumnIndex = 0;  // Production Date is in column 0
        return data.filter((row, index) => {
            if (index === 0) return true; // Keep header row

            const productionDateStr = row[dateColumnIndex];
            const productionDate = parseDate(productionDateStr);

            const isInDateRange = isWithinDateRange(productionDate, startDate, endDate);

            // Ensure the press type is correct
            const isCorrectPressType = row[7]?.trim() === pressType;

            // Debugging: Log filtering status
            console.log(`Row: ${row}, Date: ${productionDate}, Is Correct Press Type: ${isCorrectPressType}`);

            return isInDateRange && isCorrectPressType;
        });
    }

    // Helper function to parse DD/MM/YYYY format into a Date object
    function parseDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`);
    }

    // Helper function to check if a date is within the specified range
    function isWithinDateRange(date, startDate, endDate) {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return (!start || date >= start) && (!end || date <= end);
    }

    // Function to calculate totals for HP01 and HP02 presses
    function calculatePressTotals(pressData) {
        let hp01Total = 0;
        let hp02Total = 0;

        // Assuming that the LOAD ID is in column 0 and quantity in column 1
        pressData.forEach(row => {
            if (row[7] === 'HP01') {
                hp01Total += parseInt(row[5]) || 0; // Add quantity for HP01 press
            } else if (row[7] === 'HP02') {
                hp02Total += parseInt(row[5]) || 0; // Add quantity for HP02 press
            }
        });

        return { hp01Total, hp02Total };
    }

    // Calculate total dispatch quantity (from Dispatch sheet)
    function calculateTotalDispatch(data) {
        return data.slice(1).reduce((sum, row) => {
            const dispatchQuantity = parseInt(row[2]) || 0; // Dispatch quantity is in column 2
            return sum + dispatchQuantity;
        }, 0);
    }

    // Calculate total orders from Orders sheet (assuming column 1 contains orders)
    function calculateTotalOrders(data) {
        return data.slice(1).reduce((sum, row) => sum + (parseInt(row[1]) || 0), 0);
    }

    // Calculate total qty ordered from Orders sheet (assuming column 2 contains qty)
    function calculateTotalQtyOrdered(data) {
        return data.slice(1).reduce((sum, row) => sum + (parseInt(row[2]) || 0), 0);
    }

    // Calculate total production (from Production Press sheets)
    function calculateTotalProduction(data) {
        return data.slice(1).reduce((sum, row) => sum + (parseInt(row[5]) || 0), 0);
    }

    // Update dashboard with the totals
    function updateDashboard() {
        const { orders, dispatch, press1, press2 } = filterDataByDate();

        const totals = {
            totalOrders: calculateTotalOrders(orders),
            totalQtyOrdered: calculateTotalQtyOrdered(orders),
            totalDispatch: calculateTotalDispatch(dispatch),
            totalProductionPress1: calculateTotalProduction(press1),
            totalProductionPress2: calculateTotalProduction(press2)
        };

        const pressTotals1 = calculatePressTotals(press1);  // For HP01 and HP02 in press1
        const pressTotals2 = calculatePressTotals(press2);  // For HP01 and HP02 in press2

        // Display totals on the dashboard
        document.getElementById('total-orders').textContent = totals.totalOrders;
        document.getElementById('total-qty-ordered').textContent = totals.totalQtyOrdered;
        document.getElementById('total-dispatch').textContent = totals.totalDispatch;
        document.getElementById('total-production-press1').textContent = totals.totalProductionPress1;
        document.getElementById('total-production-press2').textContent = totals.totalProductionPress2;
        
        // Display HP01 and HP02 totals for each press
        document.getElementById('hp01-press1').textContent = `HP01 Press1: ${pressTotals1.hp01Total}`;
        document.getElementById('hp02-press1').textContent = `HP02 Press1: ${pressTotals1.hp02Total}`;
        document.getElementById('hp01-press2').textContent = `HP01 Press2: ${pressTotals2.hp01Total}`;
        document.getElementById('hp02-press2').textContent = `HP02 Press2: ${pressTotals2.hp02Total}`;
    }

    // Apply date filter when the user clicks the button
    window.applyDateFilter = function() {
        updateDashboard();  // Recalculate totals based on the current filter
    };
});
