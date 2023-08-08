d3.json("/static/data/formattedData.json").then((data) => {
  function setYears(){
    //Get Years
    let years = Object.keys(data)

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
    let teams = Object.keys(data[selectedYear])

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
    let mapSalary = data[selYear][selTeam]['players'].map((item) => item['cap_hit'])
    let mapName = data[selYear][selTeam]['players'].map((item) => item['name'])
    let byPosition = data[selYear][selTeam]['players'].map((item) => item['position'])
    byPosition = [...new Set(byPosition)]

    let toShow = [{
      values: mapSalary,
      labels: mapName,
      type: 'pie',
      hole: .3,
    }];
    let layout = {
      height: 700,
      width: 950
    };
    
    Plotly.newPlot("chart", toShow, layout);
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