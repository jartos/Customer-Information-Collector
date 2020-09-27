 var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'restUser',      
    password: '<SecretPassword>',
    database: 'Customer'
});

module.exports = {

    fetch: (req, res) => {
       
    
        let params = [];
        console.log("/asiakas. REQ:", req.query);

        let query = "SELECT a.AVAIN, a.NIMI, a.OSOITE, a.POSTINRO, a.POSTITMP, DATE_FORMAT(DATE(LUONTIPVM), ' %d.%m.%Y') as LUONTIPVM, a.ASTY_AVAIN, asty.SELITE FROM Customer.asiakas a JOIN Customer.asiakastyyppi asty ON a.ASTY_AVAIN = asty.AVAIN WHERE 1=1";
        if (req.query.nimi != null) {
            
            query = query + " AND a.NIMI like ? '%'" ;
            params.push(req.query.nimi);
        }
        if (req.query.osoite != null) {
            
            query = query + " AND a.OSOITE like ? '%'";
            params.push(req.query.osoite);
        }
        if (req.query.asiakastyyppi != null) {
            
            query = query + " AND asty.SELITE like ? ";
            params.push(req.query.asiakastyyppi);
        }
    
        console.log("query:" + query);
        connection.query(query, params, function (error, result, fields) {
    
            if (error) {
                console.log("Virhe", error);
                res.statusCode = 400;
                res.json({ status: "NOT OOKOO", msg: "Tekninen virhe!" });
            }
            else {
                res.statusCode = 200;
                //res.json(result);
                res.json({ status: "OK", msg: "", response: result })
            }
        });
    },

    create: (req, res) => {

        console.log("CREATE: ", req.body);
    
        let q = "INSERT INTO asiakas (AVAIN, NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES(99, 'Jeppe J', 'Snellmanninkatu 1 A', 70100, '2019-12-12', 99 )";
    
        console.log("query:" + q);
        connection.query(q, [req.body.AVAIN, req.body.NIMI, req.body.OSOITE, req.body.POSTINRO, req.body.POSTITMP, req.body.LUONTIPVM, req.body.ASTY_AVAIN], function (error, result, fields) {
    
            if (error) {
                console.log("Virhe", error);
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Tekninen virhe" });
            }
            else {
                res.statusCode = 201;
                console.log("RESULT:", result);
                res.json({ avain: result.insertId, lyhenne: req.body.lyhenne, selite: req.body.selite })
            }
        });
    },    

    updateType : (req, res) => {               

        console.log("UPDATE: ", req.body);
        console.log("params: ", req.params);
    
        let q = "UPDATE asiakastyyppi set LYHENNE = ?, SELITE = ? WHERE AVAIN = ?";
    
        console.log("query:" + q);
        if (req.body.lyhenne == null) {
            console.log("Lyhenne kenttÃ¤ oli tyhjÃ¤");
        }
    
        connection.query(q, [req.body.lyhenne, req.body.selite, req.params.avain], function (error, result, fields) {
    
            if (error) {
                console.log("Virhe", error);
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Tekninen virhe" });
            }
            else {
                res.statusCode = 204;
                console.log("RESULT:", result);
                res.json()
            }
        });
    },
    
    deleteType: function (req, res) {


        console.log("DELETE params: ", req.params);

        let q = "DELETE FROM asiakastyyppi WHERE AVAIN = ?";

        console.log("query:" + q);

        connection.query(q, [req.params.avain], function (error, result, fields) {

            if (error) {
                console.log("Virhe", error);
                res.statusCode = 400;   // 400, 500
                res.json({ status: "NOT OK", msg: "Tekninen virhe" });
            }
            else {
                res.statusCode = 204;
                console.log("RESULT:", result);
                res.json()
            }
        });
    }
}
