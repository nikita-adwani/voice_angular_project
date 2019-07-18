var http = require("http");
const fs = require("fs");

let studentsData = [];
let errorObject = {
    type: "studentData",
    speech: "The details you were looking for was not found",

}

function hideNumber(items) {
    if (items.Gender === "Male") {
        return items.StudentsContactNo;
    } else
        return ("nhi dena")
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
        similarSound: ["akash", "aakash"]
    }, {
        name: ["akshata"],
        similarSound: ["akshita"]
    }, {
        name: ["ameen"],
        similarSound: ["amin"]
    }, {
        name: ["angoori", "anguri"],
        similarSound: ["anguri", "angoori", "hungary"]
    }, {
        name: ["aprajita"],
        similarSound: ["aparajita"]
    }, {
        name: ["arbaz"],
        similarSound: ["arbaaz"]
    },
    {
        name: ["adwani"],
        similarSound: ["advani"]
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

                if ((searchName.includes(((item.FirstName).trim()).toLowerCase())) ||
                    (searchName.includes(((item.Last_name).trim()).toLowerCase()))) {

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

.listen(8081); //the server object listens on port 8081s