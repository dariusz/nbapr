var transformer = {

	"sortNumber" : function (a,b) {
		return a - b;
	},

	"getweekfromrow" : function (row) {
		var week = row["gsx$week"]['$t'];
		return week.toLowerCase();
	},

	"getmaxfromrow" : function (row) {
		var max = 0;
		var val;
		for (idx in row) {
			if (~idx.indexOf("gsx$")) {
				val = parseFloat(row[idx]['$t']);
				if (val > max) max = val;
			}
		}
		return max;
	},

	"getminfromrow" : function (row) {
		var min = 99999999;
		var val;
		for (idx in row) {
			if (~idx.indexOf("gsx$")) {
				val = parseFloat(row[idx]['$t']);
				if (val < min) min = val;
			}
		}
		return min;
	},

	"weeklysources" : function (input, weekname) {
		var data = { "sources" : {} }
		var rows = input.feed.entry;

		for (rowkey in rows) {
			var row = rows[rowkey];
			var week = transformer.getweekfromrow(row);

			if (week == weekname) {
				var site = row['gsx$site']['$t'];
				var name = row['gsx$name']['$t'];
				var url = row['gsx$url']['$t'];
				var date = row['gsx$date']['$t'];
				data['sources'][site] = {
					"site" : site,
					"name" : name,
					"url" : url,
					"date" : date
				};
			}
		}

		return data;
	},

	"weeklyrankings" : function (input, weekname) {

		var data = { }
		var rows = input.feed.entry; // rows in the weekly summary sheet

		for (rowkey in rows) {

			// each row is a specific measure for a specific week

			var row = rows[rowkey];
			var week = transformer.getweekfromrow(row); delete row["gsx$week"];

			// only get the requested week

			if (weekname != week)
				continue;

			var measure = row["gsx$measure"]['$t']; delete row["gsx$measure"];
			var max = transformer.getmaxfromrow(row);
			var min = transformer.getminfromrow(row);
			measure = measure.toLowerCase();

			// go through each column (aka team)

			for (idx in row) {
				if (~idx.indexOf("gsx$")) { // our cell values are prefixed with gsx$

					var team = idx.substr(4);
					var val = parseFloat(row[idx]['$t']);

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
			var rank = data[idx]['rank'] + (data[idx]['stdev']/1000);
			rankeddata[rank] = data[idx];
		}
		delete data;

		// sort the list

		var sorted = { "teams" : {} }
		Object.keys(rankeddata).sort(transformer.sortNumber).forEach(function(key) {
			sorted['teams'][key] = rankeddata[key];
		});
		delete rankeddata;

		return sorted;
	}
}
