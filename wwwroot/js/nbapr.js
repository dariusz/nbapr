var nbapr = {

	"loadRankings" : function (data) {
		nbapr.loadWeeklyRankings(data, "p1");
	},

	"loadSources" : function (data) {
		nbapr.loadWeeklySources(data, "p1");
	},

	"loadWeeklySources" : function (data, weekname) {
		var sources = transformer.weeklysources(data, weekname);
		var html = tpl_sources(sources);
		$$("#" + weekname + " .sources").html(html);
	},

	"loadWeeklyRankings" : function (data, weekname) {
		var rankings = transformer.weeklyrankings(data, weekname);
		var html = tpl_rankings(rankings);
		$$("#" + weekname + " .rankings").html(html);
	}
}
