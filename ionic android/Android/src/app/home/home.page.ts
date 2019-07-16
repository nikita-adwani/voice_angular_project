import { Component } from "@angular/core";
import { DataServiceService } from "src/app/services/dataService.service";

import { Animation } from "@ionic/core";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  window: any = window;
  webkitSpeechRecognition: any;

  public intentTypes:any;

  resultDiv = document.getElementById("result");

  constructor(public dataService: DataServiceService) {
    this.intentTypes = [
        {
          intent: "helloIntent",
          input: [
            "Hi",
            "hi",
            "hello",
            "hola",
            "hey",
            "namaste",
            "salam",
            "salaam",
            "bonjour",
            "konichiwa",
            "konnichiwa",
            "ola"
          ],
          response: "Hello! How can i help you?"
        },
        {
          intent: "byeIntent",
          input: ["Bye", "bye", "see you", "tata", "see you", "goodbye"],
          response: "Bye!, take care, have a nice day."
        },
        {
          intent: "detailIntent",
          input: ["give", "details", "student", "named", "what", "name", "who"],
          response: "Give me a second. I think you are looking for "
        }
      ]
      console.log(this.intentTypes)

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
   // this.getStudentDetials();
  }

  getStudentDetials() {
    const input = "Nikita";
    this.dataService.getStudentDetails(input).subscribe(res => {
      console.log(res);
    });
  }

  startConversing() {
      let classThis = this;
    // 'speak.this("Hii, I am Databot . I am here to help you. you can talk to me now.")';
    // saySomething.this.speak("Hii, I am Databot . I am here to help you. you can talk to me now.");
    if ("webkitSpeechRecognition" in window) {
      var speechRecognizer = new webkitSpeechRecognition();
      speechRecognizer.continuous = true; //Controls whether continuous results are returned for each recognition, or only a single result.
      speechRecognizer.interimResults = true; //Controls whether interim results should be returned (true) or not (false.) Interim results are results that are not yet final
      speechRecognizer.lang = "en-IN";
      speechRecognizer.start();

      this.startButtonAnimation("micButton");
      var finalTranscripts = "";

      speechRecognizer.onresult = function(event) {
        console.log("im here", event);
        var interimTranscripts = "";
        for (var i = event.resultIndex; i < event.results.length; i++) {
          var transcript = event.results[i][0].transcript;

          console.log("the transcript =", transcript);

          // Break the transcript into words - its a sentence
          let inputWords = transcript.split(" ");
          console.log("inputWords", inputWords);

          let foundIntent = [];
          console.log(classThis.intentTypes)
          foundIntent = classThis.getIntent(inputWords, classThis.intentTypes);
          console.log(foundIntent);

          // transcript.replace("\n", "<br>");
          if (event.results[i].isFinal && foundIntent.length) {
            console.log(foundIntent);
            let replyIntent = Array.from(foundIntent);
            console.log(replyIntent);
            let studentName = "";
            if (
              replyIntent.length > 0 &&
              replyIntent[0].intent === "detailIntent"
            ) {
              studentName = classThis.getStudentName(inputWords);
              // ---- check yesterday code
              let text = "";
            }

            var speechresult = replyIntent[0].response + studentName;
            console.log(speechresult);
            classThis.saySomething(speechresult);

            console.log("stop");
            classThis.stopButtonAnimation("micButton");
            speechRecognizer.stop();
          } else {
            interimTranscripts += transcript;
          }
        }
        // this.resultDiv.innerHTML =
        //   finalTranscripts +
        //   '<span style="color:#999">' +
        //   interimTranscripts +
        //   "</span>";
      };

      speechRecognizer.onerror = function(event) {};
    } else {
      this.resultDiv.innerHTML =
        "Your browser is not supported. If google chrome, please upgrade!";
    }
  }

  saySomething(speechresult) {
    let msg = new SpeechSynthesisUtterance(speechresult);
    setTimeout(() => {
      console.log(window.speechSynthesis.getVoices());

      let voices = window.speechSynthesis.getVoices();

      msg.voice = voices[8]; // try changing the number and hear different voices.
      // msg.voiceURI = "native";
      msg.volume = 1; // 0 to 1
      msg.rate = 1; // 0.1 to 10
      msg.pitch = 0; //0 to 2

      console.log(speechresult);
      window.speechSynthesis.speak(msg);
    }, 500);
  }

  getIntent(inputWords, intentTypesArray) {
    let currentIntent = [];
    intentTypesArray.forEach(intentType => {
      let lowerInputWords = inputWords.map(word => word.toLowerCase());
      console.log(intentType.input, lowerInputWords);
      let found = intentType.input.find(val =>
        lowerInputWords.includes(val.toLowerCase())
      );

      if (found !== undefined) {
        let tempIntent = Object.assign({}, intentType);
        if (tempIntent.intent === "helloIntent") {
          tempIntent["response"] = tempIntent["response"].replace(
            "Hello",
            found
          );
          console.log("found", found, tempIntent);
        } else if (tempIntent.intent === "byeIntent") {
          tempIntent["response"] = tempIntent["response"].replace("Bye", found);
          console.log("found", found, tempIntent);
        }
        currentIntent.push(tempIntent);
      }
    });
    return currentIntent;
  }

  getStudentName(inputWords) {
    //write logic to remove unwanted words to get to the name of the student
    return inputWords[inputWords.length - 1];
  }

  startButtonAnimation(btnId) {
    let btn = document.getElementById(btnId);
    btn.classList.add("mic-animate");
  }

  stopButtonAnimation(btnId) {
    let btn = document.getElementById(btnId);
    btn.classList.remove("mic-animate");
  }
}
