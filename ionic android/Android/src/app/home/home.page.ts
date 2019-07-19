import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { DataServiceService } from "src/app/services/dataService.service";

import { Animation } from "@ionic/core";
import { IWindow } from "../speechInterface";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  window: any = window;
  webkitSpeechRecognition: any;
  mappedData: any;
  showLoader = true;
  public intentTypes: any;
  searchName: any;
  microphone = false;
  // public speak :any;

  mainSpeechRecognizer: any;

  @ViewChild("resultDiv") resultDiv: ElementRef;
  @ViewChild("micButton") micButton: ElementRef;
  dataServiceService: any;
  public getUserDetails: any;

  constructor(
    public dataService: DataServiceService,
    private ref: ChangeDetectorRef
  ) {
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
        input: ["Bye", "bye", "see you", "tata", "seeya", "goodbye"],
        response: "Bye! have a nice day."
      },
      {
        intent: "detailIntent",
        input: [
          "give",
          "details",
          "student",
          "named",
          "what",
          "name",
          "who",
          "information"
        ],
        response: "Give me a second. I think you are looking for "
      },
      {
        intent: "whatIntent",
        input: ["what", "can", "you", "do", "help"],
        response: "I can look up SSIM students by their name."
      }
    ];

    console.log(this.intentTypes);
  }
  ignoreWordsArray = ["give","details","about","all","show","me","the","of", "in", "can", 
                     "please", "tell", "information", "named", "name","what","who","and",
                     "cave","related","to","something","is","not","ignore","detailed","this","that","love",
                     "bla-bla","so","ban","pollusion","behn","bolo","ji","china","informations","detail",
                     "someone","everything","every","profile","us"
  ];
  ngOnInit(): void {}

  getStudentDetails(studentName) {
    let speech = "Sorry!  ";
    this.dataService
      .getStudentDetails(studentName.toLowerCase())
      .subscribe((resObj: any) => {
        let res = resObj;
        this.getUserDetails = resObj.data;
        console.log(this.getUserDetails);
        this.ref.detectChanges();
        this.saySomething(resObj["speech"]);
      });
  }

  startConversing(evt) {
    let classThis = this;
    this.getUserDetails = [];
    this.startSpeechAnimation();
    if ("webkitSpeechRecognition" in window) {
      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      var speechRecognizer = new webkitSpeechRecognition();

      this.mainSpeechRecognizer = speechRecognizer;
      speechRecognizer.continuous = true; //Controls whether continuous results are returned for each recognition, or only a single result.
      speechRecognizer.interimResults = true; //Controls whether interim results should be returned (true) or not (false.) Interim results are results that are not yet final
      speechRecognizer.lang = "en-IN";

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
          console.log(classThis.intentTypes);
          foundIntent = classThis.getIntent(inputWords, classThis.intentTypes);
          console.log(foundIntent);

          if (event.results[i].isFinal && foundIntent.length) {
            speechRecognizer.stop();

            console.log("stop and set checkbox is false");
            classThis.microphone = false;

            console.log(foundIntent);
            let replyIntent = Array.from(foundIntent);
            console.log(replyIntent);
            let studentName = "";
            if (
              replyIntent.length > 0 &&
              replyIntent[0].intent === "detailIntent"
            ) {
              studentName = classThis.getStudentName(inputWords);

              //Call the getStudentDetails function after 4 seconds to allow voice to complete speech.
              setTimeout(() => {
                classThis.getStudentDetails(studentName);
              }, 4000);
              console.log("im here - after calling getStudentDetails");
            }

            var speechresult = replyIntent[0].response + studentName;
            console.log(speechresult);
            classThis.resultDiv.nativeElement.innerHTML = speechresult;
            classThis.saySomething(speechresult);
          } else {
            interimTranscripts += transcript;
          }
        }
        classThis.resultDiv.nativeElement.innerHTML =
          finalTranscripts +
          '<span style="color:#999">' +
          interimTranscripts +
          "</span>";
      };

      speechRecognizer.onaudioend = function(event) {
        console.log("audio ended");
        this.microphone = false;
        classThis.stopSpeechAnimation();
        speechRecognizer.stop();
      };

      speechRecognizer.onerror = function(event) {};

      speechRecognizer.start();
    } else {
      this.stopSpeechAnimation();
      classThis.resultDiv.nativeElement.innerHTML =
        "Your browser is not supported. If google chrome, please upgrade!";
    }
  }

  saySomething(speechresult) {
    let msg = new SpeechSynthesisUtterance(speechresult);
    let voices = window.speechSynthesis.getVoices();
    setTimeout(() => {
      let voices = window.speechSynthesis.getVoices();

      let selectedVoice = voices.filter(voice => {
        if (voice.voiceURI === "Google UK English Female") {
          return voice;
        }
      });

      if (selectedVoice.length > 0) {
        msg.voice = selectedVoice[0];
      }

      console.log(speechresult);
      this.resultDiv.nativeElement.innerHTML = speechresult;
      window.speechSynthesis.speak(msg);
    }, 50);
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
    // return inputWords[inputWords.length - 1];

    const possibleName = [];
    inputWords.forEach(word => {
      if (!this.ignoreWordsArray.includes(word)) {
        possibleName.push(word);
      }
      
    });
    if(inputWords!== possibleName ){
      console.error("please speak the valid name to find details");
    this.saySomething("please speak the valid name to find details");
    }
    console.warn(possibleName);
    
    return possibleName[0];
   
   
  }

  startSpeechAnimation() {
    this.micButton.nativeElement.classList.add("microphone-on");
    this.micButton.nativeElement.classList.remove("animated");
    this.micButton.nativeElement.classList.remove("zoomIn");
  }

  stopSpeechAnimation() {
    this.micButton.nativeElement.classList.add("animated");
    this.micButton.nativeElement.classList.add("zoomIn");
    this.micButton.nativeElement.classList.remove("microphone-on");
  }
}
