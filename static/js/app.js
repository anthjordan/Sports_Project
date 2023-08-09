d3.json("/static/data/seasons.json").then((data) => {
  function setYears(){
    //Get Years
    let years = []
    for(const obj of data){
      years.push(Object.keys(obj))
    }
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
    let teams = Object.keys(data[parseInt(selectedYear) - 2011][selectedYear])

    //Remove Teams that were previously set
    d3.select("#selTeam").html("");

    //Add Teams to options
    for(const team of teams){
      let optionTeam = d3.select("#selTeam").append("option")
      optionTeam.text(`${team}`)
      optionTeam.attr("value", `${team}`)
    }

  }
  function getColors(positions) {
    let colors = []
    for(const position of positions){
      if(["QB", "WR", "RB", "TE", "OL", "C", "FB", "G"].includes(position)){
        console.log(position)
        colors.push("blue")
      }else if (["DL", "DT", "DE", "OLB", "LB", "MLB", "CB", "S", "LT", "RT", "ILB", "FS", "LS", "RS"].includes(position)){
        colors.push("red")
      }else{
        colors.push("green")
      }
    }

    return colors;
  }
  function init(){
    let selYear="", selTeam = "";
    selYear = d3.select("#selYear").property("value")
    selTeam = d3.select("#selTeam").property("value")
    let mapSalary = data[parseInt(selYear) - 2011][selYear][selTeam]['players'].map((item) => item['cap_hit'])
    let mapName = data[parseInt(selYear) - 2011][selYear][selTeam]['players'].map((item) => item['name'])
    let positions = data[parseInt(selYear) - 2011][selYear][selTeam]['players'].map((item) => item['position'])
    
    console.log(mapName, positions)
    let byPosition = [...new Set(positions)]

    let toShow = [{
      values: mapSalary,
      labels: mapName,
      type: 'pie',
      hole: .3,
      title: `<b>${selTeam}</b>`,
      hovertemplate: 'Player Name: %{label} <br>Cap Hit: \$%{value} <br>Percentage: %{percent} <br>Position: %{customdata[0]}<extra></extra>',
      textposition: "inside",
      texttemplate: "%{percent}",
      showlegend: true,
      customdata: positions,
      marker: {

        colors: getColors(positions)
    
      },
    }];
    let layout = {
      height: 700,
      width: 950,
      legend : {
        "title": {
          "text": "<b>Player Names: (Highest to Lowest Cap Hit)</b>"
        }
      }
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