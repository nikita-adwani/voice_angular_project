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
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        );

        let input = (req.url.split("/"))[1];

        console.log(input, req.url)
        let filteredData = [];
        let mappedData = [];
        //const studentData = studentsData.getStudentDetail;
        if (studentsData || studentsData.getStudentDetail) {
            filteredData = studentsData.getStudentDetail.filter(function(item) {
                if (item.FirstName === input) {
                    // let returnObj = {
                    //     contactNumber: item.StudentsContactNo,
                    //     dob: item.dob,
                    //     father: item.Fathers_name,
                    //     fatherContactNumber: item.FathersContactNo,
                    //     firstName: item.FirstName,
                    //     gender: item.Gender,
                    //     id: item.MasterId,
                    //     imageName: item.ImgName,
                    //     lastName: item.Last_name,
                    //     year: item.Year
                    // }
                    return filteredData;
                }
                console.log(filteredData);
            });
            mappedData = filteredData.map(function(items) {
                return {
                    contactNumber: items.StudentsContactNo,
                    dob: items.dob,
                    father: items.Fathers_name,
                    fatherContactNumber: items.FathersContactNo,
                    firstName: items.FirstName,
                    gender: items.Gender,
                    id: items.MasterId,
                    imageName: items.ImgName,
                    lastName: items.Last_name,
                    year: items.Year
                }

            });

            // res.write(JSON.stringify(mappedData));

        }
        if (mappedData.length > 1) {
            // res.write("hii");
            let responseObj = {
                type: "studentData",
                speech: "I found more than 1, " + input + ", which one do you want",
                data: mappedData
            }
            res.write(JSON.stringify(responseObj));
            console.log("hii")
        } else {

            res.write(JSON.stringify(errorObject));
        }

        res.end(); //end the response  
    })

.listen(8081); //the server object listens on port 8081