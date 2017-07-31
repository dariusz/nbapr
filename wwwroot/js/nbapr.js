var nbapr = {

	"loadRankings" : function (data) {
		nbapr.loadWeeklyRankings(data, "p1");
	},

	"loadWeeklyRankings" : function (data, weekname) {
		var rankings = transformer.weekly(data, weekname);
		var html = tmp_rankings(rankings);
		$$("#" + weekname + " .rankings").html(html);
	}
}
