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
      // var searchItem;
      // if (searchItem == "alpha") {
      let searchName = req.url.split("/")[1];
      // }
      //else if (searchItem == "numeric") {
      //     let searchId = (req.url.split("/"))[3];
      // }

      console.log(searchName, req.url);
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
        filteredData = studentsData.getStudentDetail.filter(function(item) {
          if (
            searchName.includes(item.FirstName.trim().toLowerCase()) ||
            searchName.includes(item.Last_name.trim().toLowerCase())
          ) {
            console.log(filteredData);
            return filteredData;
          }
        });

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
          speech:
            "I found " +
            mappedData.length +
            " " +
            searchName +
            ". Choose whoes details you want.",
          data: mappedData
        };

        res.write(JSON.stringify(responseObj));
        // console.log("hii")
      } else if (mappedData.length === 1) {
        let resObj = {
          type: "studentData",
          speech:
            "I found " +
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

  .listen(8081); //the server object listens on port 8081s
