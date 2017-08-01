var transformer = {

	"sortNumber" : function (a,b) {
		return a - b;
	},

	"getweekfromrow" : function (row) {
		var week = row["gsx$week"]['$t'];
		return week.toLowerCase();
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
			var measure = row["gsx$measure"]['$t']; delete row["gsx$measure"];
			var week = transformer.getweekfromrow(row); delete row["gsx$week"];
			measure = measure.toLowerCase();

			// only get the requested week

			if (weekname != week)
				continue;

			// go through each column (aka team)

			for (idx in row) {
				if (~idx.indexOf("gsx$")) { // our cell values are prefixed with gsx$
					var team = idx.substr(4);
					if (typeof data[team] == "undefined") data[team] = { "team" : team }
					data[team][measure] = parseFloat(row[idx]['$t']);
				}
			}
		}

		// sort each team entry by rank

		var rankeddata = { }
		for (idx in data) {
			var rank = data[idx]['rank'] + (data[idx]['stdev']/1000);
			rankeddata[rank] = data[idx];
		}

		var sorted = { "teams" : {} }
		Object.keys(rankeddata).sort(transformer.sortNumber).forEach(function(key) {
			sorted['teams'][key] = rankeddata[key];
		});

		return sorted;
	}
}
