d3.json("/static/data/formattedData.json").then((data) => {
  function setYears(){
    //Get Years
    let years = Object.keys(data[0])

    //Add Years to options
    for(const year of years){
      let optionYear = d3.select("#selYear").append("option")
      optionYear.text(`${year}`)
      optionYear.attr("value", `${year}`)
    }
  }

  function setTeams(){

    //Get Year
    let selectedYear = d3.select("#selYear").property("value")

    //Get teams from respective year
    let teams = Object.keys(data[0][selectedYear])

    //Remove Teams that were previously set
    d3.select("#selTeam").html("");

    //Add Teams to options
    for(const team of teams){
      let optionTeam = d3.select("#selTeam").append("option")
      optionTeam.text(`${team}`)
      optionTeam.attr("value", `${team}`)
    }

  }

  function init(){
    let selYear="", selTeam = "";
    selYear = d3.select("#selYear").property("value")
    selTeam = d3.select("#selTeam").property("value")
    let mapSalary = data[0][selYear][selTeam]['players'].map((item) => item['cap_hit'])
    let mapName = data[0][selYear][selTeam]['players'].map((item) => item['name'])
    let byPosition = data[0][selYear][selTeam]['players'].map((item) => item['position'])
    
    console.log(mapName, byPosition)
    // byPosition = [...new Set(byPosition)]

    let toShow = [{
      values: mapSalary,
      labels: mapName,
      type: 'pie',
      hole: .3,
      title: selTeam,
      hovertemplate: 'Player Name: %{label} <br>Player Salary: \$%{value} <br>Percentage: %{percent} <br>Position: %{customdata[0]}<extra></extra>',
      textposition: "inside",
      texttemplate: "%{percent}",
      showlegend: true,
      customdata: byPosition
    }];
    let layout = {
      height: 700,
      width: 950
    };
    
    Plotly.newPlot("chart", toShow, layout, {responsive: true});
  }
  setYears()
  setTeams()
  init()
  d3.selectAll("#selYear").on("change", () => {
    setTeams();
    init();
  });
  d3.selectAll("#selTeam").on("change", () => {
    init();
  });
});