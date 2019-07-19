var http = require("http");
const fs = require("fs");

const soundsLike = require("./soundslike");

let studentsData = [];
let errorObject = {
    type: "studentData",
    speech: "The details you were looking for was not found"
};

function hideNumber(items) {
    if (items.Gender === "Male" || items.Gender === "male") {
        return items.StudentsContactNo;
    } else var str = items.StudentsContactNo.replace(/\d(?=\d{4})/g, "*");
    return str;
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
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        );

        if (req.url !== "/favicon.ico") {
            let searchName = req.url.split("/")[1];
            let filteredData = [];
            let mappedData = [];

            //matching anything in the sounds like then use the name and compare
            let foundSoundsLike = soundsLike.words.filter(soundItem => {
                if (soundItem.similarSound.includes(searchName.trim().toLowerCase())) {
                    return soundItem;
                }
            });

            if (foundSoundsLike.length > 0) {
                searchName = foundSoundsLike[0].name;
            }

            if (studentsData || studentsData.getStudentDetail) {
                let numericParams = Number(searchName);

                if (isNaN(numericParams)) {
                    filteredData = findByName(searchName, studentsData.getStudentDetail);
                } else {
                    filteredData = findById(searchName, studentsData.getStudentDetail);
                }
                mappedData = filteredData.map(function(items) {
                    return {
                        contactNumber: hideNumber(items),
                        dob: items.dob,
                        father: items.Fathers_name,
                        fatherContactNumber: items.FathersContactNo,
                        firstName: items.FirstName,
                        gender: items.Gender.toLowerCase(),
                        id: items.MasterId,
                        imageName: items.ImgName,
                        lastName: items.Last_name,
                        year: items.Year
                    };
                });
            }

            if (mappedData.length > 1) {
                let responseObj = {
                    type: "studentData",
                    speech: "I found " +
                        mappedData.length +
                        " " +
                        searchName +
                        ". Choose whoes details you want.",
                    data: mappedData
                };

                res.write(JSON.stringify(responseObj));
            } else if (mappedData.length === 1) {
                let resObj = {
                    type: "studentData",
                    speech: "I found " +
                        mappedData.length +
                        " Student named: " +
                        mappedData[0].firstName +
                        " " +
                        mappedData[0].lastName,
                    data: mappedData
                };
                res.write(JSON.stringify(resObj));
            } else {
                res.write(JSON.stringify(errorObject));
            }
            var url = req.url;

            res.end(); //end the response
        }
    })

.listen(8081); //the server object listens on port 8081

function findByName(searchName, studentDetail) {
    return studentDetail.filter(function(item) {
        if (searchName.includes(item.FirstName.trim().toLowerCase()) || searchName.includes(item.Last_name.trim().toLowerCase())) {
            return item;
        }
    })

}

function findById(searchName, studentDetail) {
    return studentDetail.filter(function(item) {
        if (searchName.includes(item.MasterId)) {
            return item;
        }
    })

}