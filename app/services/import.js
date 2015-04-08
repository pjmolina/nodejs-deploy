var Q = require('q');
var models = require('../model');
var xlsx = require('xlsx');

var importData = function(req, res) {   
  try {
    
    var result = {
      'errors' : []
    };
    var importedCreated = 0;
    var importedUpdated = 0;
    var headers = req.body.headers;
    var model = models.getModelForClass(req.body.className);
    if (!model) {
      res.status(400).send('Invalid class for import: ' + req.body.className);
      return;
    }
    var promises = req.body.lines.map(function(row){

        var id = getId(headers, row);
        if (id) {
          var updateFields = buildUpdateFields(headers, row);
          return Q.nfcall(updateEntity, model, id, updateFields)
          .then(function (entity) {
            if (entity) {
              importedUpdated++;
            }
            else {
              var fields = buildUpdateFields(headers, row);
              //try to include id:
              fields._id = id;
              return Q.nfcall(createEntity, model, fields)
              .then(function (entity) {
                importedCreated++;
              })
              .fail(function (err) {
                result.errors.push({
                  'line': row.line, 
                  'error': err
                });
              });             
            }
          })
          .fail(function (err) {
            result.errors.push({
              'line': row.line, 
              'error': err
            });
          });
        }
        else {
          var fields = buildUpdateFields(headers, row);
          return Q.nfcall(createEntity, model, fields)
          .then(function (entity) {
            importedCreated++;
          })
          .fail(function (err) {
            result.errors.push({
              'line': row.line, 
              'error': err
            });
          });
        }
    });
    
    Q.all(promises)
    .then(function(obj) { 
      result.importedCount = importedUpdated + importedCreated; 
      result.insertCount = importedCreated; 
      result.updatedCount = importedUpdated; 
      res.status(200).send(result);
    })
    .fail(function(err) { 
      console.log('import: failed ' + err); 
      result.importedCount = importedUpdated + importedCreated; 
      result.insertCount = importedCreated; 
      result.updatedCount = importedUpdated; 
      res.status(200).send(result);
    });

  }
  catch (e) {
    res.status(400).send('Invalid request. ' + e);
    console.error(e); 
    return;     
  }
};

function updateEntity(model, id, updateFields, callback){
  model.findByIdAndUpdate(id, updateFields, null, function(err, entity) {
    callback(err, entity);
  });
}

function createEntity(model, updateFields, callback){
  model.create(updateFields, function(err, entity) {
    callback(err, entity);
  });
}

function getId(headers, row) {
  for(var index in headers){
    var head = headers[index];
    if (head == '_id') {
      var data = row.cells[index];
      if (data === '' || data == null) {
        return null;
      }
      return data;
    }
  }
  return null;
}

function buildUpdateFields(headers, row) {
  var updateFields= {};
  for(var index in headers){
    var head = headers[index];
    if (head == '_id') {
      continue;
    }
    updateFields[head] = row.cells[index];
  }
  return updateFields;
}

//transfer properties: dto to entity. skipping _id
function transferFields(entity, headers, data) {  
  for(var i=0; i<=headers.length; i++){
    var head = headers[i];
    if (head=='_id') {
      continue;
    }
    entity[head] = data[i];
  }
  return entity;
}

function apply(app) {

    app.post('/api/import', function(req, res) {
        return importData(req, res);
    });

}

module.exports.apply = apply;