var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var dbPath = path.resolve(__dirname, 'scoreboard.db');
console.log(dbPath); // db location in project
var db = sqlite3.Database;
exports.initDB = function () {
    var db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function (err) {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log('Connected to the database');
        }
    });
    db.serialize(function () {
        db.run("DROP TABLE IF EXISTS Scores"); // For testing, remove for persistance
        db.run("CREATE TABLE IF NOT EXISTS Scores (name TEXT, score INTEGER)");
        // Testing code, inserts test values
        var names = ["ld", "bc", "jt", "il"];
        var scores = [1000, 2000, 3000, 4000];
        var stmt = db.prepare("INSERT INTO Scores(name,score) VALUES (?,?)");
        for (var i = 0; i < 4; i++) {
            stmt.run(names[i], scores[i]);
        }
        stmt.finalize();
        console.log("finished initDB");
        ////
        db.close();
    });
};
exports.insertScore = function (n, s) {
    var db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, function (err) {
        if (err) {
            console.error(err.message);
        }
    });
    db.run("INSERT INTO Scores(name,score) VALUES(?,?)", n, s, function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log("inserted: " + n + ", " + s);
    });
    db.close();
};
exports.getScores = function () {
    var db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, function (err) {
        if (err) {
            console.error(err.message);
        }
    });
    db.all("SELECT * FROM Scores ORDER BY score ASC", function (err, row) {
        row.forEach(function (row) {
            console.log(row);
        });
    });
    db.close();
};
// exports.closeDB = function() {
//     db.close((err:any) => {
//         if (err) {
//             console.error(err.message);
//         }
//         console.log('DB connection closed');
//     });
// };
//# sourceMappingURL=dbHelper.js.map