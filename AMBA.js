const dropdownButtons = document.querySelectorAll('.dropdown-btn');

dropdownButtons.forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});






const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuFQgA8IkJFk4SXreMAjvy0ICZY3f1dYeiDIe5sxhp1EEaL5B-iSRzuzH-GSkBYclPapzOXIGyXKsc/pub?output=csv";

    
    



    
    

   // updateDashboard(data); to update full data on dashboard



function filterData() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const singleDate = document.getElementById('single-date').value;

    let filteredData = [];

    if (singleDate) {
        filteredData = data.filter(item => item.date === singleDate);
    }
   
    else if (startDate && endDate) {
        filteredData = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
    }

    updateDashboard(filteredData);
}

function updateDashboard(filteredData) {
    if (filteredData.length > 0) {
        const totalOrders = filteredData.reduce((acc, curr) => acc + curr.totalOrders, 0);
        const totalQty = filteredData.reduce((acc, curr) => acc + curr.totalQty, 0);
        const totalDispatch = filteredData.reduce((acc, curr) => acc + curr.totalDispatch, 0);
        const totalProductionPress1 = filteredData.reduce((acc, curr) => acc + curr.totalProductionPress1, 0);
        const totalProductionPress2 = filteredData.reduce((acc, curr) => acc + curr.totalProductionPress2, 0);

        document.getElementById('total-orders').innerText = totalOrders;
        document.getElementById('total-qty').innerText = totalQty;
        document.getElementById('total-dispatch').innerText = totalDispatch;
        document.getElementById('total-production-press1').innerText = totalProductionPress1;
        document.getElementById('total-production-press2').innerText = totalProductionPress2;
    } else {
        alert("No data found for the selected date range.");
    }
}



