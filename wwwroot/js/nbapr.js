var nbapr = {

	"weeks" : null,

	"loadWeeklySummary" : function (data) {
		nbapr.weeks = transformer.weekly(data, "AVG");

		var html = tmp_team(nbapr.weeks.p1.atl);
		$$("#p1").html(html);
	}
}
