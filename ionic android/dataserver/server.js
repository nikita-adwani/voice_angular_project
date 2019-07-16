var http = require("http");
const fs = require("fs");

let studentsData = [];
let errorObject = {
    error: "Not Found",
    msg: "The details you were looking for was not found"
}
fs.readFile("./studentData.json", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let rawdata = data;
    studentsData = JSON.parse(rawdata);
});
//create a server object:
http
    .createServer(function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        );

        let input = (req.url.split("/"))[1];

        console.log(input, req.url)
        let filteredData = []
            //const studentData = studentsData.getStudentDetail;
        if (studentsData && studentsData.getStudentDetail) {
            filteredData = studentsData.getStudentDetail.filter(function(item) {
                if (item.FirstName === input) {
                    let returnObj = {
                        contactNumber: item.StudentsContactNo,
                        dob: item.dob,
                        father: item.Fathers_name,
                        fatherContactNumber: item.FathersContactNo,
                        firstName: item.FirstName,
                        gender: item.Gender,
                        id: item.MasterId,
                        imageName: item.ImgName,
                        lastName: item.Last_name,
                        year: item.Year
                    }

                    return returnObj;
                }
            });

            res.write(JSON.stringify(filteredData));

        } else {
            res.write(JSON.stringify(errorObject));
        }
        res.end(); //end the response
    })
    .listen(8081); //the server object listens on port 8080