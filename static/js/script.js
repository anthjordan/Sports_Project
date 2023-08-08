let scoresData;
let salaryData;

window.onload = function() {
  console.log('Page loaded');

  // Fetch scores and salary data immediately
  Promise.all([
    fetch('http://127.0.0.1:5000/api/nfl_scores').then(response => response.json()),
    fetch('http://127.0.0.1:5000/api/nfl_salaries').then(response => response.json())
  ])
  .then(([scores, salaries]) => {
    console.log('Received scores and salaries data');
    scoresData = scores;
    salaryData = salaries;

    let years = [...new Set(scoresData.map(record => record.Year))].sort();
    let teams = [...new Set(scoresData.map(record => record.Team))].sort();
    console.log('Years:', years);
    console.log('Teams:', teams);

    let yearStart = document.getElementById("yearStart");
    let yearEnd = document.getElementById("yearEnd");
    let teamDropdown = document.getElementById("teamDropdown");
    
    // Populate the input fields with the years and dropdown with the teams
    for (let year of years) {
      let option = document.createElement("option");
      option.value = year;
      option.text = year;
      yearStart.appendChild(option.cloneNode(true));
      yearEnd.appendChild(option.cloneNode(true));
    }

    for (let team of teams) {
      let option = document.createElement("option");
      option.value = team;
      option.text = team;
      teamDropdown.appendChild(option);
    }

    // Add event listener for the 'Submit' button
    document.getElementById('submitYearRange').addEventListener('click', function() {
      console.log('Submit button clicked');
      let yearStart = document.getElementById("yearStart").value;
      let yearEnd = document.getElementById("yearEnd").value;
      let selectedTeam = document.getElementById("teamDropdown").value;
      console.log(`Selected year range: ${yearStart}-${yearEnd} and team: ${selectedTeam}`);

      // Filter data for the selected year range and team
      let filteredScoresData = scoresData.filter(record => record.Year >= yearStart && record.Year <= yearEnd && record.Team == selectedTeam);
      let filteredSalaryData = salaryData.filter(record => record.year >= yearStart && record.year <= yearEnd && record.team == selectedTeam);
      
      updateCharts(filteredScoresData, filteredSalaryData);
    });
  });
};

function updateCharts(scoresData, salaryData) {
  console.log('Update charts with the following data:');
  console.log('Scores data:', scoresData);
  console.log('Salary data:', salaryData);

  // Prepare data for the charts
  let years = scoresData.map(record => record.Year);
  let wins = scoresData.map(record => record.Win);
  let salaries = salaryData.map(record => Number(record.cap_hit.replace(/[^0-9.-]+/g,"")));

  // Bar chart: Number of wins by year
  let winningChartData = {
      x: years,
      y: wins,
      type: 'bar',
      name: 'Wins'
  };
  Plotly.newPlot('winningChart', [winningChartData], {title: 'Number of Wins by Year'});

  // Bar chart: Total salary spending by year
  let salaryChartData = {
      x: years,
      y: salaries,
      type: 'bar',
      name: 'Salary Spending'
  };
  Plotly.newPlot('salaryChart', [salaryChartData], {title: 'Total Salary Spending by Year'});

  // Line chart: Trend of the number of wins by year
  let winningTrendChartData = {
      x: years,
      y: wins,
      type: 'scatter',
      mode: 'lines',
      name: 'Wins'
  };
  Plotly.newPlot('winningTrendChart', [winningTrendChartData], {title: 'Trend of Wins by Year'});

  // Line chart: Trend of salary spending by year
  let salaryTrendChartData = {
      x: years,
      y: salaries,
      type: 'scatter',
      mode: 'lines',
      name: 'Salary Spending'
  };
  Plotly.newPlot('salaryTrendChart', [salaryTrendChartData], {title: 'Trend of Salary Spending by Year'});

  // Scatter plot: Correlation between the number of wins and salary spending
  let correlationChartData = {
      x: wins,
      y: salaries,
      mode: 'markers',
      type: 'scatter',
      name: 'Wins vs Salary Spending',
      marker: { size: 12 }
  };
  let correlationLayout = {
    title: 'Correlation Between Wins and Salary Spending',
    xaxis: { title: 'Wins' },
    yaxis: { title: 'Salary Spending' },
  };
  Plotly.newPlot('correlationChart', [correlationChartData], correlationLayout);
}
