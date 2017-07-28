var transformer = {
	"weekly" : function (input, sortmeasure) {

		var data = {}
		var rows = input.feed.entry; // rows in the weekly summary sheet

		for (rowkey in rows) {

			var row = rows[rowkey];
			var measure = row["gsx$measure"]['$t']; delete row["gsx$measure"];
			var week = row["gsx$week"]['$t']; delete row["gsx$week"];

			measure = measure.toLowerCase();
			week = week.toLowerCase();

			if (typeof data[week] == "undefined") data[week] = {}

			for (idx in row) {

				if (~idx.indexOf("gsx$")) { // our values are prefixed with gsx$ for some reason
					var team = idx.substr(4);
					if (typeof data[week][team] == "undefined") data[week][team] = {"team":team}
					data[week][team][measure] = parseFloat(row[idx]['$t']);
				}
			}
		}

		return data;
	}
}
