function init() {
    setTimeout(() => {
        initPlayerInput();
    }, 100);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.response);
            showClanPlayers(result);
        }
    };
    xhttp.open("GET", "https://api.royaleapi.com/clan/" + "9J09QJ9Q", true);
    xhttp.setRequestHeader("auth", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzE3LCJpZGVuIjoiMjQ3MzU0MTU4MTI5MDg2NDY1IiwibWQiOnt9LCJ0cyI6MTUyODczNzM4NzQ4MH0.6Gv59JsjhBuYtikNA7ONEJDZLhex1qlS9CkaaEsplhA");
    xhttp.send();
}

function initPlayerInput() {
    var input = $("#player-tag");
    input.focusout(inputGetPlayerData);
}

function showClanPlayers(result) {
    $("#main-header").html(result.name);
    if (location.pathname.includes('lastMatches')) {
        getMembersLastBattle(result.members);
    } else if (location.pathname.includes('openTournaments')) {
        getOpenTournaments();
    } else {
        var selectMenu = $("#member-select");
        selectMenu.on('change', selectMenuGetPlayerData);
        for (var i = 0; i < result.members.length; i++) {
            var option = $("<option></option>", {
                value: result.members[i].tag,
                class: 'option'
            });
            option.html(result.members[i].name);
            option.appendTo(selectMenu);
        }
    }
}

function handleBattleUI(values, result) {
    var currentWins = 0;
    var currentDraws = 0;
    var currentLoses = 0;
    var currentWinPercentage = 0;
    var currentDrawPercentage = 0;
    var currentLosePercentage = 0;
    var wins = result.games.wins;
    var draws = result.games.draws;
    var loses = result.games.losses;
    var total = values.length;
    var winPercentage = result.games.winsPercent;
    var drawPercentage = result.games.drawsPercent;
    var losePercentage = result.games.lossesPercent;
    $("#header").html(result.name + " - " + result.trophies);
    for (var i = 0; i < values.length; i++) {
        var tableRow = $("<tr></tr>");
        $("<td></td>").text(values[i].type).appendTo(tableRow);
        $("<td></td>").text(new Date(values[i].utcTime * 1000).toLocaleDateString()).appendTo(tableRow);
        $("<td></td>").text(values[i].own).appendTo(tableRow);
        $("<td></td>").text(values[i].opponent).appendTo(tableRow);
        $("<td></td>").text(values[i].difference).appendTo(tableRow);
        if (values[i].winner > 0) {
            currentWins++;
            $("<td></td>").text("Win").appendTo(tableRow);
        } else if (values[i].winner === 0) {
            currentDraws++;
            $("<td></td>").text("Draw").appendTo(tableRow);
        } else {
            currentLoses++;
            $("<td></td>").text("Lose").appendTo(tableRow);
        }
        tableRow.appendTo("#table-body");
    }
    var totalBattles = parseInt(wins) + parseInt(draws) + parseInt(loses);
    currentWinPercentage = (currentWins / total) * 100;
    currentDrawPercentage = (currentDraws / total) * 100;
    currentLosePercentage = (currentLoses / total) * 100;
    $("#upper-sub-header").html('Total battles: ' + totalBattles);
    $("#sub-header").html('Wins: ' + wins + ' ( '+ winPercentage +'%) | ' + 'Draws: ' + draws + ' ( '+ drawPercentage +'%) | ' + 'Loses: ' + loses + ' ( '+ losePercentage +'%)');
    $("#sub-header-2").html('Wins: ' + currentWins + ' ( '+ currentWinPercentage +'%) | ' + 'Draws: ' + currentDraws + ' ( '+ currentDrawPercentage +'%) | ' + 'Loses: ' + currentLoses + ' ( '+ currentLosePercentage +'%)');
    $("#lower-header").html('War day wins: ' + result.games.warDayWins);
}

function handleMemberUI(member) {
    var totalCardLevels = 0;
    var totalMaxCardLevels = 0;
    var totalDiffCardLevels = 0;
    for (var i = 0; i < member.cards.length; i++) {
        var card = member.cards[i];
        var diff = card.maxLevel - card.level;
        totalCardLevels = totalCardLevels + card.level;
        totalMaxCardLevels = totalMaxCardLevels + card.maxLevel;
        totalDiffCardLevels = totalDiffCardLevels + diff;
        var tableRow = $("<tr></tr>");
        $("<td></td>").text(card.name).appendTo(tableRow);
        $("<td></td>").text(card.level).appendTo(tableRow);
        $("<td></td>").text(card.maxLevel).appendTo(tableRow);
        $("<td></td>").text(diff).appendTo(tableRow);
        tableRow.appendTo("#members-table-body");
    }
    sortTable("members-table-body");
    var tableRow = $("<tr></tr>");
    $("<td></td>").text("Total").appendTo(tableRow);
    $("<td></td>").text(totalCardLevels).appendTo(tableRow);
    $("<td></td>").text(totalMaxCardLevels).appendTo(tableRow);
    $("<td></td>").text(totalDiffCardLevels).appendTo(tableRow);
    tableRow.appendTo("#members-table-body");
}

function sortTable(tableId) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById(tableId);
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.getElementsByTagName("TR");
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 0; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[0];
        y = rows[i + 1].getElementsByTagName("TD")[0];
        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

function analyzeBattles(result, battles) {
    var validBattles = battles;
    /* for (var i = 0; i < battles.length; i++) {
        if (battles[i].teamSize === 1) {
            validBattles.push(battles[i]);
        }
    } */
    var deck = [];
    var values = [];
    for (var u = 0; u < validBattles.length; u++) {
        var singleValue = {};
        singleValue["utcTime"] = validBattles[u].utcTime;
        singleValue["type"] = validBattles[u].type;
        if (validBattles[u].team) {
            for (var o = 0; o < validBattles[u].team.length; o++) {
                var ownvalue = 0;
                for (var z = 0; z < validBattles[u].team[o].deck.length; z++) {
                    if (validBattles[u].team[o].deck[z].rarity === "Common") {
                        ownvalue = ownvalue + validBattles[u].team[o].deck[z].level;
                    }
                    if (validBattles[u].team[o].deck[z].rarity === "Rare") {
                        ownvalue = ownvalue + validBattles[u].team[o].deck[z].level + 2;
                    }
                    if (validBattles[u].team[o].deck[z].rarity === "Epic") {
                        ownvalue = ownvalue + validBattles[u].team[o].deck[z].level + 5;
                    }
                    if (validBattles[u].team[o].deck[z].rarity === "Legendary") {
                        ownvalue = ownvalue + validBattles[u].team[o].deck[z].level + 8;
                    }
                    //deck.push(validBattles[u].team[o].deck[z]);
                }
                singleValue["own"] = ownvalue;
            }
        }
        if (validBattles[u].opponent) {
            for (var o = 0; o < validBattles[u].opponent.length; o++) {
                var value = 0;
                for (var z = 0; z < validBattles[u].opponent[o].deck.length; z++) {
                    if (validBattles[u].opponent[o].deck[z].rarity === "Common") {
                        value = value + validBattles[u].opponent[o].deck[z].level;
                    }
                    if (validBattles[u].opponent[o].deck[z].rarity === "Rare") {
                        value = value + validBattles[u].opponent[o].deck[z].level + 2;
                    }
                    if (validBattles[u].opponent[o].deck[z].rarity === "Epic") {
                        value = value + validBattles[u].opponent[o].deck[z].level + 5;
                    }
                    if (validBattles[u].opponent[o].deck[z].rarity === "Legendary") {
                        value = value + validBattles[u].opponent[o].deck[z].level + 8;
                    }
                }
                singleValue["opponent"] = value;
            }
        }
        singleValue["difference"] = ownvalue - value;
        singleValue["winner"] = validBattles[u].winner;
        values.push(singleValue);
    }
    handleBattleUI(values, result);
}

function selectMenuGetPlayerData() {
    var tag = $("#member-select").val();
    getPlayerData(tag);
}

function inputGetPlayerData() {
    var tag = $("#player-tag").val();
    if (tag.includes("#")) {
        tag = tag.split("#")[1];
    }
    getPlayerData(tag);
}

function getPlayerData(tag) {
    $("#table-body").empty();
    $("#members-table-body").empty();
    $("#header").empty();
    $("#upper-sub-header").empty();
    $("#sub-header").empty();
    $("#sub-header-2").empty();
    $("#lower-header").empty();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.response);
            getPlayerBattleData(result, analyzeBattles);
            if (location.pathname.includes('cardLevels')) {
                handleMemberUI(result);
            }
        }
    };
    xhttp.open("GET", "https://api.royaleapi.com/player/" + tag, true);
    xhttp.setRequestHeader("auth", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzE3LCJpZGVuIjoiMjQ3MzU0MTU4MTI5MDg2NDY1IiwibWQiOnt9LCJ0cyI6MTUyODczNzM4NzQ4MH0.6Gv59JsjhBuYtikNA7ONEJDZLhex1qlS9CkaaEsplhA");
    xhttp.send();
}

function getPlayerBattleData(member, callback) {
    $("#table-body").empty();
    $("#header").empty();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.response);
            callback(member, result);
        }
    };
    xhttp.open("GET", "https://api.royaleapi.com/player/" + member.tag + "/battles", true);
    xhttp.setRequestHeader("auth", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzE3LCJpZGVuIjoiMjQ3MzU0MTU4MTI5MDg2NDY1IiwibWQiOnt9LCJ0cyI6MTUyODczNzM4NzQ4MH0.6Gv59JsjhBuYtikNA7ONEJDZLhex1qlS9CkaaEsplhA");
    xhttp.send();
}

function getMembersLastBattle(members) {
    var i = 0;
    setInterval(function() {
        i++;
        getPlayerBattleData(members[i], showLastBattle);
    }, 300);
}

function handleTournamentResult(tournaments) {
    var openTournaments = [];
    for (var i = 0; i < tournaments.length; i++) {
        if (tournaments[i].open && tournaments[i].maxPlayers > 40) {
            openTournaments.push(tournaments[i]);
        }
    }
    openTournaments = openTournaments.splice(1, 5);
    var i = 0;
    setInterval(function() {
        i++;
        getTournamentDetails(openTournaments[i], showLastBattle);
    }, 300);
}

function getOpenTournaments() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.response);
            handleTournamentResult(result);
        }
    };
    xhttp.open("GET", "https://api.royaleapi.com/tournaments/open", true);
    xhttp.setRequestHeader("auth", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzE3LCJpZGVuIjoiMjQ3MzU0MTU4MTI5MDg2NDY1IiwibWQiOnt9LCJ0cyI6MTUyODczNzM4NzQ4MH0.6Gv59JsjhBuYtikNA7ONEJDZLhex1qlS9CkaaEsplhA");
    xhttp.send();    
}

function getTournamentDetails(tournament) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.response);
            showTournamentData(tournament, result);
        }
    };
    xhttp.open("GET", "https://api.royaleapi.com/tournament/" + tournament.tag, true);
    xhttp.setRequestHeader("auth", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzE3LCJpZGVuIjoiMjQ3MzU0MTU4MTI5MDg2NDY1IiwibWQiOnt9LCJ0cyI6MTUyODczNzM4NzQ4MH0.6Gv59JsjhBuYtikNA7ONEJDZLhex1qlS9CkaaEsplhA");
    xhttp.send();    
}

function showTournamentData(tournament, result) {
    console.log(tournament);
    console.log(result);
}

function showLastBattle(member, result) {
    var threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    var lastBattle = result[0];
    var tableRow = $("<tr></tr>");
    $("<td></td>").text(member.name).appendTo(tableRow);
    $("<td></td>").text(lastBattle.type).appendTo(tableRow);
    $("<td></td>").text(new Date(lastBattle.utcTime * 1000).toLocaleDateString()).appendTo(tableRow);
    if (threeDaysAgo.getTime() > new Date(lastBattle.utcTime * 1000).getTime()) {
        tableRow[0].classList.add('over-due');
    }
    tableRow.appendTo("#last-battles-table-body");
    sortTable("last-battles-table-body");
}

init();