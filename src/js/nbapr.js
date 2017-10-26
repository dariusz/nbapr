/* globals $$, tplSources, tplRankings */

var nbapr = {

	'loadRankings' : function (data) {
		nbapr.loadWeeklyRankings(data, 'p1');
		nbapr.loadWeeklyRankings(data, 'p2');
		nbapr.loadWeeklyRankings(data, 'w1');
	},

	'loadSources' : function (data) {
		nbapr.loadWeeklySources(data, 'p1');
		nbapr.loadWeeklySources(data, 'p2');
		nbapr.loadWeeklySources(data, 'w1');
	},

	'loadWeeklySources' : function (data, weekname) {
		var sources = transformer.weeklySources(data, weekname);
		var html = tplSources(sources);
		$$('#' + weekname + ' .sources').html(html);
	},

	'loadWeeklyRankings' : function (data, weekname) {
		var rankings = transformer.weeklyRankings(data, weekname);
		var html = tplRankings(rankings);
		$$('#' + weekname + ' .rankings').html(html);
	}
}
