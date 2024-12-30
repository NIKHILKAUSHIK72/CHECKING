const dropdownButtons = document.querySelectorAll('.dropdown-btn');

dropdownButtons.forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});






const data =[
    { date: "2024-12-01", totalOrders: 200, totalQty: 1500, totalDispatch: 1200, totalProductionPress1: 800, totalProductionPress2: 700 },
    { date: "2024-12-02", totalOrders: 120, totalQty: 1800, totalDispatch: 1600, totalProductionPress1: 1000, totalProductionPress2: 800 },
    { date: "2024-12-03", totalOrders: 150, totalQty: 2200, totalDispatch: 2000, totalProductionPress1: 1200, totalProductionPress2: 1000 },
    { date: "2024-12-04", totalOrders: 400, totalQty: 3500, totalDispatch: 250, totalProductionPress1: 2200, totalProductionPress2: 1000 },
    { date: "2024-12-05", totalOrders: 100, totalQty: 2500, totalDispatch: 450, totalProductionPress1: 2000, totalProductionPress2: 200 },
    { date: "2024-12-06", totalOrders: 400, totalQty: 3500, totalDispatch: 500, totalProductionPress1: 2200, totalProductionPress2: 1000 },
    { date: "2024-12-07", totalOrders: 200, totalQty: 2500, totalDispatch: 1000, totalProductionPress1: 1500, totalProductionPress2: 800 },
    { date: "2024-12-08", totalOrders: 200, totalQty: 2500, totalDispatch: 1000, totalProductionPress1: 1500, totalProductionPress2: 800 },
    { date: "2024-12-09", totalOrders: 500, totalQty: 800, totalDispatch: 1200, totalProductionPress1: 1700, totalProductionPress2: 900 },
    { date: "2024-12-10", totalOrders: 600, totalQty: 900, totalDispatch: 1300, totalProductionPress1: 1800, totalProductionPress2: 2000 },
    { date: "2024-12-11", totalOrders: 700, totalQty: 1000, totalDispatch: 1400, totalProductionPress1: 1900, totalProductionPress2: 2100 },
    { date: "2024-12-12", totalOrders: 800, totalQty: 1500, totalDispatch: 1600, totalProductionPress1: 2000, totalProductionPress2: 3000 },
    { date: "2024-12-13",totalOrders:900,totalQty:1600,totalDispatch:1700, totalProductionPress1:2500,totalProductionPress2:2600},
];


    
    

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



