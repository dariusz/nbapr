var transformer = {

	"sortNumber" : function (a,b) {
		return a - b;
	},

	"getWeekFromRow" : function (row) {
		if (typeof row.gsx$week != 'undefined') {
			var week = row.gsx$week.$t;
			return week.toLowerCase();
		}
		return false;
	},

	"getMaxFromRow" : function (row) {
		var max = 0;
		var val;
		for (idx in row) {
			if (~idx.indexOf("gsx$")) {
				val = parseFloat(row[idx].$t);
				if (val > max) max = val;
			}
		}
		return max;
	},

	"getMinFromRow" : function (row) {
		var min = 99999999;
		var val;
		for (idx in row) {
			if (~idx.indexOf("gsx$")) {
				val = parseFloat(row[idx].$t);
				if (val < min) min = val;
			}
		}
		return min;
	},

	"weeklySources" : function (input, weekname) {
		var data = { "sources" : {} }
		var rows = input.feed.entry;

		for (rowkey in rows) {
			var row = rows[rowkey];
			var week = transformer.getWeekFromRow(row);

			if (week == weekname) {

				var site = row.gsx$site.$t;
				var name = row.gsx$name.$t;
				var url = row.gsx$url.$t;
				var date = row.gsx$date.$t;

				data.sources[site] = {
					"site" : site,
					"name" : name,
					"url" : url,
					"date" : date
				};
			}
		}

		return data;
	},

	"weeklyRankings" : function (input, weekname) {

		var data = { }
		var rows = input.feed.entry; // rows in the weekly summary sheet

		for (rowkey in rows) {

			// each row is a specific measure for a specific week

			var row = rows[rowkey];
			var week = transformer.getWeekFromRow(row);
			if (week === false) continue;

			// only get the requested week

			if (weekname != week)
				continue;

			var measure = row.gsx$measure.$t;

			delete row.gsx$week;
			delete row.gsx$measure;
			var max = transformer.getMaxFromRow(row);
			var min = transformer.getMinFromRow(row);
			measure = measure.toLowerCase();

			// go through each column (aka team)

			for (idx in row) {
				if (~idx.indexOf("gsx$")) { // our cell values are prefixed with gsx$

					var team = idx.substr(4);
					var val = parseFloat(row[idx].$t);

					if (typeof data[team] == "undefined") data[team] = { "team" : team }
					data[team][measure] = val;

					if (val == max) {
						data[team]["max_" + measure] = true
					}

					if (val == min) {
						data[team]["min_" + measure] = true
					}
				}
			}
		}

		// calculate the sort order (rank w/ stdev)

		var rankeddata = { }
		for (idx in data) {
			var rank = data[idx].rank + (data[idx].stdev/100);
			rankeddata[rank] = data[idx];
		}
		delete data;

		// sort the list

		var sorted = { "teams" : {} }
		Object.keys(rankeddata).sort(transformer.sortNumber).forEach(function(key) {
			sorted.teams[key] = rankeddata[key];
		});
		delete rankeddata;

		return sorted;
	}
}
