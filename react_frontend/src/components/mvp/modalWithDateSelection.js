import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './modalWithDateSelection.css'
import { UserQueryServiceClient } from '../../proto/userquerysession_grpc_web_pb.js'
import { UserQuery } from '../../proto/userquerysession_pb'


function ModalWithDateSelection({ onSubmit }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };


  const handleSubmit = () => {
    // Here you can perform any actions with the selected dates
    console.log('Selected Start Date:', startDate);
    console.log('Selected End Date:', endDate);

    // Your code to submit form data here
    const userQuery = new UserQuery();
    userQuery.setDateStart(startDate);
    userQuery.setDateEnd(endDate);
    userQuery.setLocation("Los Angeles, California");

    // Initialize gRPC client.
    try {
      const client = new UserQueryServiceClient('http://127.0.0.1:1337');
      console.log(client)

      client.startSession(userQuery, {}, (err, response) => {
        console.log("Request went before error");

        if (err) {
          console.error("gRPC Error: ", err.message);
          console.error("gRPC Status Code: ", err.code);
          return;
        }
        console.log("Request went after error");

        const oidString = response.array[0]


        const byteMongoData = new Uint8Array(response.array[1]);
        const byteMongoArray = Array.from(byteMongoData);
        const byteMongoString = JSON.stringify(byteMongoArray);
        const byteMongoObject = JSON.parse(byteMongoString);
        const base64String = convertTobase64encoded(byteMongoObject)
        const base64Data = JSON.parse(base64String).oidResponse
        const finalJSONString = convertToJSON(base64Data)

        console.log("Received OID data:", oidString);
        console.log("Received response data:", finalJSONString)

        const responseData = JSON.parse(finalJSONString).data_for_bubble;
        onSubmit(responseData, oidString);
      });
    } catch (error) {
      console.error('Client Error:', error.code, error.message);
    }
    setShowModal(false);
  }

  function convertTobase64encoded(jsonByteObject) {
    const decoder = new TextDecoder('utf-8');
    const decodedString = decoder.decode(new Uint8Array(jsonByteObject));

    // const decodedString = String.fromCharCode.apply(null, jsonByteObject);
    const jsonObject = JSON.parse(decodedString);
    const base64String = JSON.stringify(jsonObject);
    return base64String;
  }

  function convertToJSON(base64Data) {
    const decodedString = atob(base64Data);
    return decodedString
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ padding: '0', border: 'none', background: 'none', width: '60px', height: '60px' }}>
        <img src="https://cdn-icons-png.flaticon.com/512/1427/1427965.png" alt="Open Modal" style={{ width: '100%', height: '100%' }} />
      </button>

      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" >Article Date Range</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="start-date">Start Date:</label>
                  <input type="date" id="start-date" className="form-control" value={startDate} onChange={handleStartDateChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="end-date">End Date:</label>
                  <input type="date" id="end-date" className="form-control" value={endDate} onChange={handleEndDateChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <Bubble prop={responseData} /> */}

    </div>
  );
}

ModalWithDateSelection.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Validate onSubmit prop as a function
};

export default ModalWithDateSelection;

// {
//   "articles": [
//     {
//       "author": "Marla Tellez",
//       "excerpt": "after months of red tape trying to get a visa for a bone marrow donor a los angeles dad battling a rare blood cancer is scheduled to have a potentially lifesaving bone marrow transplant later thisâ¦",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/amid-leukemia-battle-la-dads-034511480.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-14",
//       "rank": "0",
//       "title": "amid leukemia battle la dads bone marrow transplant hindered by visa delays",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "Mikhail",
//       "excerpt": "dr mike discusses a debilitating case of mycobacterium with bea amma",
//       "image_link": "",
//       "link": "https://www.youtube.com/watch?v=r4tnhnn45vg",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-14",
//       "rank": "0",
//       "title": "how flesheating bacteria destroyed a fitness influencers life",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "noreply@blogger.com",
//       "excerpt": "mindanao barmm basilan sulu tawitawi zamboanga southern philippines davao cebu regional newspaper media in mindanao",
//       "image_link": "",
//       "link": "http://mindanaoexaminernewspaper.blogspot.com/2024/03/zamboanga-reimagined.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-17",
//       "rank": "0",
//       "title": "zamboanga reimagined",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "Tom Maxwell",
//       "excerpt": "the american wine industry wouldnt be quite what it is today without los angeles heres how the famous city changed the industrys trajectory forever",
//       "image_link": "",
//       "link": "https://www.yahoo.com/lifestyle/los-angeles-majorly-influenced-american-121530556.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-12",
//       "rank": "0",
//       "title": "how los angeles majorly influenced the american wine industry",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "Ruben Vives",
//       "excerpt": "a worker at the los angeles port died monday morning after becoming trapped under a forklift the person was declared dead at the scene",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/port-los-angeles-worker-dies-204144424.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-18",
//       "rank": "0",
//       "summary": "a worker died monday after becoming trapped under a forklift at the los angeles port according to the los angeles fire department firefighters responded at 1039 am to a report of a worker trapped under a forklift at the los angeles port the fire department said in a statement upon arriving firefighters determined the person had died no further details were provided about the worker the california department of industrial relations los angeles port police and the los angeles county medical examiner will investigate the incident according to the us bureau of labor statistics the number of workers who are dying on the job has been increasing since 2013 in california more than 500 workers died on the job in 2022 an increased from 2021 when 462 workers died in 2022 the largest share of those workers who were fatally injured â 26 â were in the transportation and material moving occupations according to the bureau the department has not released data on occupational deaths for 2023 this story originally appeared in los angeles times",
//       "title": "port of los angeles worker dies after becoming trapped under a forklift",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "The Canadian Press",
//       "excerpt": "los angeles ap â robotaxis will begin cruising the streets of los angeles on thursday when google spinoff waymo starts offering free rides to some of the roughly 50000 people who have signed up for its driverless ridehailing service waymo is expanding into los angeles the second largest us city seven months after california regulators authorized its robotaxis to begin charging for aroundtheclock rides throughout san francisco that came despite objections from local officials who asse",
//       "image_link": "",
//       "link": "https://ca.finance.yahoo.com/news/waymos-robotaxi-expands-los-angeles-191940345.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-13",
//       "rank": "0",
//       "summary": "los angeles ap â robotaxis will begin cruising the streets of los angeles on thursday when google spinoff waymo starts offering free rides to some of the roughly 50000 people who have signed up for its driverless ridehailing service waymo is expanding into los angeles the second largest us city seven months after california regulators authorized its robotaxis to begin charging for aroundtheclock rides throughout san francisco that came despite objections from local officials who asserted the driverless vehicles posed unacceptable risks to public safety although waymo isnt charging for rides in its robotaxis in los angeles to start the company said in a blog post announcing the expansion that it will eventually collect fares from passengers there too waymo also hopes to begin commercial operations in austin texas later this year a goal that makes its robotaxi service available in four major us cities 15 years after it began as a secret project within google waymos robotaxis have been charging for rides in phoenix since 2020 for now waymos free rides in los angeles will cover a 63squaremile 101squarekilometer area spanning from santa monica to downtown waymo is launching operations in los angeles two weeks after the california public utilities commission approved the expansion in a decision that once again overrode the concerns of city transportation officials about robotaxis coming to sudden stops that block roads and the potential for driverless vehicles to malfunction in more serious ways that could jeopardize lives the worst fears about robotaxis were realized in san francisco last october when a vehicle operated by cruise a driverless ridehailing service owned by general motors dragged a pedestrian who was hit by another car operated by a human for 20 feet 6 meters while traveling at roughly 7 mph 11 kph before coming to a stop the incident resulted in california regulators suspending cruises state license and triggered a massive shakeup at that service waymos robotaxis so far havent been involved in any major accidents the associated press",
//       "title": "waymos robotaxi service expands into los angeles starting free rides in parts of the city",
//       "topic": "Science"
//     },
//     {
//       "author": "Genaro Molina",
//       "excerpt": "the march 11 edition of the los angeles times print edition will be its last at the los angeles times olympic printing plant in los angeles",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/photos-day-presses-stopped-running-142647032.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-11",
//       "rank": "0",
//       "summary": "the march 11 edition of the los angeles times print edition will be its last at the los angeles times olympic printing plant in los angeles the presses have gone silent starting with the march 12 print edition the paper will be printed in riverside by the southern california paper group with its circulation numbers remaining the same staff photographer genaro molina documented the closure of the storied plant sunday and the pressmen who made it all happen this story originally appeared in los angeles times",
//       "title": "photos the day the presses stopped running",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "Rachell Hallett",
//       "excerpt": "authorities believe brigette benitez kidnapped her biological 16monthold son in los angeles county",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/california-mom-wanted-alleged-kidnapping-003435271.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-09",
//       "rank": "0",
//       "summary": "los angeles authorities sought the publics help friday to find a woman and her 16monthold son officials said she has been charged with kidnapping the child from his foster family in los angeles county and is possibly fleeing with him to mexico the fbi is seeking the whereabouts of brigette benitez and her biological child miguel eduardo zuniga medina jr the fbi said in a statement authorities believe the 31yearold mother may have taken medina jr to aguascalientes mexico after failing to return him to his legal guardian following an unsupervised visit on february 6 in walnut the childs noncustodial father is believed to be living in aguascalientes authorities said benitez and her son were last seen in a black 2021 toyota camry with california license plate number 8was968 according to authorities suggested video shows woman being kidnapped in hayward a federal arrest warrant for benitez was obtained thursday after she was charged with international parental kidnapping in a criminal complaint filed in us district court in los angeles according to officials medina sr was arrested last year for an alleged domestic violence incident and has a history of engaging in violent altercations in the presence of children according to a juvenile dependency petition filed in los angeles county the fbi said in a statement medina jr was placed in the custody of dcfs following medina srs arrest the superior court in los angeles county found that it was necessary to remove medina jr from his parents for his own health safety and wellbeing officials said benitez and medina sr have also been charged in superior court in los angeles county the case is being investigated by the fbi and the los angeles county sheriffs department with the assistance of us customs and border patrol and the united states marshals service the united states attorneys office in los angeles is prosecuting benitez anyone with information as to the whereabouts of benitez or her son was asked to call their local fbi office or nearest us embassy or consulate information may also be provided at wwwtipsfbigov",
//       "title": "california mom wanted for alleged kidnapping crossing mexico border with young boy fbi",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "Cameron Diiorio",
//       "excerpt": "it is no secret that los angeles is an expensive city to live in learn more housing market 2024 avoid buying a home in these 4 california citiesfor you 6 genius things all wealthy people do",
//       "image_link": "",
//       "link": "https://finance.yahoo.com/news/5-most-affordable-los-angeles-170039999.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-02",
//       "rank": "0",
//       "title": "5 most affordable los angeles neighborhoods",
//       "topic": "Science"
//     },
//     {
//       "author": "Nathan Solis",
//       "excerpt": "the california public utilities commission on friday gave the green light for waymo to expand its driverless taxi service into los angeles and san mateo counties",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/waymo-cleared-launch-robotaxi-los-043339436.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-02",
//       "rank": "0",
//       "title": "waymo is cleared to launch robotaxi service in los angeles",
//       "topic": "Science"
//     },
//     {
//       "author": "Business Wire",
//       "excerpt": "los angeles march 18 2024the hotel association of los angeles hala announced today that dr jackie filla has been appointed the new president and ceo of the organization a seasoned leader withâ¦",
//       "image_link": "",
//       "link": "https://finance.yahoo.com/news/hotel-association-los-angeles-appoints-153800291.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-18",
//       "rank": "0",
//       "title": "hotel association of los angeles appoints jackie filla as new president and ceo",
//       "topic": "Science"
//     },
//     {
//       "author": "O. Gloria Okorie",
//       "excerpt": "waymo has won approval to expand its driverless taxi service into san mateo and los angeles counties",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/waymo-expansion-san-mateo-los-001441268.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-02",
//       "rank": "0",
//       "summary": "san francisco autonomous vehicle company waymo won approval to expand its driverless taxis into san mateo and los angeles counties after having its application briefly suspended by the california public utilities commission the expansion was approved friday and is effective immediately waymos expansion request was previously suspended in february after a cyclist was injured in san francisco and because of concerns raised by local leaders the mountain viewbased company had only been approved by california authorities to operate in san francisco county cpuc officials previously said this suspension would allow the company to have further discussions about what an expansion throughout the peninsula and southern california would look like cpuc officials said waymo had updated its passenger safety plan and expanded their operational design domain allowing for its approval waymo initially submitted its expansion request on jan 19 to the dismay of the city of south san francisco the county of san mateo the los angeles department of transportation the san francisco county transportation authority and the san francisco taxi workers alliance they had lodged their opposition to state regulators however waymo also received support from over 80 organizations for its expansion into these areas in a response waymo argued that the opposing voices failed to state a valid basis for protest and that they failed to identify any deficiencies in waymos updated psp among other things waymos updated safety plan includes new car features including enhanced exterior lighting and partnerships with some public safety agencies cpuc finds that waymo has complied with the requirements of the deployment decisionâ¦therefore cpuc approves waymos updated psp and authorizes expansion of waymos driverless deployment service to the areas of los angeles and the san francisco peninsula it has requested the cpuc said in a statement state sen dave cortese dsan jose released a statement regarding the expansion approval saying while we support the innovation of autonomous vehicle technology its crucial that regulation occurs at both state and local levels to maintain the public safety standards that california upholds for all vehicles on our roadsâ¦my bill isnt about eliminating state oversight but augmenting it with local expertise to protect pedestrians school zones cyclists and other motorists",
//       "title": "waymo expansion into san mateo los angeles counties gets approved",
//       "topic": "Science"
//     },
//     {
//       "author": "Louis Casiano",
//       "excerpt": "a california district attorney is warning criminals to stay out of his county or else face prosecution for their offenses",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/california-da-warns-thieves-stay-020931389.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-14",
//       "rank": "0",
//       "summary": "a southern california district attorney is warning wouldbe criminals from neighboring counties to think twice before committing crimes in his jurisdiction via a public safety campaign the ad campaign by the orange county district attorneys office is in response to the rash of smashandgrab robberies home burglaries and other crimes that have garnered headlines the office headed by district attorney todd spitzer noted that many of the crimes are committed by offenders who live outside the county sacramento may be rolling out the red carpet for thieves but here in orange county were throwing the book at criminals who come here to steal spitzer said in a statement referring to perceived softoncrime policies endorsed by legislators in the state capital if you steal we will prosecute its that simple huge mob ransacks california gas station police âoutnumbered video when the risk is far less than the reward its no surprise that criminals are committing smash and grabs residential burglaries and simply walking out the front door of stores with arms full of stolen merchandise while youre standing in line waiting to pay for your items he added the campaign is funded by federal civil asset forfeiture money and is expected to reach more than 38 million people over a fourweek period the ads include billboards that read crime doesnt pay in orange county if you steal we prosecute the orange county district attorneys office many of the ads are along major freeways coming into orange county from neighboring los angeles and riverside counties ads will also be placed on buses in los angeles long beach and other cities as well as bumper stickers and text messages targeting cellphones users in orange los angeles riverside san bernardino san diego and imperial counties spitzer has come out against softoncrime policies and elected officials in the past in 2022 he compared his opponent to los angeles county district attorney george gascÃ³n who has been heavily criticized for his progressive criminal justice directives hes already announced exactly the same lines as george gascÃ³n spitzer is heard saying in the twominute video titled gotham no bail no death penalty no sentencing enhancements original article source california da warns thieves to stay away or else were throwing the book at criminals",
//       "title": "california da warns thieves to stay away or else were throwing the book at criminals",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "Storyful",
//       "excerpt": "a us mail carrier was attacked while on the job in a gardena california neighborhood on february 21home security footage captured the moment a man followed the mail carrier down a driveway before hitting him in the back of the head the mail carrier can be seen dropping his bag of envelopes and attempts to confront his attacker but is slammed to the groundaccording to nbc los angeles the mail carrier said the man was upset over a package he was expectingthe los angeles police department told nbc la they are investigating the incident and the mail carrier is hoping for federal charges against his assailant who was identified as a known nuisance by numerous neighbors according to the report credit garrett rodriguez via storyful",
//       "image_link": "",
//       "link": "https://ca.news.yahoo.com/mailman-assaulted-california-neighborhood-145733361.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-11",
//       "rank": "0",
//       "summary": "a us mail carrier was attacked while on the job in a gardena california neighborhood on february 21 home security footage captured the moment a man followed the mail carrier down a driveway before hitting him in the back of the head the mail carrier can be seen dropping his bag of envelopes and attempts to confront his attacker but is slammed to the ground according to nbc los angeles the mail carrier said the man was upset over a package he was expecting the los angeles police department told nbc la they are investigating the incident and the mail carrier is hoping for federal charges against his assailant who was identified as a known nuisance by numerous neighbors according to the report credit garrett rodriguez via storyful no audio",
//       "title": "mailman assaulted in california neighborhood",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "Brianna Taylor",
//       "excerpt": "state jobs are known for offering competitive benefits and enrollment in the nations largest public pension plan",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/33-000-month-california-list-160000653.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-08",
//       "rank": "0",
//       "summary": "the state of california is looking for workers for multiple highpaying positions â from correctional health care to legal work at the california department of justice and other agencies state jobs are known for offering competitive benefits and enrollment in the nations largest public pension plan many of the following jobs have specific requirements which are linked sift through some of the states highest paid positions available on the calcareers website posted between feb 29 and march 7 chief psychiatrist permanent fulltime hybrid location madera county department california correctional health care services salary 26961 to 33417 per month the chief psychiatrist oversees treatment services for inmates at the central california womens facility in madera county a hybrid work schedule is available calcareers stated the application period closes on april 2 principal engineer water resources permanent fulltime location sacramento county department california department of water resources salary 14527 to 16501 per month the principal engineer oversees the departments structural engineering branch including its program projects and employees a hybrid work schedule is available calcareers states the application period closes on march 18 pharmacist permanent fulltime location riverside county department correctional health care services salary 14263 to 15428 per month the pharmacist oversees pharmaceutical work and services at ironwood state prison in riverside county the application period closes on march 15 special agent in charge permanent fulltime location riverside county department california department of justice salary 11947 to 14902 per month the special agent in charge oversees operations at the state justice departments bureau of firearms offices in riverside los angeles and san diego the application period closes on march 20 similar positions are open in los angeles and san diego counties attorney permanent fulltime location yolo county department california commission on peace officer standards and training salary 11644 to 14954 per month the attorney is the departments point person on sensitive and complex legal matters the application period closes on march 19 a similar position is open in los angeles there are also countrywide telework options what do you want to know about life in sacramento ask our service journalism team your topofmind questions in the module below or email servicejournalistssacbeecom",
//       "title": "33000 a month in california heres a list of new highpaying state jobs with benefits",
//       "topic": "Science"
//     },
//     {
//       "author": "Reuters",
//       "excerpt": "the company received approval from the california public utilities commission cpuc earlier this month to start its ridehailing program waymo one in los angeles and some cities near san francisco waymos latest plans put it ahead of its general motorsowned rival cruise which is currently facing scrutiny after a driverless cruise car dragged a pedestrian 20 feet after an accident the company said services will be available across 63 square miles from santa monica to downtown los angeles adding that the initial rides will be free",
//       "image_link": "",
//       "link": "https://finance.yahoo.com/news/waymo-start-offering-free-driverless-171240546.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-13",
//       "rank": "0",
//       "summary": "reuters alphabets waymo said on wednesday it will begin offering free driverless robotaxi services to select members of the public in los angeles starting thursday the company received approval from the california public utilities commission cpuc earlier this month to start its ridehailing program waymo one in los angeles and some cities near san francisco waymos latest plans put it ahead of its general motorsowned rival cruise which is currently facing scrutiny after a driverless cruise car dragged a pedestrian 20 feet after an accident the company said services will be available across 63 square miles from santa monica to downtown los angeles adding that the initial rides will be free well permanently welcome riders into our service gradually onboarding the more than 50000 people on our la waitlist and continuing to hand out temporary codes at local events throughout the city waymo said in a blog post the company further added that it will expand its operations in los angeles over time and transition to paid services in the coming weeks waymo started autonomous services for its employees in austin texas making it the fourth autonomous ridehailing city after san francisco phoenix and los angeles it plans to offer waymo one to the broader public in austin later in the year reporting by harshita mary varghese editing by tasim zahid",
//       "title": "waymo to start offering free driverless robotaxi services in los angeles",
//       "topic": "Science"
//     },
//     {
//       "author": "JOHN ANTCZAK",
//       "excerpt": "a landslide reduced a los angeles house under renovation to a jumble of lumber pulled the pool and deck away from a second home and left the pool at a third residence on the edge of a huge fissureâ¦",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/landslide-destroys-los-angeles-home-155155580.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-13",
//       "rank": "0",
//       "summary": "los angeles ap â a landslide reduced a los angeles house under renovation to a jumble of lumber pulled the pool and deck away from a second home and left the pool at a third residence on the edge of a huge fissure early wednesday the slide occurred just before 3 am in sherman oaks a neighborhood of expensive homes about 12 miles 19 kilometers northwest of downtown an initial search found no victims but several people were evacuated from one house the los angeles fire department said in a statement there was no immediate word on the cause of the landslide but numerous slides have happened in southern california due to drenching winter storms that saturated the ground since jan 1 downtown la has had almost 16 inches 41 centimeters of rain which is nearly twice what it normally gets by this time of year by early february the city had reported nearly 600 mudslides had retagged 16 buildings as unsafe to enter and had yellowtagged more than 30 others limiting access to them helicopter video revealed the extent of the slide the destroyed house which appeared to be in the midst of a renovation was crushed with most of its roof lying on the ground next door the slide pulled a pool and deck area away from a house up the hill the slide left a tennis court and pool on the edge of a huge fissure a table and chairs that used to be poolside stood on a patch of deck on the other side of the gaping fissure firefighters drained the pool to reduce weight on the hill department of building and safety is responding to assess the structures and hillsides the fire department said southern california has seen a lull in storms in recent days but slides and rockfalls have continued sections of pacific coast highway in malibu and state route 27 through topanga canyon west of los angeles have been especially hardhit south of la a notable slide in the city of dana point left an ocean view estate on the edge of a coastal bluff some rain could return this weekend the national weather service said",
//       "title": "landslide destroys los angeles home and threatens at least 2 others",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "AFP",
//       "excerpt": "the us coast guard is investigating a twomilelong oil spill just off the california coast near los angeles officials said fridaythe coast guard said a patrol boat and helicopter has ascertainedâ¦",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/us-coast-guard-investigates-los-213539052.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-08",
//       "rank": "0",
//       "summary": "the us coast guard is investigating a twomilelong oil spill just off the california coast near los angeles officials said friday the spill is located close to two oil rigs off the shore of huntington beach a popular beach city known for its worldfamous surfing but the source is not yet known the coast guard said in a statement the coast guard is contacting all potential spill sources in the area but no source has been identified it said authorities are working to identify possible impacts to the shoreline and environmental protection strategies but so far no oiled wildlife has been observed the statement said the spill was first spotted on thursday night but was initially suspected to be a sewage release said californias wildlife department but an overflight this morning observed oil sheen more info to come said the departments office of spill prevention and response the coast guard said a patrol boat and helicopter has ascertained the sheen was currently 25 miles long and half a mile wide the city of huntington beach has not yet ordered any beaches to be closed in 2021 a cracked pipeline leaked an estimated 25000 gallons of crude oil onto beaches in the area south of los angeles the waters are home to wildlife including whales dolphins and otters amzcaw",
//       "title": "us coast guard investigates los angeles oil spill",
//       "topic": "Science"
//     },
//     {
//       "author": "Will Conybeare",
//       "excerpt": "voters in los angeles have elected to approve measure hla a highly debated initiative that would require the city to make roads and walkways safer from deadly car crashes the measure passed by aâ¦",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/los-angeles-voters-approve-safe-161101592.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-06",
//       "rank": "0",
//       "summary": "voters in los angeles have elected to approve measure hla a highly debated initiative that would require the city to make roads and walkways safer from deadly car crashes the measure passed by a margin of 63 percent to 37 percent measure hla also known as healthy streets la will implement mobility plan 2035 which calls for additional safety measures on city streets like widening sidewalks installing protected bike lanes and adding road elements to prevent speeding many la city councilmembers were in favor of the measure saying that streets are becoming more dangerous for pedestrians each year in 2023 alone 337 people were killed in crashes â a record high for one year â while a further 1559 people were severely injured car collisions are also the leading cause of death for children in la the los angeles times reported those against the initiative included local firefighters who said that the measure would make it less safe for emergency vehicles to navigate already congested la streets small businesses would be impacted as well firefighters said at a february news conference due to the measure taking away parking spaces other critics of measure hla cited concerns over cost los angeles city administrative officer matt szabo told the la times that it would cost the city 31 billion over the next 10 years without delivering additional transportation funds the only state legislative issue on the ballot this march was proposition 1 which would overhaul californias behavioral health services program as of 7 am wednesday the race was deadlocked at 50 percent each with yes votes holding a slight advantage click here to view more california primary election results",
//       "title": "los angeles voters approve âsafe streets measure hla",
//       "topic": "Science"
//     },
//     {
//       "author": "Los Angeles Times Opinion",
//       "excerpt": "from relief over avoiding an intraparty battle in november to disgust that a democrat would elevate a republican readers react to adam schiff vs steve garvey",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/letters-editor-adam-schiff-vs-185003951.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-06",
//       "rank": "0",
//       "summary": "to the editor this lifelong democrat is relieved that there likely will not be a contest between reps adam schiff dburbank and katie porter dirvine for californias open us senate in november in our strongly democratic state schiff will easily defeat the utterly unqualified celebrity republican steve garvey democrats will be able to route the millions of dollars that would otherwise have been spent on a unitydamaging intraparty race toward important gopversusdemocrat battles in california and across the country its a win for california and for democracy marcy miroff rothenberg porter ranch to the editor im surprised about the handwringing over schiffs ads targeting garvey instead of his democratic primary opponents even in the absence of these ads does any democrat seriously believe that republicans would vote for someone other than garvey garvey despite his lack of experience and integrity was always going to be second on the ballot regardless of which democrat held the top spot valerie lezin los angeles to the editor i have no doubt that schiffs endless tv ads about garvey helped to propel the former dodgers great into securing a spot on the november ballot but the congressman ought to proceed with caution in 1976 another republican political newcomer the septuagenarian semanticist si hayakawa won the us senate race in california can it be done again i dont know but if anybody can do it it will be garvey a baseball hero and allaround good guy david tulanian henderson nev to the editor lets face it â garvey is the model candidate for todays republican party he is 74 years old has no experience in government or public service cheated on his wife and didnt pay his bills why should he waste his time running for senator when he is the perfect presidential candidate liz sherwin los angeles to the editor i hope other people feel the same way i do on how schiff ran his campaign i am a lifelong democrat who will not be voting for him in the fall being afraid of running against a fellow democrat as capable as him was no reason to prop up an unqualified magaloving guy why would i consider someone like that to represent me and the state of california fred mandel encino this story originally appeared in los angeles times",
//       "title": "letters to the editor its adam schiff vs steve garvey is this the best senate matchup for california",
//       "topic": "Healthcare"
//     },
//     {
//       "author": "Julia Wick",
//       "excerpt": "the state remains a battleground for several seats in the us house of representatives",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/california-voters-shape-control-congress-020015690.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-06",
//       "rank": "0",
//       "title": "california voters can shape control of congress",
//       "topic": "Science"
//     },
//     {
//       "author": "Chris Oberholtz",
//       "excerpt": "the recent heavy rains and storm damage in the region are believed to be responsible for the landslide the saturated land can take up to a month to give way sources tell fox 11 in los angeles",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/landslide-los-angeles-neighborhood-destroys-151233098.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-13",
//       "rank": "0",
//       "title": "landslide in los angeles neighborhood destroys home damages several others",
//       "topic": "Science"
//     },
//     {
//       "author": "Tony Kurzweil",
//       "excerpt": "damaging santa ana winds tore through southern california overnight toppling trees and damaging cars one incident occurred as powerful gusts blew around 2 am thursday in the lake balboaâ¦",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/damaging-santa-ana-winds-blast-115842783.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-14",
//       "rank": "0",
//       "title": "damaging santa ana winds blast southern california",
//       "topic": "Science"
//     },
//     {
//       "author": "Julia Wick",
//       "excerpt": "early returns showed republican alex balekian in second place in the laarea congressional district race",
//       "image_link": "",
//       "link": "https://www.yahoo.com/news/laura-friedman-takes-early-lead-163058463.html",
//       "location": "Los Angeles, California",
//       "published_date": "2024-03-06",
//       "rank": "0",
//       "title": "laura friedman takes early lead in race for schiffs former house seat",
//       "topic": "Healthcare"
//     }
//   ],
//   "data_for_bubble": {
//     "Education": 1,
//     "Healthcare": 56.00000000000001,
//     "Science": 43
//   }
// }