d3.json("/static/data/seasons.json").then((data) => {
    // Initialize dropdowns and charts.
    populateYearDropdowns(data);
    setInitialSelections();

    // Event listeners for dropdown changes
    d3.select("#startYearDropdown").on("change", function() {
      let selectedYear = d3.select(this).property("value");
      populateTeamsForYear(data, selectedYear);
    });
    
    d3.select("#teamSelect").on("change", () => {
      updateVisualizations();
    });

    document.querySelector("#updateButtonId").addEventListener("click", updateVisualizations);

    function populateYearDropdowns(data) {
        let years = data.map(obj => Object.keys(obj)[0]);
        let startYearDropdown = d3.select("#startYearDropdown");
        let endYearDropdown = d3.select("#endYearDropdown");
    
        startYearDropdown.html("");
        endYearDropdown.html("");
    
        years.forEach(year => {
            startYearDropdown.append("option").text(year).attr("value", year);
            endYearDropdown.append("option").text(year).attr("value", year);
        });
    }
    
    function populateTeamsForYear(data, year) {
        let teams = Object.keys(data[parseInt(year) - 2011][year]);
        let teamDropdown = d3.select("#teamSelect");
    
        teamDropdown.html("");
    
        teams.forEach(team => {
            teamDropdown.append("option").text(team).attr("value", team);
        });
    }
    
    function setInitialSelections() {
        let initialYear = d3.select("#startYearDropdown").property("value");
        populateTeamsForYear(data, initialYear);
        updateVisualizations();
    }

    function updateVisualizations() {
        const selectedStartYear = parseInt(d3.select("#startYearDropdown").property("value"));
        const selectedEndYear = parseInt(d3.select("#endYearDropdown").property("value"));
        
        const selectedTeams = Array.from(document.querySelectorAll("#teamSelectForm input[type='checkbox']:checked")).map(checkbox => checkbox.value);
        
        const teamsData = {};
        
        for (let team of selectedTeams) {
            teamsData[team] = {
                salaries: [],
                wins: [],
                losses: [],
                playoffs: []
            };
            for (let i = selectedStartYear; i <= selectedEndYear; i++) {
                const yearData = data[i - 2011][i][team];
    
                // Summing up salaries for the year
                const totalSalary = yearData['players'].reduce((sum, player) => sum + player['cap_hit'], 0);
                teamsData[team].salaries.push(totalSalary);
                
                // Wins and Losses
                teamsData[team].wins.push(yearData['win_loss'].win);
                teamsData[team].losses.push(yearData['win_loss'].loss);
                
                // Checking for playoff data and converting to binary (0 or 1)
                teamsData[team].playoffs.push(yearData['playoff_win_loss'].win ? 1 : 0);
            }
        }
        
        // Create charts
    
        // Salary Chart
        Highcharts.chart('salaryChart', {
            title: { text: 'Yearly Salaries' },
            xAxis: { categories: Array.from({length: selectedEndYear - selectedStartYear + 1}, (_, i) => i + selectedStartYear) },
            yAxis: { title: { text: 'Salary' } },
            series: selectedTeams.map(team => ({ name: team, data: teamsData[team].salaries }))
        });
    
        // Win-Loss Chart (Bar chart)
        Highcharts.chart('winLossChart', {
            chart: { type: 'bar' },
            title: { text: 'Yearly Wins and Losses' },
            xAxis: { categories: Array.from({length: selectedEndYear - selectedStartYear + 1}, (_, i) => i + selectedStartYear) },
            yAxis: { title: { text: 'Matches' } },
            series: [].concat.apply([], selectedTeams.map(team => [
                { name: `${team} Wins`, data: teamsData[team].wins },
                { name: `${team} Losses`, data: teamsData[team].losses }
            ]))
        });
    
        // Playoff Chart (Bar chart)
        Highcharts.chart('playoffChart', {
            chart: { type: 'bar' },
            title: { text: 'Playoff Appearances' },
            xAxis: { categories: Array.from({length: selectedEndYear - selectedStartYear + 1}, (_, i) => i + selectedStartYear) },
            yAxis: { title: { text: 'Playoff Appearance' } },
            series: selectedTeams.map(team => ({ name: team, data: teamsData[team].playoffs }))
        });
    
        // Combination of Salary and Wins (bar + line)
        Highcharts.chart('salaryWinsComboChart', {
            title: { text: 'Salary and Wins Over the Years' },
            xAxis: { categories: Array.from({length: selectedEndYear - selectedStartYear + 1}, (_, i) => i + selectedStartYear) },
            yAxis: [{ 
                title: { text: 'Salary' } 
            }, {
                title: { text: 'Wins' },
                opposite: true
            }],
            series: [].concat.apply([], selectedTeams.map(team => [
                { name: `${team} Salary`, type: 'column', data: teamsData[team].salaries },
                { name: `${team} Wins`, type: 'spline', yAxis: 1, data: teamsData[team].wins }
            ]))
        });
    }
    
});
