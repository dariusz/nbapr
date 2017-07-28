var sorter = {
	"sort" : function (measure, teamarray) {

		var sorted = {}

		for (idx in teamarray) {
			var t = teamarray[idx];
			if(t.measure == measure) {
				sorted[t.value] = t.team;
			}
		}

		return sorted;
	}
}
