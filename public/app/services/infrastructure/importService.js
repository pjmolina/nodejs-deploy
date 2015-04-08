angular.module('myApp').service('ImportService', ['MetadataService', 'CsvService', 'XlsxService', '$q', '$http', function(MetadataService, CsvService, XlsxService, $q, $http) {
	var ImportService = {};

	var FileSizeLimit = 20 * 1024 * 1024; //20 Mb
	
	var urlStack = [];

	ImportService.previewData = function (file, className, wsName, candidateRow) {
		var deferred = $q.defer();
		try {
			if (file.size > FileSizeLimit) {
				deferred.reject({ 'error': 'File size limit exceeded. File must be less that 20Mb in size.'});						
			}

			var data = getDataFrom(file, wsName, candidateRow)
			.then(function(data) {

				var data2 = buildData(data, className, wsName, candidateRow);
				
				deferred.resolve(data2);		
			});
		} catch (e) {
			deferred.reject(e);
		}
		return deferred.promise;
	};
	
	function buildData(data, className, wsName, candidateRow) {
		var expectedProperties = MetadataService.getPropertiesFor(className);
		expectedProperties.push("_id");

		var dataHeaders = getHeaders(data, wsName, candidateRow);
		var colsToImport = intersection(expectedProperties, dataHeaders) || [];
		var missingCols = diff(expectedProperties, colsToImport);
		missingCols = missingCols.filter(function(item) {
			if (item == null || item==='') {
				return;
			}
			return item;
		});
		
		var ignoredProperties = diff(dataHeaders, colsToImport);
		
		//rebuild head & lines
		data.headers = dataHeaders;
		data.lines = getDataForHeaders(data, wsName, candidateRow);
		
		data.expectedProperties = expectedProperties;
		data.foundProperties = colsToImport;
		data.missingProperties = missingCols;
		data.ignoredProperties = ignoredProperties;
		return data;
	}
	
	ImportService.selectDataToImport = function(data, className, ws) {
		return buildData(data, className, ws.name, ws.candidateHeaderLine); 
	};
	
	ImportService.importData = function(className, data) {
		var deferred = $q.defer();
		try {
			data.className = className;
			var json =  JSON.stringify(data, null, 2);
			$http.post('/api/import', json)
				.then(function (res) {
					deferred.resolve(res);
				});
		} catch (e) {
			deferred.reject(e);
		}
		return deferred.promise;
	};

	function endsWith(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;	
	}
	
	function getDataFrom(file, wsName, candidateRow) {
		var deferred = $q.defer();
		try {
			if (file != null) {
				if (endsWith(file.name, ".csv")) {
					deferred.resolve(CsvService.getDataFrom(file, candidateRow));
				}
				if (endsWith(file.name, ".xlsx")) {
					deferred.resolve(XlsxService.getDataFrom(file, wsName, candidateRow));
				}
			}
		} catch (e) {
			deferred.reject(e);
		}
		return deferred.promise;
	}
	//get headers from first row
	function getHeaders(data, wsName, candidateRow) {
		var res = [];
		var worksheet = selectWorksheet(data, wsName);
		var headerRow = candidateRow || worksheet.candidateHeaderLine || 0;

		var row = worksheet.rows[headerRow];
		
		if (row == null) {
			return [];
		}

		for(var i in row.cells) {
			var cellData = row.cells[i];
			if (cellData!=null && cellData!=='') {
				var calcIdentifier = buildColumnName(toPascal(cellData));
				res.push(calcIdentifier);
			}
		}		
		return res;
	}

	function buildColumnName(candidate) {
		return toCamel(sanitizeIdentifier(toPascal(candidate)));
	}
	
	function sanitizeIdentifier(candidate) {
		//todo
		if (candidate == null) {
			return null;
		}
		if (isNumber(candidate)) {
			candidate = "N"+candidate;
		}
		var str = candidate.replace(/\s+/g, ''); //remove spaces
		str = str.replace(/[^a-zA-Z0-9.-]/g, '_'); //replace illegal chars with "_"
		return str;
	}
	function toPascal(input) {
		if (input == null) {
			return null;
		}
		var s = input.toString().replace(/(\w)(\w*)/g, function(g0,g1,g2) {	
			return g1.toUpperCase() + 
			       ( isAllCaps(g2) ? g2.toLowerCase() : g2 );
		});
		return s;
	}
	function isAllCaps(text) {
		return ! /[a-z]/g.test(text);
	}


	function toCamel(input) {
		if (input == null) {
			return null;
		}
		var s = input.toString().replace(/(\w)(\w*)/g, function(g0,g1,g2) {	
			return g1.toLowerCase() + g2;
		});
		return s;
	}
	
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	function getDataForHeaders(data, wsName, candidateRow) {
		var res = [];
		var worksheet = selectWorksheet(data, wsName);
		var headerRow = candidateRow || worksheet.candidateHeaderLine || 0;

		for(var i in worksheet.rows) {
			if (i <= headerRow) {
				continue; //skip rows over the header
			}
			var row = worksheet.rows[i];
			res.push(row);
		}		
		return res;
	}
	
	function selectWorksheet(data, name) {
		if (name !== undefined) {
			for(var index in data.workSheets) {
				var item = data.workSheets[index];
				if (item.name == name) {
					return item;
				}
			}
		}
		if (data.workSheets && data.workSheets.length > 0) {
			return data.workSheets[0];
		}
		return null;
	}
	
	function cloneArrayToLowerCase(array) {
		var res = [];
		array.forEach(function(item) {
			res.push(item.toLowerCase());
		});
		return res;
	}
	
	//lowerCase  intersection a1  a2
	function intersection(a1, a2) {
		var copy = cloneArrayToLowerCase(a2);
		var res = a1.filter(function(item) {
			return copy.indexOf(item.toLowerCase()) != -1;
		});
		return res;
	}
	//lowerCase diff a1  a2
	function diff(a1, a2) {
		var copy = cloneArrayToLowerCase(a2);
		var res = a1.filter(function(item) {
			return (copy.indexOf(item.toLowerCase()) <= -1);
		});
		return res;
	}
	
	return ImportService;
}]);