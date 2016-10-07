var express = require('express'); 
var app = express();
var bodyParser = require('body-parser'); 
var oracledb = require('oracledb');

app.use(bodyParser.json());

var connAttrs = {
    "user": "dti",
    "password": "dti",
    "connectString": "192.168.40.47/xe"
}

app.use(express.static("public"));

app.get('/api/documentos_tacna_inicio', function (req, res) {
    oracledb.getConnection(connAttrs, function (err, connection) {
        connection.execute(
            "BEGIN PKG_ELECTRONICA.documentos_all(:resultado); END;",
            { 
                resultado: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } 
            },
            function (err, result) {                
                result.outBinds.resultado.getRows(
                    100,
                    function(err, rows){
                        res.contentType('application/json').send(JSON.stringify(rows));
                    }
                )                                                        
            }
        );
    });    
});



app.get('/api/ver_documento/:doc', function (req, res) {
    oracledb.getConnection(connAttrs, function (err, connection) {
        connection.execute(
            "BEGIN pkg_electronica.factura_servicios(:doc, :resultado); END;",
            {
                doc: req.params.doc, 
                resultado: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } 
            },
            function (err, result) {
                result.outBinds.resultado.getRows(
                    100,
                    function(err, rows){
                        res.contentType('application/json').send(JSON.stringify(rows));
                    }
                )                                                        
            }
        );
    });    
});






// configuracion del servidor
var server = app.listen(3000, function () {    
    var host = server.address().address,
        port = server.address().port;
    console.log(' Server is listening at http://%s:%s', host, port);
});