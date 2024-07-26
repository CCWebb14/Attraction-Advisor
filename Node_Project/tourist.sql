DROP TABLE Locations CASCADE CONSTRAINTS;
DROP TABLE UserProfile CASCADE CONSTRAINTS;
DROP TABLE TouristAttractions1 CASCADE CONSTRAINTS;
DROP TABLE TouristAttractions2 CASCADE CONSTRAINTS;
DROP TABLE Transportation CASCADE CONSTRAINTS;
DROP TABLE ServicedBy CASCADE CONSTRAINTS;
DROP TABLE ExperienceOffered CASCADE CONSTRAINTS;
DROP TABLE Booking1 CASCADE CONSTRAINTS;
DROP TABLE Booking2 CASCADE CONSTRAINTS;
DROP TABLE Responses CASCADE CONSTRAINTS;
DROP TABLE Reviews CASCADE CONSTRAINTS;
DROP TABLE Comments CASCADE CONSTRAINTS;
DROP TABLE Photos CASCADE CONSTRAINTS;


CREATE TABLE Locations(
   province VARCHAR(2),
   city VARCHAR(20),
   PRIMARY KEY (province, city)
);


grant select on Locations to public;


CREATE TABLE UserProfile(
   userID number,
   userName varchar(20),
   PRIMARY KEY (userID)
);


grant select on UserProfile to public;


CREATE TABLE TouristAttractions1(
   latitude number(8, 5),
   longitude number(8, 5),
   province varchar(2),
   city varchar(20),
   PRIMARY KEY (latitude, longitude),
   FOREIGN KEY (province, city)
       REFERENCES Locations
       ON DELETE CASCADE
);


grant select on TouristAttractions1 to public;


CREATE TABLE TouristAttractions2(
   attractionID number,
   attractionName varchar(20),
   attractionDesc varchar(1000),
   category varchar(20),
   openingHour number(2, 0),
   closingHour number(2, 0),
   latitude number(8, 5),
   longitude number(8, 5),
   PRIMARY KEY (attractionID),
   FOREIGN KEY (latitude, longitude)
       REFERENCES TouristAttractions1
       ON DELETE CASCADE
);


grant select on TouristAttractions2 to public;


CREATE TABLE Transportation(
   vehicleID number,
   type varchar(20),
   price number(9, 2),
   PRIMARY KEY (vehicleID)
);


grant select on Transportation to public;


CREATE TABLE ServicedBy(
   vehicleID number,
   attractionID number,
   PRIMARY KEY (vehicleID, attractionID),
   FOREIGN KEY (vehicleID)
       REFERENCES Transportation
       ON DELETE CASCADE,
   FOREIGN KEY (attractionID)
       REFERENCES TouristAttractions2
       ON DELETE CASCADE
);


grant select on Transportation to public;


CREATE TABLE ExperienceOffered(
   experienceID number,
   attractionID number,
   experienceName varchar(20),
   experienceDesc varchar(1000),
   company varchar(20),
   price number(9, 2),
   PRIMARY KEY (experienceID),
   FOREIGN KEY (attractionID)
       REFERENCES TouristAttractions2
       ON DELETE CASCADE
);


grant select on ExperienceOffered to public;


CREATE TABLE Booking1(
   experienceID number,
   userID number,
   startTime date,
   attractionID number,
   PRIMARY KEY (experienceID, userID, startTime),
   FOREIGN KEY (attractionID)
       REFERENCES TouristAttractions2
       ON DELETE CASCADE,
   FOREIGN KEY (userID)
       REFERENCES UserProfile
       ON DELETE CASCADE
);


grant select on Booking1 to public;


CREATE TABLE Booking2(
   bookingID number,
   experienceID number,
   userID number,
   startTime date,
   endTime date,
   numOfPersons number,
   PRIMARY KEY (bookingID),
   FOREIGN KEY (experienceID, userID, startTime)
       REFERENCES Booking1
       ON DELETE CASCADE
);


grant select on Booking2 to public;


CREATE TABLE Responses (
   responseID int,
   userID int,
   attractionID int,
   responseDate DATE,
   body varchar(1000),
   PRIMARY KEY (responseID),
   FOREIGN KEY (userID)
       REFERENCES UserProfile
       ON DELETE CASCADE,
   FOREIGN KEY (attractionID)
       REFERENCES TouristAttractions2
       ON DELETE CASCADE
);


grant select on Responses to public;


CREATE TABLE Reviews (
   reviewID number,
   starRating number(1),
   PRIMARY KEY (reviewID),
   FOREIGN KEY (reviewID)
       REFERENCES Responses (responseID)
       ON DELETE CASCADE
);


grant select on Reviews to public;


CREATE TABLE Comments (
   commentID number,
   reviewID number,
   PRIMARY KEY (commentID),
   FOREIGN KEY (commentID)
       REFERENCES Responses (responseID)
       ON DELETE CASCADE,
   FOREIGN KEY (reviewID)
       REFERENCES reviews (reviewID)
       ON DELETE CASCADE
);


grant select on Comments to public;


CREATE TABLE Photos (
   photoID number,
   attractionID number,
   url varchar(2048),
   photoDescription varchar(1000),
   uploadDate date,
   PRIMARY KEY (photoID),
   FOREIGN KEY (attractionID)
       REFERENCES TouristAttractions2
       ON DELETE CASCADE
);

grant select on Photos to public;


insert into Locations
values('BC', 'Vancouver');
insert into Locations
values('BC', 'Victoria');
insert into Locations
values('AB', 'Calgary');
insert into Locations
values('ON', 'Ottawa');
insert into Locations
values('ON', 'Toronto');


insert into UserProfile
values(0, 'test0');
insert into UserProfile
values(1, 'test1');
insert into UserProfile
values(2, 'test2');
insert into UserProfile
values(3, 'test3');
insert into UserProfile
values(4, 'test4');


insert into TouristAttractions1
values(49.30427, -123.14421, 'BC', 'Vancouver');
insert into TouristAttractions1
values(48.42842, -123.36564, 'BC', 'Victoria');
insert into TouristAttractions1
values(51.04427, -114.06310, 'AB', 'Calgary');
insert into TouristAttractions1
values(45.42153, -75.69719, 'ON', 'Ottawa');
insert into TouristAttractions1
values(43.65107, -79.34702, 'ON', 'Toronto');


insert into TouristAttractions2
values(0, 'Stanley Park',
   q'[North America's third-largest park draws eight million visitors per year, many of whom may skate or walk past you on the Seawall, a scenic, 5.5-mile path running along the water on the park's perimeter. It's just one of many trails among the park's 1,000 acres, which also house an aquarium, nature center and other recreational facilities.]',
   'Parks', null, null, 49.30427, -123.14421);

insert into TouristAttractions2
values(1, 'Butchart Gardens',
   q'[A group of floral display gardens in Brentwood Bay, British Columbia, Canada, near Victoria on Vancouver Island. The gardens receive over a million visitors each year.]',
   'Parks', 9, 17, 48.42842, -123.36564);


insert into TouristAttractions2
values(2, 'Calgary Tower',
   q'[A 190.8-meter free standing observation tower in downtown Calgary, Alberta, Canada.]',
   'Landmarks', 08, 20, 51.04427, -114.06310);


insert into TouristAttractions2
values(3, 'Parliament Hill',
   q'[An area of Crown land on the southern banks of the Ottawa River in downtown Ottawa, Ontario. Its Gothic revival suite of buildings is the home of the Parliament of Canada.]',
   'Landmarks', 10, 18, 45.421530, -75.697191);


insert into TouristAttractions2
values(4, 'CN Tower',
   q'[A 553.3 m-high concrete communications and observation tower located in Downtown Toronto, Ontario.]',
   'Landmarks', null, null, 43.65107, -79.34702);

insert into Transportation
values(0, 'Translink', 3.00);

insert into Transportation
values(1, 'Mobi Bicycles', 10.00);

insert into Transportation
values(2, 'Yellow Cab Ottawa', 30.00);

insert into Transportation
values(3, 'Enterprise Calgary', 100.00);

insert into Transportation
values(4, 'Toronto Subway', 4.00);


insert into ServicedBy
values(0, 0);

insert into ServicedBy
values(0, 1);

insert into ServicedBy
values(3, 2);

insert into ServicedBy
values(3, 3);

insert into ServicedBy
values(4, 4);


insert into ExperienceOffered
values(0, 0, 'Seawall Walk', 'A scenic walk along the seawall in Stanley Park.', 'LocalTours', 30.00);

insert into ExperienceOffered 
values (1, 1, 'Garden Tour', 'A guided tour of the Butchart Gardens.', 'Gardens', 20.00 ); 

insert into ExperienceOffered 
values (2, 2, 'Tower Observation', 'An observation experience at the top of Calgary Tower.', 'Landmarks', 25.00 ); 

insert into ExperienceOffered 
values (3, 3, 'Historical Tour', 'A guided historical tour of Parliament Hill.', 'History', 15.00 ); 

insert into ExperienceOffered 
values (4, 4, 'Skyline View', 'An observation experience at the top of the CN Tower.', 'Landmarks', 35.00 );


INSERT INTO Booking1 VALUES (1, 0, TO_DATE('2024-07-20 12:30', 'YYYY-MM-DD HH24:MI'), 0); 

INSERT INTO Booking1 VALUES (2, 1, TO_DATE('2024-07-21 13:30', 'YYYY-MM-DD HH24:MI'), 1); 

INSERT INTO Booking1 VALUES (3, 2, TO_DATE('2024-07-22 15:40', 'YYYY-MM-DD HH24:MI'), 2); 

INSERT INTO Booking1 VALUES (4, 3, TO_DATE('2024-07-23 17:20', 'YYYY-MM-DD HH24:MI'), 3); 

INSERT INTO Booking1 VALUES (5, 4, TO_DATE('2024-07-24 8:30', 'YYYY-MM-DD HH24:MI'), 4);


INSERT INTO Booking2
VALUES (1, 1, 0, TO_DATE('2024-07-20 12:30', 'YYYY-MM-DD HH24:MI'), TO_DATE('2024-07-20 13:30', 'YYYY-MM-DD HH24:MI'), 2);

INSERT INTO Booking2
VALUES (2, 2, 1, TO_DATE('2024-07-21 13:30', 'YYYY-MM-DD HH24:MI'), TO_DATE('2024-07-21 15:40', 'YYYY-MM-DD HH24:MI'), 3);

INSERT INTO Booking2
VALUES (3, 3, 2, TO_DATE('2024-07-22 15:40', 'YYYY-MM-DD HH24:MI'), TO_DATE('2024-07-22 17:20', 'YYYY-MM-DD HH24:MI'), 4);

INSERT INTO Booking2
VALUES (4, 4, 3, TO_DATE('2024-07-23 17:20', 'YYYY-MM-DD HH24:MI'), TO_DATE('2024-07-23 18:00', 'YYYY-MM-DD HH24:MI'), 2);

INSERT INTO Booking2
VALUES (5, 5, 4, TO_DATE('2024-07-24 8:30', 'YYYY-MM-DD HH24:MI'), TO_DATE('2024-07-24 9:30', 'YYYY-MM-DD HH24:MI'), 1);


INSERT INTO Responses VALUES (1, 0, 0, TO_DATE('2024-07-20', 'YYYY-MM-DD'), 'Amazing experience at Stanley Park!'); 

INSERT INTO Responses VALUES (2, 1, 1, TO_DATE('2024-07-21', 'YYYY-MM-DD'), 'The Butchart Gardens were beautiful.'); 

INSERT INTO Responses VALUES (3, 2, 2, TO_DATE('2024-07-22', 'YYYY-MM-DD'), 'Great view from the Calgary Tower.'); 

INSERT INTO Responses VALUES (4, 3, 3, TO_DATE('2024-07-23', 'YYYY-MM-DD'), 'Very informative tour at Parliament Hill.'); 

INSERT INTO Responses VALUES (5, 4, 4, TO_DATE('2024-07-24', 'YYYY-MM-DD'), 'Stunning skyline view from the CN Tower.');


INSERT INTO Reviews VALUES (1, 5); 

INSERT INTO Reviews VALUES (2, 4); 

INSERT INTO Reviews VALUES (3, 5); 

INSERT INTO Reviews VALUES (4, 4);

INSERT INTO Reviews VALUES (5, 5);


INSERT INTO Comments VALUES (1, 1); 

INSERT INTO Comments VALUES (2, 2); 

INSERT INTO Comments VALUES (3, 3); 

INSERT INTO Comments VALUES (4, 4); 

INSERT INTO Comments VALUES (5, 5);


INSERT INTO Photos VALUES (1, 0, 'https://example.com/stanley_park.jpg', 'A beautiful view of Stanley Park.', TO_DATE('2024-07-20', 'YYYY-MM-DD')); 

INSERT INTO Photos VALUES (2, 1, 'https://example.com/butchart_gardens.jpg', 'Stunning flowers at Butchart Gardens.', TO_DATE('2024-07-21', 'YYYY-MM-DD')); 

INSERT INTO Photos VALUES (3, 2, 'https://example.com/calgary_tower.jpg', 'A view from Calgary Tower.', TO_DATE('2024-07-22', 'YYYY-MM-DD')); 

INSERT INTO Photos VALUES (4, 3, 'https://example.com/parliament_hill.jpg', 'Parliament Hill in Ottawa.', TO_DATE('2024-07-23', 'YYYY-MM-DD')); 

INSERT INTO Photos VALUES (5, 4, 'https://example.com/cn_tower.jpg', 'The CN Tower in Toronto.', TO_DATE('2024-07-24', 'YYYY-MM-DD'));
