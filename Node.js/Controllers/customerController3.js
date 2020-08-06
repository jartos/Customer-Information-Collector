var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'restUser',      
    password: 'restUser123!',
    database: 'Customer',
    dateStrigns: true
});

module.exports = {

    fetch: (req, res) => {  
       
    
        let params = [];
        console.log("/asiakas. REQ:", req.query);

        let query = "SELECT a.AVAIN, date_format(MUUTOSPVM, '%T %d.%m.%Y') as MUUTETTUMUUTOSPVM, MUUTOSPVM, a.NIMI, a.OSOITE, a.POSTINRO, a.POSTITMP, DATE_FORMAT(DATE(LUONTIPVM), ' %d.%m.%Y') as LUONTIPVM, ASTY_AVAIN, asty.SELITE FROM Customer.asiakas a JOIN Customer.asiakastyyppi asty ON a.ASTY_AVAIN = asty.AVAIN WHERE 1=1";
        
        if (req.query.avain != null) {
            
            query = query + " AND a.AVAIN like ?" ;
            params.push(req.query.avain);
        
        }
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
        if (req.query.nimi == 99999){
            res.statusCode = 202;
            res.json({ status: "Virhe", msg:"Checkbox ruksattu"});
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
        

        let q = "INSERT INTO asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES(?, ?, ?, ?, ?, ?)";
    
      
        if (req.body.NIMI == "") {                                     
            
            res.json({ status: "NOT OK", msg: "Nimi puuttuu" });
        }
        if (req.body.OSOITE == "") {
            
            res.json({ status: "NOT OK", msg: "Osoite puuttuu" });
        }
        if (req.body.POSTINRO == "") {
            
            res.json({ status: "NOT OK", msg: "Postinumero puuttuu" });
        }
        if (req.body.POSTITMP == "") {
            
            res.json({ status: "NOT OK", msg: "Postitoimipaikka puuttuu" });
        }
        if (req.body.LUONTIPVM == "") {
            
            res.json({ status: "NOT OK", msg: "Luontipvm puuttuu" });
        }
        if (req.body.ASTY_AVAIN == "") {
            
            res.json({ status: "NOT OK", msg: "Asty_avain puuttuu" });
        }


        if (req.body.NIMI != "" & req.body.OSOITE != "" & req.body.POSTINRO != "" & req.body.POSTITMP != "" & req.body.LUONTIPVM != "" & req.body.ASTY_AVAIN != ""){

        console.log("query:" + q);
        connection.query(q, [req.body.NIMI, req.body.OSOITE, req.body.POSTINRO, req.body.POSTITMP, req.body.LUONTIPVM, req.body.ASTY_AVAIN], function (error, result, fields) {
    
            if (error) {
                console.log("Virhe", error);
                res.statusCode = 200;   // 400, 500
                res.json({ status: "NOT OK", msg: "Lisäys epäonnistui" });
            }
            else {
                res.statusCode = 201;
                console.log("RESULT:", result);
                res.json({ avain: result.insertId, status: "OK", msg: "Lisätty" })
            }
        
        });
    }
    },    

    update : (req, res) => {

        console.log("UPDATE params: ", req.body.avain);
        console.log("params: ", req.params);
    
        let q = "UPDATE Customer.asiakas SET NIMI = ?, OSOITE = ?, POSTINRO = ?, POSTITMP = ?, LUONTIPVM = ?, ASTY_AVAIN = ?, MUUTOSPVM = ? WHERE AVAIN = ?;"
    
        console.log("query:" + q);
        if (req.body.avain == null) {
            console.log("Ei avainta");
        }
    
        connection.query(q, [req.body.NIMI, req.body.OSOITE, req.body.POSTINRO, req.body.POSTITMP, req.body.LUONTIPVM, req.body.ASTY_AVAIN, req.body.MUUTOSPVM, req.body.avain], function (error, result, fields) {
    
            if (error) {
                console.log("Virhe", error);
                res.statusCode = 400;   // 400, 500
                res.json({ status: "NOT OK", msg: "Tekninen virhe" });
            }
            else {
                res.statusCode = 200;
                console.log("RESULT:", result);
                res.json({ status: "OK", msg: "UPDATED"})
            }
        });
    },
    deleteType : function (req, res) {


        console.log("DELETE params: ", req.body.avain);

        let q = "DELETE FROM Customer.asiakas WHERE AVAIN = ?";

        console.log("query:", q);

        connection.query(q, [req.body.avain], function (error, result, fields) {

            if (error) {
                console.log("Virhe", error);        
                res.statusCode = 400;   // 400, 500
                res.json({ status: "DELETE FAIL", msg: "ERROR" });
            }

            if (result.affectedRows == 0){
                res.statusCode = 404;
                res.json({ status: "DELETE FAILED", msg: "ASIAKASTA EI LÖYDY" });
            }

            else {
                res.statusCode = 200;
                console.log("RESULT:", result);
                res.json({ status: "OK", msg: "Poistettu"})
            }
        });
    }
}