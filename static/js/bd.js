d3.json("/static/data/seasons.json").then((data) => {
    // Initialize dropdowns and charts.
    populateYearDropdowns(data);
    setInitialSelections();

    // Event listeners for dropdown changes
    d3.select("#startYearDropdown").on("change", function() {
        let selectedYear = d3.select(this).property("value");
        populateTeamsForYear(data, selectedYear);
    });
    
    d3.select("#teamSelect").on("change", updateVisualizations);
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
        const superbowlWinnersSet = new Set(); 

        for (let team of selectedTeams) {
            teamsData[team] = {
                salaries: [],
                wins: [],
                losses: [],
                winRates: [],
                playoffWins: [],
                playoffLosses: [],
                playoffWinRates: []
            };
            for (let i = selectedStartYear; i <= selectedEndYear; i++) {
                const yearData = data[i - 2011][i];
            
                for (let team in yearData) {
                    if (yearData[team].superbowl_winner && yearData[team].superbowl_winner === team) {
                        superbowlWinnersSet.add(`${team} (${i})`); // Add to the Set. Duplicates will be ignored
                    }
                }
            }
            for (let i = selectedStartYear; i <= selectedEndYear; i++) {
                const yearData = data[i - 2011][i][team];
                const totalSalary = yearData['players'].reduce((sum, player) => sum + player['cap_hit'], 0);
                
                teamsData[team].salaries.push(totalSalary);
                teamsData[team].wins.push(yearData['win_loss'].win);
                teamsData[team].losses.push(yearData['win_loss'].loss);
                
                let winRate = (yearData['win_loss'].win / (yearData['win_loss'].win + yearData['win_loss'].loss)) * 100;
                teamsData[team].winRates.push(winRate.toFixed(2));
                
                let playoffWins = yearData['playoff_win_loss'].win || 0;
                let playoffLosses = yearData['playoff_win_loss'].loss || 0;
                
                
                teamsData[team].playoffWins.push(playoffWins);
                teamsData[team].playoffLosses.push(playoffLosses);
                
                
            }
        }
        
        // Update Superbowl information on the page
        const superbowlWinners = [...superbowlWinnersSet];
        document.querySelector('#superbowlInfo').textContent = `Superbowl Winners: ${superbowlWinners.join(", ")}`;
        
        // Salary Chart
        Highcharts.chart('salaryChart', {
            title: { text: 'Yearly Salaries' },
            xAxis: { categories: Array.from({length: selectedEndYear - selectedStartYear + 1}, (_, i) => i + selectedStartYear) },
            yAxis: { title: { text: 'Salary' } },
            series: selectedTeams.map(team => ({ name: team, data: teamsData[team].salaries }))
        });
        
        //Win-Loss Chart with win rates
        Highcharts.chart('winLossChart', {
            chart: { type: 'column' },
            title: { text: 'Yearly Wins, Losses, and Win Rate' },
            xAxis: { categories: Array.from({length: selectedEndYear - selectedStartYear + 1}, (_, i) => i + selectedStartYear) },
            yAxis: [{ title: { text: 'Matches' } }, { title: { text: 'Win Rate (%)' }, opposite: true }],
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [].concat.apply([], selectedTeams.map(team => [
                { 
                    name: `${team} Wins`, 
                    data: teamsData[team].wins,
                    stack: team
                },
                { 
                    name: `${team} Losses`, 
                    data: teamsData[team].losses,
                    stack: team
                },
                { 
                    name: `${team} Win Rate`, 
                    type: 'spline', 
                    yAxis: 1, 
                    data: teamsData[team].winRates.map(Number) 
                }
            ]))
        });
        // Playoff Chart with Wins, Losses, and Win Rate
        Highcharts.chart('playoffChart', {
            chart: { type: 'column' },
            title: { text: 'Playoff Wins, Losses' },
            xAxis: { categories: Array.from({length: selectedEndYear - selectedStartYear + 1}, (_, i) => i + selectedStartYear) },
            yAxis: [{ title: { text: 'Matches' } }],
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [].concat.apply([], selectedTeams.map(team => [
                { 
                    name: `${team} Playoff Wins`, 
                    data: teamsData[team].playoffWins,
                    stack: team
                },
                { 
                    name: `${team} Playoff Losses`, 
                    data: teamsData[team].playoffLosses,
                    stack: team
                }
        
            ]))
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
        // Additional charts can be placed here, based on requirements.
    }
    
});
