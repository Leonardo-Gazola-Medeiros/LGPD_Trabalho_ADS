const con = require('../connect/dbconnect')

exports.InsertTerm = async (req,res) => {
    const {version,texto} = req.body;
    const query = 'INSERT INTO termos (version,texto) VALUES (?,?)'
    con.query(query,[version,texto],(error,results) => {
        if(error){
            console.error("Error inserting term: ", error);
            return res.status(500).json({error:'Database error: ' + error.message})
        }
        res.status(201).json({id:results.insertId})
    })
};

exports.getAllTerms = async (req,res) => {
    const query = 'SELECT * FROM termos WHERE version=(SELECT max(version))'
    con.query(query,(error,results) => {
        if(error){
            console.error("Error when get term: ", error);
            return res.status(500).json({error:'Database error: ' + error.message})
        }
        res.status(201).json({id:results.insertId})
    })
};

