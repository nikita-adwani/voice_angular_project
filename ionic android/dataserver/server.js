var http = require("http");
const fs = require("fs");

let studentsData = [];
let errorObject = {
        // error: "Not Found",
        // msg: "The details you were looking for was not found"
        type: "studentData",
        speech: "The details you were looking for was not found",
        // data: mappedData
    }
    //sounds be same

function hideNumber(item) {
    return item.contactNumber;
}
let soundsLike = [{
        name: ["laveena"],
        similarSound: ["lavina", "raveena", "pavina", "kareena", "salena"],
    }, {
        name: ["suhasee"],
        similarSound: ["suhasi", "suhasni", "saucy", "mausi", "forsee"]
    }, {
        name: ["laxshmi"],
        similarSound: ["lockshmi", "lakshmi"]
    }, {
        name: ["aanchal"],
        similarSound: ["aajchal", "anchal"]
    }, {
        name: ["aashutosh"],
        similarSound: ["ashutosh"]
    }, {
        name: ["aasma"],
        similarSound: ["asma"]
    }, {
        name: ["aayush"],
        similarSound: ["ayush"]
    }, {
        name: ["aayushi"],
        similarSound: ["ayushi"]
    }, {
        name: ["aakash"],
        similarSound: ["akash"]
    }, {
        name: ["akshata"],
        similarSound: ["akshita"]
    }, {
        name: ["ameen"],
        similarSound: ["amin"]
    }, {
        name: ["angoori", "anguri"],
        similarSound: ["anguri", "angoori"]
    }, {
        name: ["aprajita"],
        similarSound: ["aparajita"]
    }, {
        name: ["arbaz"],
        similarSound: ["arbaaz"]
    }

]
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

        let searchName = (req.url.split("/"))[1];

        console.log(searchName, req.url)
        let filteredData = [];
        let mappedData = [];

        //matching anything in the sounds like then use the name and compare
        let foundSoundsLike = soundsLike.filter(soundItem => {
            if (soundItem.similarSound.includes(searchName)) {
                return soundItem;
            }
        });

        if (foundSoundsLike.length > 0) {
            searchName = foundSoundsLike[0].name;
        }


        if (studentsData || studentsData.getStudentDetail) {
            filteredData = studentsData.getStudentDetail.filter(function(item) {

                if (searchName.includes((item.FirstName.trim()).toLowerCase())) {

                    return filteredData;
                }
                console.log(filteredData);
            });
            mappedData = filteredData.map(function(items) {
                return {
                    contactNumber: hideNumber(items),
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



        }
        if (mappedData.length > 1) {

            let responseObj = {
                    type: "studentData",
                    speech: "I found " + mappedData.length + " , " + searchName + ", whose details do you want?",
                    data: mappedData

                }
                // mappedData.forEach(items => {
                //     let speech = items.firstName + " " + items.lastName + ",";
                //     this.saySomething(speech);
                // });

            res.write(JSON.stringify(responseObj));
            // console.log("hii")

        } else if (mappedData.length === 1) {
            let resObj = {
                type: "studentData",
                speech: "I found " + mappedData.length + " Student named , " + mappedData[0].firstName + " " + mappedData[0].lastName,
                data: mappedData
            }
            res.write(JSON.stringify(resObj));
        } else {

            res.write(JSON.stringify(errorObject));
        }

        res.end(); //end the response  
    })

.listen(8081); //the server object listens on port 8081